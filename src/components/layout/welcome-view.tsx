"use client";

import { useAppStore } from "@/stores/app-store";
import {
  MessageSquare,
  Hash,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeView() {
  const { servers, activeServerId } = useAppStore();
  const activeServer = servers.find((s) => s.id === activeServerId);

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-primary/[0.02] to-transparent">
      <div className="max-w-lg px-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {activeServer ? (
            <span className="text-2xl font-bold text-primary">
              {activeServer.name.charAt(0)}
            </span>
          ) : (
            <MessageSquare className="h-8 w-8 text-primary" />
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {activeServer
            ? `Welcome to ${activeServer.name}`
            : "Welcome to Chatterbox"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {activeServer
            ? "Select a channel from the sidebar to start chatting with your team."
            : "Your home for team communication. Select a server or create a new one to get started."}
        </p>

        {activeServer ? (
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20">
              <Hash className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Channels</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Members</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Features</span>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {servers.length === 0 && (
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Plus className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Create your first server</p>
                    <p className="text-xs text-muted-foreground">
                      Set up a workspace for your team
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Add friends</p>
                  <p className="text-xs text-muted-foreground">
                    Find people by their username
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
