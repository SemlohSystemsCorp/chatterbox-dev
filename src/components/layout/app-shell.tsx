"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { ServerSidebar } from "./server-sidebar";
import { ChannelSidebar } from "./channel-sidebar";
import { ChatArea } from "@/components/chat/chat-area";
import { MembersPanel } from "@/components/layout/members-panel";
import { WelcomeView } from "@/components/layout/welcome-view";
import { FriendsView } from "@/components/layout/friends-view";
import type { Server, Profile } from "@/types/database";

interface AppShellProps {
  initialServers: Server[];
  initialProfile: Profile;
}

export function AppShell({ initialServers, initialProfile }: AppShellProps) {
  const {
    setServers,
    setUser,
    activeServerId,
    activeChannelId,
    membersPanelOpen,
  } = useAppStore();
  const [view, setView] = useState<"home" | "server">("home");

  useEffect(() => {
    setServers(initialServers);
    setUser(initialProfile);
  }, [initialServers, initialProfile, setServers, setUser]);

  useEffect(() => {
    setView(activeServerId ? "server" : "home");
  }, [activeServerId]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Server icon rail */}
      <ServerSidebar />

      {/* Channel sidebar or Home sidebar */}
      <ChannelSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {view === "home" && !activeChannelId ? (
          <FriendsView />
        ) : activeChannelId ? (
          <ChatArea />
        ) : (
          <WelcomeView />
        )}
      </div>

      {/* Members panel */}
      {membersPanelOpen && activeServerId && <MembersPanel />}
    </div>
  );
}
