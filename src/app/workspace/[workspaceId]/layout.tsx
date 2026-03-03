"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Hash,
  Lock,
  Plus,
  ChevronDown,
  Search,
  Bell,
  Settings,
  LogOut,
  Users,
  Circle,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { InviteModal } from "@/components/workspace/invite-modal";
import { MembersPanel } from "@/components/workspace/members-panel";

interface ChannelItem {
  id: string;
  name: string;
  type: "public" | "private" | "dm";
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;

  const [workspaceName, setWorkspaceName] = useState("Workspace");
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [userName, setUserName] = useState("You");
  const [userInitials, setUserInitials] = useState("YO");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("member");
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [membersPanelOpen, setMembersPanelOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, display_name")
        .eq("id", user.id)
        .single();

      if (profile) {
        const name = profile.display_name || profile.full_name || "You";
        setUserName(name);
        setUserInitials(
          name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        );
      }

      // Get workspace info
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("name")
        .eq("id", workspaceId)
        .single();

      if (workspace) {
        setWorkspaceName(workspace.name);
      }

      // Get user's role in this workspace
      const { data: membership } = await supabase
        .from("workspace_members")
        .select("role")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .single();

      if (membership) {
        setUserRole(membership.role);
      }

      // Get channels for this workspace
      const { data: channelData } = await supabase
        .from("channels")
        .select("id, name, type")
        .eq("workspace_id", workspaceId)
        .order("name");

      if (channelData) {
        setChannels(channelData as ChannelItem[]);
      }
    }

    load();
  }, [workspaceId, router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const regularChannels = channels.filter((c) => c.type !== "dm");
  const dmChannels = channels.filter((c) => c.type === "dm");

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-sidebar text-sidebar-foreground shrink-0">
        {/* Workspace Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-sidebar-accent rounded-md px-2 py-1 transition-colors">
                <div className="h-6 w-6 rounded-md bg-sidebar-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-sidebar-primary-foreground">
                    {workspaceName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold truncate max-w-[120px]">
                  {workspaceName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Workspace settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInviteModalOpen(true)}>
                <Users className="mr-2 h-4 w-4" />
                Invite people
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <button className="flex items-center gap-2 w-full rounded-md border border-sidebar-border bg-sidebar-accent/50 px-3 py-1.5 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent transition-colors">
            <Search className="h-3.5 w-3.5" />
            Search messages...
          </button>
        </div>

        <ScrollArea className="flex-1 px-2">
          {/* Channels */}
          <div className="py-2">
            <button
              onClick={() => setChannelsOpen(!channelsOpen)}
              className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70"
            >
              <div className="flex items-center gap-1">
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    !channelsOpen && "-rotate-90"
                  )}
                />
                Channels
              </div>
              <Plus className="h-3.5 w-3.5 hover:text-sidebar-foreground" />
            </button>
            {channelsOpen && (
              <div className="mt-1 space-y-0.5">
                {regularChannels.length > 0 ? (
                  regularChannels.map((channel) => {
                    const isActive = pathname.includes(
                      `/channel/${channel.id}`
                    );
                    return (
                      <Link
                        key={channel.id}
                        href={`/workspace/${workspaceId}/channel/${channel.id}`}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {channel.type === "private" ? (
                          <Lock className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <Hash className="h-3.5 w-3.5 shrink-0" />
                        )}
                        <span className="truncate">{channel.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-2 py-2 text-xs text-sidebar-foreground/40">
                    No channels yet
                  </p>
                )}
              </div>
            )}
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Direct Messages */}
          <div className="py-2">
            <button
              onClick={() => setDmsOpen(!dmsOpen)}
              className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70"
            >
              <div className="flex items-center gap-1">
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    !dmsOpen && "-rotate-90"
                  )}
                />
                Direct Messages
              </div>
              <Plus className="h-3.5 w-3.5 hover:text-sidebar-foreground" />
            </button>
            {dmsOpen && (
              <div className="mt-1 space-y-0.5">
                {dmChannels.length > 0 ? (
                  dmChannels.map((dm) => (
                    <Link
                      key={dm.id}
                      href={`/workspace/${workspaceId}/channel/${dm.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                    >
                      <Circle className="h-2 w-2 fill-muted-foreground/30 text-muted-foreground/30" />
                      <span className="truncate">{dm.name}</span>
                    </Link>
                  ))
                ) : (
                  <p className="px-2 py-2 text-xs text-sidebar-foreground/40">
                    No messages yet
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <WorkspaceProvider
        value={{
          workspaceId,
          workspaceName,
          currentUserId: userId,
          currentUserRole: userRole,
          openInviteModal: () => setInviteModalOpen(true),
          openMembersPanel: () => setMembersPanelOpen(true),
        }}
      >
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </WorkspaceProvider>

      {/* Modals */}
      <InviteModal
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        currentUserRole={userRole}
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
      <MembersPanel
        workspaceId={workspaceId}
        currentUserId={userId}
        currentUserRole={userRole}
        open={membersPanelOpen}
        onOpenChange={setMembersPanelOpen}
      />
    </div>
  );
}
