import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ workspaceId: string; channelId: string }> }
) {
  const { workspaceId, channelId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verify membership
  const { data: membership } = await admin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  // Get channel info
  const { data: channel } = await admin
    .from("channels")
    .select("name, type, description")
    .eq("id", channelId)
    .single();

  // Get current user's profile (for optimistic message display)
  const { data: currentProfile } = await admin
    .from("profiles")
    .select("full_name, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  // Get messages with profiles
  const { data: messages } = await admin
    .from("messages")
    .select(
      "id, content, created_at, user_id, profiles(full_name, display_name, avatar_url)"
    )
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true })
    .limit(100);

  return NextResponse.json({
    channel: channel ?? null,
    messages: messages ?? [],
    userId: user.id,
    currentProfile: currentProfile ?? null,
  });
}

export async function POST(
  request: Request,
  {
    params,
  }: { params: Promise<{ workspaceId: string; channelId: string }> }
) {
  const { workspaceId, channelId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verify membership
  const { data: membership } = await admin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const body = await request.json();
  const { content } = body as { content: string };

  if (!content?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const { data: message, error } = await admin
    .from("messages")
    .insert({
      channel_id: channelId,
      user_id: user.id,
      content: content.trim(),
    })
    .select("id, content, created_at, user_id")
    .single();

  if (error || !message) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message });
}
