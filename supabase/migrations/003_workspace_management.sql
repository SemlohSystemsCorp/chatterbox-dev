-- 003_workspace_management.sql
-- Workspace management: deletion, role changes, invitation management,
-- safety triggers, cascading cleanup.

-- ============================================================
-- 1. DELETE policy on workspaces (owners only)
-- ============================================================
create policy "Owners can delete workspace"
  on public.workspaces for delete using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspaces.id
        and user_id = auth.uid()
        and role = 'owner'
    )
  );

-- ============================================================
-- 2. UPDATE/DELETE policies on workspace_invitations
-- ============================================================
create policy "Admins can update invitations"
  on public.workspace_invitations for update using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspace_invitations.workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

create policy "Admins can delete invitations"
  on public.workspace_invitations for delete using (
    exists (
      select 1 from public.workspace_members
      where workspace_id = workspace_invitations.workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- Broaden invitation SELECT so the /invite/[code] join flow works
-- for non-admin users. Drop the admin-only policy and re-create.
drop policy if exists "Admins can view invitations" on public.workspace_invitations;

create policy "Authenticated users can view invitations"
  on public.workspace_invitations for select using (
    auth.uid() is not null
  );

-- ============================================================
-- 3. UPDATE policy on workspace_members (for role changes)
-- ============================================================
create policy "Owners can update member roles"
  on public.workspace_members for update using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'owner'
    )
  );

-- ============================================================
-- 4. DELETE policy on channels (admins/owners or creator)
-- ============================================================
create policy "Admins or creator can delete channels"
  on public.channels for delete using (
    auth.uid() = created_by
    or exists (
      select 1 from public.workspace_members
      where workspace_id = channels.workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- ============================================================
-- 5. UPDATE policy on channels (admins/owners or creator)
-- ============================================================
create policy "Admins or creator can update channels"
  on public.channels for update using (
    auth.uid() = created_by
    or exists (
      select 1 from public.workspace_members
      where workspace_id = channels.workspace_id
        and user_id = auth.uid()
        and role in ('owner', 'admin')
    )
  );

-- ============================================================
-- 6. Trigger: prevent removing the last owner
-- ============================================================
create or replace function public.prevent_last_owner_removal()
returns trigger as $$
declare
  owner_count integer;
begin
  if OLD.role = 'owner' then
    -- For UPDATE: only block if role is changing away from owner
    if TG_OP = 'UPDATE' and NEW.role = 'owner' then
      return NEW;
    end if;

    select count(*) into owner_count
    from public.workspace_members
    where workspace_id = OLD.workspace_id
      and role = 'owner'
      and id != OLD.id;

    if owner_count = 0 then
      raise exception 'Cannot remove or demote the last owner. Transfer ownership first.';
    end if;
  end if;

  if TG_OP = 'DELETE' then
    return OLD;
  else
    return NEW;
  end if;
end;
$$ language plpgsql;

create trigger check_last_owner_before_delete
  before delete on public.workspace_members
  for each row execute function public.prevent_last_owner_removal();

create trigger check_last_owner_before_update
  before update on public.workspace_members
  for each row execute function public.prevent_last_owner_removal();

-- ============================================================
-- 7. Trigger: cascade member removal to channel_members
-- ============================================================
create or replace function public.cascade_member_removal_to_channels()
returns trigger as $$
begin
  delete from public.channel_members
  where user_id = OLD.user_id
    and channel_id in (
      select id from public.channels
      where workspace_id = OLD.workspace_id
    );
  return OLD;
end;
$$ language plpgsql security definer;

create trigger cascade_workspace_member_removal
  after delete on public.workspace_members
  for each row execute function public.cascade_member_removal_to_channels();
