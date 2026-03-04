import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ workspaceId: string; memberId: string }> }
) {
  const { workspaceId, memberId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { role } = body as { role: string };

  if (!["owner", "admin", "member", "guest"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get requesting user's membership
  const { data: myMembers } = await admin
    .from("workspace_members")
    .select("role, user_id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const myMembership = myMembers?.[0];

  if (!myMembership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get target member
  const { data: targetMembers } = await admin
    .from("workspace_members")
    .select("id, user_id, role")
    .eq("id", memberId)
    .eq("workspace_id", workspaceId);

  const targetMember = targetMembers?.[0];

  if (!targetMember) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Cannot change own role
  if (targetMember.user_id === user.id) {
    return NextResponse.json(
      { error: "You cannot change your own role." },
      { status: 400 }
    );
  }

  // Permission checks
  if (myMembership.role === "owner") {
    // Owners can change anyone's role
  } else if (myMembership.role === "admin") {
    // Admins can only manage members and guests
    if (["owner", "admin"].includes(targetMember.role)) {
      return NextResponse.json(
        { error: "You cannot change the role of owners or admins." },
        { status: 403 }
      );
    }
    // Admins cannot promote to owner or admin
    if (["owner", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Only owners can promote to admin or owner." },
        { status: 403 }
      );
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update role (the DB trigger will catch last-owner demotion)
  const { error } = await admin
    .from("workspace_members")
    .update({ role })
    .eq("id", memberId);

  if (error) {
    if (error.message?.includes("last owner")) {
      return NextResponse.json(
        { error: "Cannot demote the last owner. Transfer ownership first." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update role." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, role });
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ workspaceId: string; memberId: string }> }
) {
  const { workspaceId, memberId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Get requesting user's membership
  const { data: myMembers2 } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const myMembership = myMembers2?.[0];

  if (!myMembership || !["owner", "admin"].includes(myMembership.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get target member
  const { data: targetMembers2 } = await admin
    .from("workspace_members")
    .select("id, user_id, role")
    .eq("id", memberId)
    .eq("workspace_id", workspaceId);

  const targetMember = targetMembers2?.[0];

  if (!targetMember) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Cannot remove yourself (use /leave instead)
  if (targetMember.user_id === user.id) {
    return NextResponse.json(
      { error: "Use the leave endpoint to remove yourself." },
      { status: 400 }
    );
  }

  // Admins cannot remove owners or other admins
  if (
    myMembership.role === "admin" &&
    ["owner", "admin"].includes(targetMember.role)
  ) {
    return NextResponse.json(
      { error: "You cannot remove owners or admins." },
      { status: 403 }
    );
  }

  // Delete (cascade trigger handles channel cleanup)
  const { error } = await admin
    .from("workspace_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    if (error.message?.includes("last owner")) {
      return NextResponse.json(
        { error: "Cannot remove the last owner." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to remove member." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
