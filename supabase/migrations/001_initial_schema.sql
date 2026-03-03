-- Chatterbox Initial Schema
-- Run this migration in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES (created first, RLS policies with cross-references added after)
-- ============================================================

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  display_name text,
  avatar_url text,
  phone text,
  job_title text,
  company text,
  timezone text,
  locale text default 'en',
  bio text,
  website text,
  auth_provider text,
  status text,
  status_emoji text,
  email_verified boolean default false not null,
  onboarding_completed boolean default false not null,
  last_seen_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- VERIFICATION CODES
create table public.verification_codes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now() not null
);

create index idx_verification_codes_user_id on public.verification_codes(user_id);
create index idx_verification_codes_email_code on public.verification_codes(email, code);

-- WORKSPACES
create table public.workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- WORKSPACE MEMBERS
create table public.workspace_members (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'guest')),
  joined_at timestamptz default now() not null,
  unique(workspace_id, user_id)
);

-- CHANNELS
create table public.channels (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  description text,
  type text not null default 'public' check (type in ('public', 'private', 'dm')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- CHANNEL MEMBERS
create table public.channel_members (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references public.channels(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now() not null,
  last_read_at timestamptz,
  unique(channel_id, user_id)
);

-- MESSAGES
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references public.channels(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  parent_id uuid references public.messages(id) on delete cascade,
  is_edited boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_messages_channel_id on public.messages(channel_id);
create index idx_messages_parent_id on public.messages(parent_id);
create index idx_messages_created_at on public.messages(created_at);

-- REACTIONS
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now() not null,
  unique(message_id, user_id, emoji)
);

-- FILE ATTACHMENTS
create table public.files (
  id uuid default uuid_generate_v4() primary key,
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size bigint not null,
  created_at timestamptz default now() not null
);

-- WORKSPACE INVITATIONS
create table public.workspace_invitations (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'guest')),
  invited_by uuid references public.profiles(id) on delete set null,
  token uuid default uuid_generate_v4() not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now() not null
);

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.verification_codes enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.messages enable row level security;
alter table public.reactions enable row level security;
alter table public.files enable row level security;
alter table public.workspace_invitations enable row level security;

-- ============================================================
-- RLS POLICIES (all tables exist, safe to cross-reference)
-- ============================================================

-- Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Verification Codes
create policy "Users can view own verification codes"
  on public.verification_codes for select using (auth.uid() = user_id);

create policy "Service role can manage verification codes"
  on public.verification_codes for all using (true);

-- Workspaces
create policy "Workspace members can view workspace"
  on public.workspaces for select using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create workspaces"
  on public.workspaces for insert with check (auth.uid() = created_by);

create policy "Workspace admins can update workspace"
  on public.workspaces for update using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- Workspace Members
create policy "Members can view workspace members"
  on public.workspace_members for select using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
    )
  );

create policy "Admins can manage workspace members"
  on public.workspace_members for insert with check (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
    or auth.uid() = user_id -- Allow self-join via invitation
  );

create policy "Admins can remove workspace members"
  on public.workspace_members for delete using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
    or auth.uid() = user_id -- Allow self-removal
  );

-- Channels
create policy "Public channel members can view channels"
  on public.channels for select using (
    type = 'public' and exists (
      select 1 from public.workspace_members
      where workspace_id = channels.workspace_id and user_id = auth.uid()
    )
    or exists (
      select 1 from public.channel_members
      where channel_id = channels.id and user_id = auth.uid()
    )
  );

create policy "Workspace members can create channels"
  on public.channels for insert with check (
    exists (
      select 1 from public.workspace_members
      where workspace_id = channels.workspace_id and user_id = auth.uid()
    )
  );

-- Channel Members
create policy "Channel members can view membership"
  on public.channel_members for select using (
    exists (
      select 1 from public.channel_members cm
      where cm.channel_id = channel_members.channel_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Channel members can join public channels"
  on public.channel_members for insert with check (
    auth.uid() = user_id
  );

-- Messages
create policy "Channel members can view messages"
  on public.messages for select using (
    exists (
      select 1 from public.channel_members
      where channel_id = messages.channel_id and user_id = auth.uid()
    )
  );

create policy "Channel members can send messages"
  on public.messages for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.channel_members
      where channel_id = messages.channel_id and user_id = auth.uid()
    )
  );

create policy "Users can edit own messages"
  on public.messages for update using (auth.uid() = user_id);

create policy "Users can delete own messages"
  on public.messages for delete using (auth.uid() = user_id);

-- Reactions
create policy "Channel members can view reactions"
  on public.reactions for select using (
    exists (
      select 1 from public.messages m
      join public.channel_members cm on cm.channel_id = m.channel_id
      where m.id = reactions.message_id and cm.user_id = auth.uid()
    )
  );

create policy "Users can add reactions"
  on public.reactions for insert with check (auth.uid() = user_id);

create policy "Users can remove own reactions"
  on public.reactions for delete using (auth.uid() = user_id);

-- Files
create policy "Channel members can view files"
  on public.files for select using (
    exists (
      select 1 from public.messages m
      join public.channel_members cm on cm.channel_id = m.channel_id
      where m.id = files.message_id and cm.user_id = auth.uid()
    )
  );

create policy "Users can upload files"
  on public.files for insert with check (auth.uid() = user_id);

-- Workspace Invitations
create policy "Admins can view invitations"
  on public.workspace_invitations for select using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspace_invitations.workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

create policy "Admins can create invitations"
  on public.workspace_invitations for insert with check (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspace_invitations.workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, email, full_name, display_name, avatar_url, phone,
    job_title, company, timezone, auth_provider
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'job_title',
    new.raw_user_meta_data->>'company',
    coalesce(new.raw_user_meta_data->>'timezone', 'UTC'),
    coalesce(new.raw_user_meta_data->>'auth_provider', 'email')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.update_updated_at();

create trigger update_channels_updated_at
  before update on public.channels
  for each row execute function public.update_updated_at();

create trigger update_messages_updated_at
  before update on public.messages
  for each row execute function public.update_updated_at();

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.reactions;
