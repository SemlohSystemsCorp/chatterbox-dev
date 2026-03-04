-- ============================================================
-- Chatterbox — Full database schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  display_name text not null,
  username    text not null unique,
  avatar_url  text,
  date_of_birth date,
  status      text not null default 'online' check (status in ('online','idle','dnd','offline')),
  custom_status text,
  bio         text,
  plan        text not null default 'free' check (plan in ('free','pro','enterprise')),
  stripe_customer_id text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Service role can insert profiles"
  on public.profiles for insert with check (true);

-- ============================================================
-- SERVERS (table only — RLS added after members)
-- ============================================================
create table public.servers (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  icon_url    text,
  banner_url  text,
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  invite_code text not null unique default substr(md5(random()::text), 1, 8),
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.servers enable row level security;

-- ============================================================
-- MEMBERS (must exist before server/channel/category RLS)
-- ============================================================
create table public.members (
  id        uuid primary key default uuid_generate_v4(),
  server_id uuid not null references public.servers(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  role      text not null default 'member' check (role in ('owner','admin','moderator','member')),
  nickname  text,
  joined_at timestamptz not null default now(),
  unique(server_id, user_id)
);

alter table public.members enable row level security;

-- ============================================================
-- SERVER RLS (now that members exists)
-- ============================================================
create policy "Servers visible to members"
  on public.servers for select using (
    is_public = true
    or exists (
      select 1 from public.members m where m.server_id = id and m.user_id = auth.uid()
    )
  );

create policy "Server owners can update"
  on public.servers for update using (owner_id = auth.uid());

create policy "Authenticated users can create servers"
  on public.servers for insert with check (auth.uid() = owner_id);

create policy "Server owners can delete"
  on public.servers for delete using (owner_id = auth.uid());

-- ============================================================
-- MEMBERS RLS
-- ============================================================
create policy "Members visible to server members"
  on public.members for select using (
    exists (
      select 1 from public.members m2 where m2.server_id = members.server_id and m2.user_id = auth.uid()
    )
  );

create policy "Users can join servers"
  on public.members for insert with check (auth.uid() = user_id);

create policy "Users can leave servers"
  on public.members for delete using (auth.uid() = user_id);

create policy "Admins can manage members"
  on public.members for update using (
    exists (
      select 1 from public.members m
      where m.server_id = members.server_id
        and m.user_id = auth.uid()
        and m.role in ('owner','admin')
    )
  );

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id         uuid primary key default uuid_generate_v4(),
  server_id  uuid not null references public.servers(id) on delete cascade,
  name       text not null,
  position   int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories visible to server members"
  on public.categories for select using (
    exists (
      select 1 from public.members m where m.server_id = categories.server_id and m.user_id = auth.uid()
    )
  );

create policy "Admins can manage categories"
  on public.categories for all using (
    exists (
      select 1 from public.members m
      where m.server_id = categories.server_id
        and m.user_id = auth.uid()
        and m.role in ('owner','admin')
    )
  );

-- ============================================================
-- CHANNELS
-- ============================================================
create table public.channels (
  id          uuid primary key default uuid_generate_v4(),
  server_id   uuid not null references public.servers(id) on delete cascade,
  name        text not null,
  description text,
  type        text not null default 'text' check (type in ('text','voice','announcement','forum','stage')),
  position    int not null default 0,
  category_id uuid references public.categories(id) on delete set null,
  is_private  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.channels enable row level security;

create policy "Channels visible to server members"
  on public.channels for select using (
    exists (
      select 1 from public.members m where m.server_id = channels.server_id and m.user_id = auth.uid()
    )
  );

create policy "Admins can manage channels"
  on public.channels for all using (
    exists (
      select 1 from public.members m
      where m.server_id = channels.server_id
        and m.user_id = auth.uid()
        and m.role in ('owner','admin')
    )
  );

-- ============================================================
-- MESSAGES
-- ============================================================
create table public.messages (
  id          uuid primary key default uuid_generate_v4(),
  channel_id  uuid not null references public.channels(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  edited_at   timestamptz,
  reply_to_id uuid references public.messages(id) on delete set null,
  attachments jsonb,
  reactions   jsonb,
  pinned      boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Messages visible to channel members"
  on public.messages for select using (
    exists (
      select 1
      from public.channels c
      join public.members m on m.server_id = c.server_id
      where c.id = messages.channel_id and m.user_id = auth.uid()
    )
  );

create policy "Members can send messages"
  on public.messages for insert with check (
    auth.uid() = author_id
    and exists (
      select 1
      from public.channels c
      join public.members m on m.server_id = c.server_id
      where c.id = messages.channel_id and m.user_id = auth.uid()
    )
  );

create policy "Authors can edit own messages"
  on public.messages for update using (auth.uid() = author_id);

create policy "Authors can delete own messages"
  on public.messages for delete using (auth.uid() = author_id);

-- ============================================================
-- DIRECT MESSAGES
-- ============================================================
create table public.direct_messages (
  id          uuid primary key default uuid_generate_v4(),
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  attachments jsonb,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.direct_messages enable row level security;

create policy "Users can see own DMs"
  on public.direct_messages for select using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

create policy "Users can send DMs"
  on public.direct_messages for insert with check (auth.uid() = sender_id);

create policy "Users can update own DMs"
  on public.direct_messages for update using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- ============================================================
-- FRIENDS
-- ============================================================
create table public.friends (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  status    text not null default 'pending' check (status in ('pending','accepted','blocked')),
  created_at timestamptz not null default now(),
  unique(user_id, friend_id)
);

alter table public.friends enable row level security;

create policy "Users can see own friends"
  on public.friends for select using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can send friend requests"
  on public.friends for insert with check (auth.uid() = user_id);

create policy "Users can update friend status"
  on public.friends for update using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can remove friends"
  on public.friends for delete using (auth.uid() = user_id or auth.uid() = friend_id);

-- ============================================================
-- VERIFICATION CODES (for email OTP)
-- ============================================================
create table public.verification_codes (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  code       text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- No RLS — only accessed by service role from API routes
alter table public.verification_codes enable row level security;

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_members_user_id on public.members(user_id);
create index idx_members_server_id on public.members(server_id);
create index idx_channels_server_id on public.channels(server_id);
create index idx_messages_channel_id on public.messages(channel_id);
create index idx_messages_created_at on public.messages(created_at);
create index idx_direct_messages_sender on public.direct_messages(sender_id);
create index idx_direct_messages_receiver on public.direct_messages(receiver_id);
create index idx_friends_user_id on public.friends(user_id);
create index idx_friends_friend_id on public.friends(friend_id);
create index idx_servers_invite_code on public.servers(invite_code);
create index idx_profiles_username on public.profiles(username);
create index idx_verification_codes_email on public.verification_codes(email);

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.direct_messages;
alter publication supabase_realtime add table public.members;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create a #general channel when a server is created
create or replace function public.handle_new_server()
returns trigger as $$
begin
  -- Add owner as member
  insert into public.members (server_id, user_id, role)
  values (new.id, new.owner_id, 'owner');

  -- Create default category
  insert into public.categories (id, server_id, name, position)
  values (uuid_generate_v4(), new.id, 'Text Channels', 0);

  -- Create #general channel
  insert into public.channels (server_id, name, description, type, position, category_id)
  select new.id, 'general', 'General discussion', 'text', 0, c.id
  from public.categories c where c.server_id = new.id limit 1;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_server_created
  after insert on public.servers
  for each row execute function public.handle_new_server();

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; 
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_servers_updated_at
  before update on public.servers
  for each row execute function public.handle_updated_at();

create trigger set_channels_updated_at
  before update on public.channels
  for each row execute function public.handle_updated_at();
