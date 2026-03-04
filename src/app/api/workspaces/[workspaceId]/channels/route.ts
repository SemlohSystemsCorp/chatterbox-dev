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
  const { data: membership } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

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
