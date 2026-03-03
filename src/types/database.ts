export type WorkspaceRole = "owner" | "admin" | "member" | "guest";
export type ChannelType = "public" | "private" | "dm";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  job_title: string | null;
  company: string | null;
  timezone: string | null;
  locale: string;
  bio: string | null;
  website: string | null;
  auth_provider: string | null;
  status: string | null;
  status_emoji: string | null;
  email_verified: boolean;
  onboarding_completed: boolean;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationCode {
  id: string;
  user_id: string;
  email: string;
  code: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
}

export interface Channel {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  type: ChannelType;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
}

export interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface FileAttachment {
  id: string;
  message_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}
