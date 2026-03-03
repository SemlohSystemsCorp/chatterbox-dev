"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  MessageSquare,
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

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "dm";
  unread?: number;
}

interface DirectMessage {
  id: string;
  name: string;
  initials: string;
  online: boolean;
}

// Demo data for the UI
const demoChannels: Channel[] = [
  { id: "1", name: "general", type: "public", unread: 3 },
  { id: "2", name: "engineering", type: "public" },
  { id: "3", name: "design", type: "public" },
  { id: "4", name: "leadership", type: "private" },
  { id: "5", name: "announcements", type: "public", unread: 1 },
];

const demoDMs: DirectMessage[] = [
  { id: "1", name: "Sarah Kim", initials: "SK", online: true },
  { id: "2", name: "James Davis", initials: "JD", online: true },
  { id: "3", name: "Alex Chen", initials: "AC", online: false },
  { id: "4", name: "Maria Garcia", initials: "MG", online: true },
];

export function WorkspaceSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground">
      {/* Workspace Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-sidebar-accent rounded-md px-2 py-1 transition-colors">
              <div className="h-6 w-6 rounded-md bg-sidebar-primary flex items-center justify-center">
                <MessageSquare className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm font-semibold truncate max-w-[120px]">
                Acme Corp
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Workspace settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Invite people
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
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
              {demoChannels.map((channel) => {
                const isActive = pathname.includes(`/channel/${channel.id}`);
                return (
                  <Link
                    key={channel.id}
                    href={`/workspace/${workspaceId || "demo"}/channel/${channel.id}`}
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
                    {channel.unread && (
                      <span className="ml-auto text-xs bg-sidebar-primary text-sidebar-primary-foreground rounded-full px-1.5 py-0.5 font-medium">
                        {channel.unread}
                      </span>
                    )}
                  </Link>
                );
              })}
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
              {demoDMs.map((dm) => (
                <Link
                  key={dm.id}
                  href={`/workspace/${workspaceId || "demo"}/channel/dm-${dm.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px] bg-sidebar-accent text-sidebar-foreground">
                        {dm.initials}
                      </AvatarFallback>
                    </Avatar>
                    {dm.online && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <span className="truncate">{dm.name}</span>
                </Link>
              ))}
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
                YO
              </AvatarFallback>
            </Avatar>
            <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">You</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
