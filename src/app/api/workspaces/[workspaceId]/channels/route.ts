import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verify membership
  const { data: members } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const membership = members?.[0];

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  // Get workspace info
  const { data: workspace } = await admin
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .single();

  // Get user profile
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, display_name")
    .eq("id", user.id)
    .single();

  // Get channels
  const { data: channels } = await admin
    .from("channels")
    .select("id, name, type")
    .eq("workspace_id", workspaceId)
    .order("name");

  return NextResponse.json({
    workspace: { name: workspace?.name ?? "Workspace" },
    channels: channels ?? [],
    membership: { role: membership.role },
    profile: {
      id: user.id,
      displayName: profile?.display_name || profile?.full_name || "You",
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Verify membership
  const { data: members } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const membership = members?.[0];

  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, type } = body as {
    name: string;
    description?: string;
    type?: "public" | "private";
  };

  const channelName = name?.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (!channelName) {
    return NextResponse.json({ error: "Channel name is required" }, { status: 400 });
  }

  // Check for duplicate channel name in this workspace
  const { data: existing } = await admin
    .from("channels")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("name", channelName)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A channel with this name already exists" },
      { status: 409 }
    );
  }

  // Create the channel
  const { data: channel, error } = await admin
    .from("channels")
    .insert({
      workspace_id: workspaceId,
      name: channelName,
      description: description?.trim() || null,
      type: type || "public",
      created_by: user.id,
    })
    .select("id, name, type")
    .single();

  if (error || !channel) {
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }

  // Add creator as channel member
  await admin.from("channel_members").insert({
    channel_id: channel.id,
    user_id: user.id,
  });

  return NextResponse.json({ channel });
}
