"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  SmilePlus,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

interface MessageBubbleProps {
  id: string;
  content: string;
  userName: string;
  userInitials: string;
  timestamp: string;
  isEdited?: boolean;
  reactions?: Reaction[];
  threadCount?: number;
  isOwn?: boolean;
  avatarColor?: string;
}

export function MessageBubble({
  content,
  userName,
  userInitials,
  timestamp,
  isEdited,
  reactions = [],
  threadCount,
  isOwn,
  avatarColor = "bg-primary/20 text-primary",
}: MessageBubbleProps) {
  const [hovered, setHovered] = useState(false);

  const formattedTime = (() => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return timestamp;
    }
  })();

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 py-1.5 hover:bg-muted/50 transition-colors",
        hovered && "bg-muted/50"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Avatar className="h-9 w-9 shrink-0 mt-0.5">
        <AvatarFallback className={cn("text-xs font-medium", avatarColor)}>
          {userInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold hover:underline cursor-pointer">
            {userName}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground cursor-default">
                {formattedTime}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{timestamp}</p>
            </TooltipContent>
          </Tooltip>
          {isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
          {content}
        </p>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                  reaction.reacted
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-muted hover:border-primary/20"
                )}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
            <button className="inline-flex items-center rounded-full border border-border bg-muted px-1.5 py-0.5 text-xs hover:border-primary/20 transition-colors">
              <SmilePlus className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Thread indicator */}
        {threadCount && threadCount > 0 && (
          <button className="flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:underline">
            <MessageSquare className="h-3.5 w-3.5" />
            {threadCount} {threadCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* Hover actions */}
      {hovered && (
        <div className="absolute right-4 -top-3 flex items-center gap-0.5 rounded-md border border-border bg-background shadow-sm p-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <SmilePlus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add reaction</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply in thread</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Bookmark className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save message</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwn && (
                <>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit message
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete message
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem>
                <Bookmark className="mr-2 h-3.5 w-3.5" />
                Save message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
