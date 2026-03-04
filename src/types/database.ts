export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          username: string;
          avatar_url: string | null;
          status: "online" | "idle" | "dnd" | "offline";
          custom_status: string | null;
          bio: string | null;
          plan: "free" | "pro" | "enterprise";
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          username: string;
          avatar_url?: string | null;
          status?: "online" | "idle" | "dnd" | "offline";
          custom_status?: string | null;
          bio?: string | null;
          plan?: "free" | "pro" | "enterprise";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          username?: string;
          avatar_url?: string | null;
          status?: "online" | "idle" | "dnd" | "offline";
          custom_status?: string | null;
          bio?: string | null;
          plan?: "free" | "pro" | "enterprise";
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
      };
      servers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          banner_url: string | null;
          owner_id: string;
          invite_code: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          banner_url?: string | null;
          owner_id: string;
          invite_code?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          banner_url?: string | null;
          owner_id?: string;
          invite_code?: string;
          is_public?: boolean;
          updated_at?: string;
        };
      };
      channels: {
        Row: {
          id: string;
          server_id: string;
          name: string;
          description: string | null;
          type: "text" | "voice" | "announcement" | "forum" | "stage";
          position: number;
          category_id: string | null;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          server_id: string;
          name: string;
          description?: string | null;
          type?: "text" | "voice" | "announcement" | "forum" | "stage";
          position?: number;
          category_id?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          type?: "text" | "voice" | "announcement" | "forum" | "stage";
          position?: number;
          category_id?: string | null;
          is_private?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          server_id: string;
          name: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          server_id: string;
          name: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          position?: number;
        };
      };
      messages: {
        Row: {
          id: string;
          channel_id: string;
          author_id: string;
          content: string;
          edited_at: string | null;
          reply_to_id: string | null;
          attachments: Json | null;
          reactions: Json | null;
          pinned: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          channel_id: string;
          author_id: string;
          content: string;
          edited_at?: string | null;
          reply_to_id?: string | null;
          attachments?: Json | null;
          reactions?: Json | null;
          pinned?: boolean;
          created_at?: string;
        };
        Update: {
          content?: string;
          edited_at?: string | null;
          attachments?: Json | null;
          reactions?: Json | null;
          pinned?: boolean;
        };
      };
      members: {
        Row: {
          id: string;
          server_id: string;
          user_id: string;
          role: "owner" | "admin" | "moderator" | "member";
          nickname: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          server_id: string;
          user_id: string;
          role?: "owner" | "admin" | "moderator" | "member";
          nickname?: string | null;
          joined_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "moderator" | "member";
          nickname?: string | null;
        };
      };
      direct_messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          attachments: Json | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          attachments?: Json | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          attachments?: Json | null;
          read_at?: string | null;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: "pending" | "accepted" | "blocked";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: "pending" | "accepted" | "blocked";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "accepted" | "blocked";
        };
      };
      verification_codes: {
        Row: {
          id: string;
          email: string;
          code: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          code: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          code?: string;
          expires_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Server = Database["public"]["Tables"]["servers"]["Row"];
export type Channel = Database["public"]["Tables"]["channels"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Member = Database["public"]["Tables"]["members"]["Row"];
export type DirectMessage = Database["public"]["Tables"]["direct_messages"]["Row"];
export type Friend = Database["public"]["Tables"]["friends"]["Row"];

export type MessageWithAuthor = Message & {
  author: Profile;
  reply_to?: Message & { author: Profile };
};

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type ServerWithChannels = Server & {
  channels: Channel[];
  categories: Category[];
  member_count: number;
};
