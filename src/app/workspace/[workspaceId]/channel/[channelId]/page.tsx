"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Hash,
  Lock,
  Users,
  Pin,
  Search,
  Phone,
  SmilePlus,
  Paperclip,
  SendHorizontal,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useWorkspace } from "@/contexts/workspace-context";

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const workspaceId = params.workspaceId as string;
  const { openMembersPanel } = useWorkspace();

  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState<string>("public");
  const [channelDescription, setChannelDescription] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileCacheRef = useRef<Map<string, MessageData["profiles"]>>(new Map());

  // Cache profiles from loaded messages so realtime handler can use them
  const cacheProfiles = useCallback((msgs: MessageData[]) => {
    for (const msg of msgs) {
      if (msg.profiles) {
        profileCacheRef.current.set(msg.user_id, msg.profiles);
      }
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/workspaces/${workspaceId}/channels/${channelId}/messages`
        );
        if (!res.ok) return;

        const data = await res.json();

        setUserId(data.userId);

        if (data.channel) {
          setChannelName(data.channel.name);
          setChannelType(data.channel.type);
          setChannelDescription(data.channel.description);
        }

        const msgs = (data.messages ?? []) as MessageData[];
        setMessages(msgs);
        cacheProfiles(msgs);

        // Cache current user's profile for optimistic messages
        if (data.currentProfile && data.userId) {
          profileCacheRef.current.set(data.userId, data.currentProfile);
        }
      } catch {
        // Network error
      }
    }

    load();
  }, [channelId, workspaceId, cacheProfiles]);

  useEffect(() => {
    // Subscribe to new messages via Supabase Realtime (WebSocket, not REST)
    const supabase = createClient();
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          // Try to get profile from cache first, then fetch via API
          let profile = profileCacheRef.current.get(payload.new.user_id) ?? null;

          if (!profile) {
            try {
              const res = await fetch(
                `/api/workspaces/${workspaceId}/channels/${channelId}/messages`
              );
              if (res.ok) {
                const data = await res.json();
                const msgs = (data.messages ?? []) as MessageData[];
                cacheProfiles(msgs);
                profile = profileCacheRef.current.get(payload.new.user_id) ?? null;
              }
            } catch {
              // Use null profile if fetch fails
            }
          }

          const msg: MessageData = {
            id: payload.new.id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            user_id: payload.new.user_id,
            profiles: profile,
          };

          setMessages((prev) => {
            // Avoid duplicates (message may already be in list from initial load or prior event)
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelId, workspaceId, cacheProfiles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !userId) return;

    // Optimistic update: show the message immediately
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: MessageData = {
      id: optimisticId,
      content,
      created_at: new Date().toISOString(),
      user_id: userId,
      profiles: profileCacheRef.current.get(userId) ?? null,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");

    setSending(true);
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/channels/${channelId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        // Replace optimistic message with real one from server
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? { ...optimisticMsg, id: data.message.id, created_at: data.message.created_at } : m))
        );
      }
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    }

    setSending(false);
  }

  function getInitials(name: string | null) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  // Empty state when no channel data loaded yet
  if (!channelName) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p className="text-sm">Loading channel...</p>
      </div>
    );
  }

  return (
    <>
      {/* Channel Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {channelType === "private" ? (
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <h1 className="font-semibold text-sm truncate">{channelName}</h1>
          {channelDescription && (
            <>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <span className="text-xs text-muted-foreground truncate">
                {channelDescription}
              </span>
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={openMembersPanel}>
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              {channelType === "private" ? (
                <Lock className="h-7 w-7 text-primary" />
              ) : (
                <Hash className="h-7 w-7 text-primary" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">
              Welcome to #{channelName}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              This is the very beginning of the{" "}
              <strong>#{channelName}</strong> channel.{" "}
              {channelDescription || "Start the conversation!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const displayName =
                msg.profiles?.display_name || msg.profiles?.full_name || "Unknown";
              return (
                <div key={msg.id} className="flex gap-3 group">
                  <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                    <AvatarFallback className="text-xs">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/85 mt-0.5 break-words">
                      {msg.content}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-0.5 pt-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <SmilePlus className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Composer */}
      <div className="px-5 pb-4 pt-2 shrink-0">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-2 focus-within:border-primary/40 transition-colors"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
            disabled={sending}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={!newMessage.trim() || sending}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
