import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import type { Server, Profile, Member } from "@/types/database";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch user's servers via member table
  const { data: memberships } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id) as { data: Member[] | null };

  let servers: Server[] = [];
  if (memberships && memberships.length > 0) {
    const serverIds = memberships.map((m) => m.server_id);
    const { data: serverData } = await supabase
      .from("servers")
      .select("*")
      .in("id", serverIds) as { data: Server[] | null };
    servers = serverData ?? [];
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  return (
    <AppShell
      initialServers={servers}
      initialProfile={profile as Profile}
    />
  );
}
