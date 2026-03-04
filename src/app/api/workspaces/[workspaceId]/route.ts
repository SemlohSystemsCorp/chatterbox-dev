import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(
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

  // Verify owner
  const { data: members } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id);

  const membership = members?.[0];

  if (!membership || membership.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can delete a workspace." },
      { status: 403 }
    );
  }

  // Delete workspace (ON DELETE CASCADE handles everything)
  const { error } = await admin
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete workspace." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
