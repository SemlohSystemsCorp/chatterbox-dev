import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Get user profile
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, display_name")
    .eq("id", user.id)
    .single();

  // Get workspace memberships with workspace data
  const { data: memberships } = await admin
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, slug, icon_url)")
    .eq("user_id", user.id);

  const workspaces =
    memberships?.map((m) => {
      const w = m.workspaces as unknown as {
        id: string;
        name: string;
        slug: string;
        icon_url: string | null;
      };
      return {
        id: w.id,
        name: w.name,
        slug: w.slug,
        icon_url: w.icon_url,
        role: m.role,
      };
    }) ?? [];

  return NextResponse.json({
    profile: {
      displayName: profile?.display_name || profile?.full_name || null,
    },
    workspaces,
  });
}
