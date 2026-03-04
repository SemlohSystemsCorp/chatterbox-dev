"use client";

import { useAppStore } from "@/stores/app-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Search } from "lucide-react";

export function MembersPanel() {
  const { members } = useAppStore();

  return (
    <div className="flex w-60 flex-col border-l bg-card">
      <div className="flex h-12 items-center gap-2 border-b px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search members</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Members — {members.length}
          </p>
          {members.length === 0 ? (
            <p className="px-1 py-4 text-center text-xs text-muted-foreground">
              No members loaded
            </p>
          ) : (
            <div className="space-y-0.5">
              {members.map((member) => (
                <button
                  key={member.id}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage />
                    <AvatarFallback className="text-[10px]">
                      {getInitials(member.nickname || member.user_id)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {member.nickname || member.user_id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
