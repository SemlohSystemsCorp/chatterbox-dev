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
  const { name, slug, channels, inviteEmails } = body as {
    name: string;
    slug: string;
    channels?: string[];
    inviteEmails?: string[];
  };

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  // Use admin client to bypass RLS for the creation flow
  const admin = createAdminClient();

  // 1. Create workspace
  const { data: workspace, error: wsError } = await admin
    .from("workspaces")
    .insert({ name: name.trim(), slug, created_by: user.id })
    .select("id")
    .single();

  if (wsError || !workspace) {
    if (wsError?.code === "23505") {
      return NextResponse.json(
        { error: "A workspace with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create workspace." },
      { status: 500 }
    );
  }

  // 2. Add creator as owner
  const { error: memberError } = await admin
    .from("workspace_members")
    .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" });

  if (memberError) {
    // Rollback workspace
    await admin.from("workspaces").delete().eq("id", workspace.id);
    return NextResponse.json(
      { error: "Failed to add you as workspace owner." },
      { status: 500 }
    );
  }

  // 3. Create channels (always create #general, plus any custom ones)
  const channelNames = ["general", ...(channels || []).filter((c: string) => c.trim() && c.trim().toLowerCase() !== "general")];
  let generalChannelId: string | null = null;

  for (const channelName of channelNames) {
    const description =
      channelName === "general"
        ? "Company-wide announcements and discussions"
        : "";

    const { data: channel } = await admin
      .from("channels")
      .insert({
        workspace_id: workspace.id,
        name: channelName.trim().toLowerCase().replace(/\s+/g, "-"),
        description,
        type: "public",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (channel) {
      await admin
        .from("channel_members")
        .insert({ channel_id: channel.id, user_id: user.id });

      if (channelName === "general") {
        generalChannelId = channel.id;
      }
    }
  }

  // 4. Create invitations for emails
  if (inviteEmails && inviteEmails.length > 0) {
    const validEmails = inviteEmails.filter(
      (e: string) => e.trim() && e.includes("@")
    );

    if (validEmails.length > 0) {
      const invitations = validEmails.map((email: string) => ({
        workspace_id: workspace.id,
        email: email.trim().toLowerCase(),
        role: "member" as const,
        invited_by: user.id,
        expires_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      }));

      await admin.from("workspace_invitations").insert(invitations);
    }
  }

  return NextResponse.json({
    workspace: { id: workspace.id, slug },
    channelId: generalChannelId,
  });
}
