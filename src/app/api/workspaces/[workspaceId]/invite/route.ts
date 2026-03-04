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

  // Verify admin/owner
  const { data: members } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const membership = members?.[0];

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json(
      { error: `You must be an admin or owner to view invitations. Your role: ${membership?.role ?? "not a member"}` },
      { status: 403 }
    );
  }

  // Get pending invitations
  const { data: invitations } = await admin
    .from("workspace_invitations")
    .select("id, email, role, token, expires_at, created_at")
    .eq("workspace_id", workspaceId)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  return NextResponse.json({ invitations: invitations ?? [] });
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

  const body = await request.json();
  const { email, role = "member" } = body as {
    email: string;
    role?: string;
  };

  if (!email?.trim() || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify admin/owner
  const { data: members } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const membership = members?.[0];

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json(
      { error: `You must be an admin or owner to invite people. Your role: ${membership?.role ?? "not a member"}` },
      { status: 403 }
    );
  }

  // Check if already a member (by email)
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .single();

  if (existingProfile) {
    const { data: existingMember } = await admin
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("user_id", existingProfile.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "This person is already a member." },
        { status: 409 }
      );
    }
  }

  // Check for existing pending invitation
  const { data: existingInvite } = await admin
    .from("workspace_invitations")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("email", email.trim().toLowerCase())
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (existingInvite) {
    return NextResponse.json(
      { error: "An invitation is already pending for this email." },
      { status: 409 }
    );
  }

  // Create invitation
  const { data: invitation, error } = await admin
    .from("workspace_invitations")
    .insert({
      workspace_id: workspaceId,
      email: email.trim().toLowerCase(),
      role,
      invited_by: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id, token, email, role, expires_at")
    .single();

  if (error || !invitation) {
    return NextResponse.json(
      { error: "Failed to create invitation." },
      { status: 500 }
    );
  }

  return NextResponse.json({ invitation });
}
