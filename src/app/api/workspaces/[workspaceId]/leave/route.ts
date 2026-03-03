import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
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

  // Get user's membership
  const { data: membership } = await admin
    .from("workspace_members")
    .select("id, role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json(
      { error: "You are not a member of this workspace." },
      { status: 400 }
    );
  }

  // If owner, check if they're the last owner
  if (membership.role === "owner") {
    const { count } = await admin
      .from("workspace_members")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("role", "owner")
      .neq("user_id", user.id);

    if ((count ?? 0) === 0) {
      return NextResponse.json(
        {
          error:
            "You are the only owner. Transfer ownership to another member before leaving.",
        },
        { status: 400 }
      );
    }
  }

  // Delete membership (cascade trigger handles channel cleanup)
  const { error } = await admin
    .from("workspace_members")
    .delete()
    .eq("id", membership.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to leave workspace." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
