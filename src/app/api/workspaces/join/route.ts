import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { code } = body as { code: string };

  if (!code?.trim()) {
    return NextResponse.json(
      { error: "Invite code is required." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Find the invitation by token
  const { data: invitations } = await admin
    .from("workspace_invitations")
    .select("id, workspace_id, role, expires_at, accepted_at")
    .eq("token", code.trim());

  const invitation = invitations?.[0];

  if (!invitation) {
    return NextResponse.json(
      { error: "Invalid invite code. Please check and try again." },
      { status: 404 }
    );
  }

  if (invitation.accepted_at) {
    return NextResponse.json(
      { error: "This invite has already been used." },
      { status: 410 }
    );
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "This invite has expired. Ask your admin for a new one." },
      { status: 410 }
    );
  }

  // Check if already a member
  const { data: existingMembers } = await admin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", invitation.workspace_id)
    .eq("user_id", user.id);

  if (existingMembers && existingMembers.length > 0) {
    // Already a member — find general channel and redirect
    const { data: channels } = await admin
      .from("channels")
      .select("id")
      .eq("workspace_id", invitation.workspace_id)
      .eq("name", "general");

    return NextResponse.json({
      alreadyMember: true,
      workspaceId: invitation.workspace_id,
      channelId: channels?.[0]?.id ?? null,
    });
  }

  // Join workspace
  const { error: joinError } = await admin
    .from("workspace_members")
    .insert({
      workspace_id: invitation.workspace_id,
      user_id: user.id,
      role: invitation.role,
    });

  if (joinError) {
    return NextResponse.json(
      { error: "Failed to join workspace. Please try again." },
      { status: 500 }
    );
  }

  // Mark invitation as accepted
  await admin
    .from("workspace_invitations")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  // Join all public channels
  const { data: publicChannels } = await admin
    .from("channels")
    .select("id")
    .eq("workspace_id", invitation.workspace_id)
    .eq("type", "public");

  if (publicChannels && publicChannels.length > 0) {
    await admin.from("channel_members").insert(
      publicChannels.map((ch) => ({
        channel_id: ch.id,
        user_id: user.id,
      }))
    );
  }

  // Find general channel for redirect
  const { data: generalChannels } = await admin
    .from("channels")
    .select("id")
    .eq("workspace_id", invitation.workspace_id)
    .eq("name", "general");

  return NextResponse.json({
    success: true,
    workspaceId: invitation.workspace_id,
    channelId: generalChannels?.[0]?.id ?? null,
  });
}
