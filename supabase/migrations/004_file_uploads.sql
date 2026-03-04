-- File Uploads: Storage bucket + RLS policies
-- Run this migration in your Supabase SQL editor

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Create the storage bucket for workspace file uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workspace-files',
  'workspace-files',
  false,
  52428800, -- 50 MB max file size
  array[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf',
    'text/plain', 'text/csv', 'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip', 'application/x-tar', 'application/gzip',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'video/mp4', 'video/webm'
  ]
);

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Upload: authenticated users can upload files to their workspace paths
-- Path format: {workspace_id}/{channel_id}/{filename}
create policy "Workspace members can upload files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'workspace-files'
    and exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = (storage.foldername(name))[1]::uuid
        and wm.user_id = auth.uid()
    )
  );

-- Download: workspace members can view files in their workspace
create policy "Workspace members can view files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'workspace-files'
    and exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = (storage.foldername(name))[1]::uuid
        and wm.user_id = auth.uid()
    )
  );

-- Delete: file uploader or workspace admins/owners can delete files
create policy "File owners and admins can delete files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'workspace-files'
    and (
      -- File uploader can delete their own files
      owner_id = auth.uid()
      or
      -- Workspace admins/owners can delete any file
      exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = (storage.foldername(name))[1]::uuid
          and wm.user_id = auth.uid()
          and wm.role in ('owner', 'admin')
      )
    )
  );

-- ============================================================
-- FILES TABLE RLS (table already exists in 001)
-- ============================================================

-- Allow workspace members to insert file records
create policy "Workspace members can insert file records"
  on public.files for insert
  to authenticated
  with check (
    auth.uid() = user_id
  );

-- Allow workspace members to view file records for messages they can see
create policy "Workspace members can view file records"
  on public.files for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      join public.channels c on c.id = m.channel_id
      join public.workspace_members wm on wm.workspace_id = c.workspace_id
      where m.id = files.message_id
        and wm.user_id = auth.uid()
    )
  );

-- Allow file owners to delete their file records
create policy "File owners can delete file records"
  on public.files for delete
  to authenticated
  using (auth.uid() = user_id);
