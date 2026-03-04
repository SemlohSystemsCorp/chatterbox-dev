"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Hash,
  Volume2,
  Megaphone,
  MessageSquareText,
  ChevronDown,
  Plus,
  Settings,
  UserPlus,
  Search,
  Mic,
  Headphones,
  CircleDot,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { Channel, Category } from "@/types/database";

const channelIcons = {
  text: Hash,
  voice: Volume2,
  announcement: Megaphone,
  forum: MessageSquareText,
  stage: CircleDot,
};

export function ChannelSidebar() {
  const {
    activeServerId,
    servers,
    channels,
    setChannels,
    activeChannelId,
    setActiveChannelId,
    user,
  } = useAppStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set()
  );

  const activeServer = servers.find((s) => s.id === activeServerId);

  useEffect(() => {
    if (!activeServerId) return;

    const supabase = createClient();

    async function fetchChannels() {
      const { data: channelData } = await supabase
        .from("channels")
        .select("*")
        .eq("server_id", activeServerId!)
        .order("position") as { data: Channel[] | null };

      const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .eq("server_id", activeServerId!)
        .order("position") as { data: Category[] | null };

      if (channelData) setChannels(channelData);
      if (categoryData) setCategories(categoryData);

      // Auto-select first text channel
      if (channelData?.length && !activeChannelId) {
        const firstText = channelData.find((c) => c.type === "text");
        if (firstText) setActiveChannelId(firstText.id);
      }
    }

    fetchChannels();
  }, [activeServerId, setChannels, activeChannelId, setActiveChannelId]);

  function toggleCategory(id: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Group channels by category
  const uncategorized = channels.filter((c) => !c.category_id);
  const channelsByCategory = categories.map((cat) => ({
    category: cat,
    channels: channels.filter((c) => c.category_id === cat.id),
  }));

  // Home view (no active server)
  if (!activeServerId) {
    return (
      <div className="flex w-60 flex-col border-r bg-card">
        <div className="flex h-12 items-center border-b px-4">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Find or start a conversation
          </span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <UserPlus className="h-5 w-5" />
              Friends
            </button>
          </div>
          <div className="px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Direct Messages
            </p>
          </div>
          <div className="px-2">
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              No conversations yet
            </p>
          </div>
        </ScrollArea>
        {/* User panel */}
        <UserPanel />
      </div>
    );
  }

  return (
    <div className="flex w-60 flex-col border-r bg-card">
      {/* Server header */}
      <button className="flex h-12 items-center justify-between border-b px-4 transition-colors hover:bg-muted/50">
        <span className="truncate font-semibold">
          {activeServer?.name ?? "Server"}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      <ScrollArea className="flex-1">
        <div className="space-y-4 py-3">
          {/* Uncategorized channels */}
          {uncategorized.length > 0 && (
            <div className="space-y-0.5 px-2">
              {uncategorized.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={activeChannelId === channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                />
              ))}
            </div>
          )}

          {/* Categorized channels */}
          {channelsByCategory.map(({ category, channels: catChannels }) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center gap-0.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    collapsedCategories.has(category.id) && "-rotate-90"
                  )}
                />
                {category.name}
                <Plus className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              {!collapsedCategories.has(category.id) && (
                <div className="mt-1 space-y-0.5 px-2">
                  {catChannels.map((channel) => (
                    <ChannelItem
                      key={channel.id}
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => setActiveChannelId(channel.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {channels.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No channels yet
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User panel */}
      <UserPanel />
    </div>
  );
}

function ChannelItem({
  channel,
  isActive,
  onClick,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = channelIcons[channel.type] || Hash;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{channel.name}</span>
    </button>
  );
}

function UserPanel() {
  const { user } = useAppStore();

  return (
    <div className="flex items-center gap-2 border-t bg-secondary/30 px-2 py-2">
      <div className="flex flex-1 items-center gap-2 rounded-md px-1 py-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">
            {user ? getInitials(user.display_name) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium leading-tight">
            {user?.display_name ?? "User"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.status ?? "Online"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Mic className="h-4 w-4" />
        </button>
        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Headphones className="h-4 w-4" />
        </button>
        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
