"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { cn, getInitials } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Plus, Compass, Download } from "lucide-react";
import { CreateServerModal } from "@/components/modals/create-server-modal";

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServerId, setActiveChannelId } =
    useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex w-[72px] flex-col items-center gap-2 overflow-y-auto border-r bg-secondary/20 py-3">
        {/* Home button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setActiveServerId(null);
                setActiveChannelId(null);
              }}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-3xl transition-all duration-200 hover:rounded-xl",
                !activeServerId
                  ? "rounded-xl bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Direct Messages</TooltipContent>
        </Tooltip>

        <Separator className="mx-auto w-8" />

        {/* Server list */}
        {servers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveServerId(server.id);
                  setActiveChannelId(null);
                }}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-3xl text-sm font-medium transition-all duration-200 hover:rounded-xl",
                  activeServerId === server.id
                    ? "rounded-xl bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {server.icon_url ? (
                  <img
                    src={server.icon_url}
                    alt={server.name}
                    className="h-full w-full rounded-[inherit] object-cover"
                  />
                ) : (
                  getInitials(server.name)
                )}
                {/* Active indicator */}
                {activeServerId === server.id && (
                  <div className="absolute -left-[18px] top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-foreground" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{server.name}</TooltipContent>
          </Tooltip>
        ))}

        <Separator className="mx-auto w-8" />

        {/* Add server */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex h-12 w-12 items-center justify-center rounded-3xl bg-muted text-muted-foreground transition-all duration-200 hover:rounded-xl hover:bg-emerald-600 hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Add a Server</TooltipContent>
        </Tooltip>

        {/* Explore */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-muted text-muted-foreground transition-all duration-200 hover:rounded-xl hover:bg-emerald-600 hover:text-white">
              <Compass className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Explore Public Servers</TooltipContent>
        </Tooltip>

        {/* Download */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex h-12 w-12 items-center justify-center rounded-3xl bg-muted text-muted-foreground transition-all duration-200 hover:rounded-xl hover:bg-emerald-600 hover:text-white">
              <Download className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Download Apps</TooltipContent>
        </Tooltip>
      </div>

      <CreateServerModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </TooltipProvider>
  );
}
