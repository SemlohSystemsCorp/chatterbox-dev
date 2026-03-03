"use client";

import {
  Hash,
  Lock,
  Search,
  Users,
  Phone,
  Pin,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ChannelHeaderProps {
  name: string;
  type?: "public" | "private" | "dm";
  topic?: string;
  memberCount?: number;
}

export function ChannelHeader({
  name,
  type = "public",
  topic,
  memberCount = 12,
}: ChannelHeaderProps) {
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5">
          {type === "private" ? (
            <Lock className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Hash className="h-4 w-4 text-muted-foreground" />
          )}
          <h2 className="font-semibold text-sm">{name}</h2>
        </div>
        {topic && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <p className="text-xs text-muted-foreground truncate max-w-md">
              {topic}
            </p>
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pin className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Users className="h-4 w-4" />
          <span className="ml-1 text-xs text-muted-foreground">
            {memberCount}
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
