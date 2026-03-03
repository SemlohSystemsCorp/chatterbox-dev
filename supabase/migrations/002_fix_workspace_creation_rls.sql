-- Fix workspace creation RLS policies
-- Problem: After creating a workspace, the creator cannot SELECT it (because they're
-- not yet in workspace_members) and cannot INSERT themselves into workspace_members
-- (because the policy requires being an existing admin/owner).

-- 1. Fix workspace SELECT: allow creators to see their own workspace
drop policy "Workspace members can view workspace" on public.workspaces;

create policy "Workspace members can view workspace"
  on public.workspaces for select using (
    auth.uid() = created_by
    or exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id and user_id = auth.uid()
    )
  );

-- 2. Fix workspace_members INSERT: allow workspace creators to add themselves as the first member
drop policy "Admins can manage workspace members" on public.workspace_members;

create policy "Admins can manage workspace members"
  on public.workspace_members for insert with check (
    -- Existing admins/owners can add members
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
    -- Users can add themselves (self-join via invitation)
    or auth.uid() = user_id
  );

-- 3. Fix workspace_members SELECT: allow workspace creators to view members
-- even before they've added themselves (needed for the creation flow)
drop policy "Members can view workspace members" on public.workspace_members;

create policy "Members can view workspace members"
  on public.workspace_members for select using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
    )
    or exists (
      select 1 from public.workspaces w
      where w.id = workspace_members.workspace_id
        and w.created_by = auth.uid()
    )
  );

-- 4. Fix channels INSERT: the creator needs to be a workspace member to create channels,
-- but they just added themselves. This should work with the existing policy since
-- the workspace_members INSERT happens before the channel INSERT.
-- However, let's also allow workspace creators as a fallback.
drop policy "Workspace members can create channels" on public.channels;

create policy "Workspace members can create channels"
  on public.channels for insert with check (
    exists (
      select 1 from public.workspace_members
      where workspace_id = channels.workspace_id and user_id = auth.uid()
    )
    or exists (
      select 1 from public.workspaces
      where id = channels.workspace_id and created_by = auth.uid()
    )
  );

-- 5. Fix channels SELECT: workspace creators should be able to see channels
-- they just created even before channel_members is populated
drop policy "Public channel members can view channels" on public.channels;

create policy "Channel and workspace members can view channels"
  on public.channels for select using (
    -- Public channels visible to workspace members
    (type = 'public' and exists (
      select 1 from public.workspace_members
      where workspace_id = channels.workspace_id and user_id = auth.uid()
    ))
    -- Members of the channel can always see it
    or exists (
      select 1 from public.channel_members
      where channel_id = channels.id and user_id = auth.uid()
    )
    -- Workspace creators can see all channels in their workspace
    or exists (
      select 1 from public.workspaces
      where id = channels.workspace_id and created_by = auth.uid()
    )
  );

-- 6. Fix channel_members SELECT: allow viewing if you're the workspace creator
drop policy "Channel members can view membership" on public.channel_members;

create policy "Channel members can view membership"
  on public.channel_members for select using (
    exists (
      select 1 from public.channel_members cm
      where cm.channel_id = channel_members.channel_id
        and cm.user_id = auth.uid()
    )
    or exists (
      select 1 from public.channels c
      join public.workspaces w on w.id = c.workspace_id
      where c.id = channel_members.channel_id
        and w.created_by = auth.uid()
    )
  );
