"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Inbox, Wifi } from "lucide-react";

type Tab = "online" | "all" | "pending" | "add";

export function FriendsView() {
  const [activeTab, setActiveTab] = useState<Tab>("online");

  const emptyStates: Record<Exclude<Tab, "add">, { icon: typeof Wifi; title: string; description: string }> = {
    online: {
      icon: Wifi,
      title: "No one's around",
      description: "None of your friends are online right now. Check back later or add some new friends!",
    },
    all: {
      icon: Users,
      title: "No friends yet",
      description: "You haven't added any friends yet. Send a friend request to get started.",
    },
    pending: {
      icon: Inbox,
      title: "No pending requests",
      description: "You don't have any incoming or outgoing friend requests.",
    },
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-12 items-center gap-4 border-b px-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-5 w-5" />
          <span className="font-semibold text-foreground">Friends</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          {(["online", "all", "pending"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1 text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => setActiveTab("add")}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              activeTab === "add"
                ? "bg-emerald-600 font-medium text-white"
                : "text-emerald-600 hover:bg-emerald-600/10"
            }`}
          >
            Add Friend
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "add" ? (
          <div className="mx-auto max-w-lg">
            <h3 className="text-lg font-semibold">Add Friend</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You can add friends with their Chatterbox username.
            </p>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Enter a username"
                className="h-11"
              />
              <Button className="h-11 shrink-0">
                <UserPlus className="mr-2 h-4 w-4" />
                Send Request
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            {(() => {
              const state = emptyStates[activeTab];
              const Icon = state.icon;
              return (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Icon className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <h3 className="mt-4 font-semibold">{state.title}</h3>
                  <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                    {state.description}
                  </p>
                  {activeTab !== "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setActiveTab("add")}
                    >
                      <UserPlus className="mr-2 h-3.5 w-3.5" />
                      Add Friend
                    </Button>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
