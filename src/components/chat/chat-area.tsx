"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { useChatStore } from "@/stores/chat-store";
import { createClient } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Hash,
  Users,
  Pin,
  Search,
  SmilePlus,
  Paperclip,
  SendHorizonal,
} from "lucide-react";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import type { MessageWithAuthor } from "@/types/database";

export function ChatArea() {
  const { channels, activeChannelId, membersPanelOpen, setMembersPanelOpen } =
    useAppStore();
  const { messages, setMessages, addMessage, isLoading, setIsLoading } =
    useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  useEffect(() => {
    if (!activeChannelId) return;

    const supabase = createClient();
    setIsLoading(true);

    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*, author:profiles(*)")
        .eq("channel_id", activeChannelId!)
        .order("created_at", { ascending: true })
        .limit(50);

      if (data) setMessages(data as unknown as MessageWithAuthor[]);
      setIsLoading(false);
    }

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${activeChannelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${activeChannelId}`,
        },
        async (payload) => {
          // Fetch the full message with author profile
          const { data } = await supabase
            .from("messages")
            .select("*, author:profiles(*)")
            .eq("id", payload.new.id)
            .single();

          if (data) addMessage(data as unknown as MessageWithAuthor);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannelId, setMessages, addMessage, setIsLoading]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeChannelId) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("messages").insert({
      channel_id: activeChannelId,
      author_id: user.id,
      content: input.trim(),
    });

    if (!error) setInput("");
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Channel header */}
      <div className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold">{activeChannel?.name ?? "channel"}</span>
          {activeChannel?.description && (
            <>
              <div className="mx-2 h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {activeChannel.description}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMembersPanelOpen(!membersPanelOpen)}
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Hash className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Welcome to #{activeChannel?.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This is the start of the channel. Send a message to get things going.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="group flex gap-3 hover:bg-muted/30 -mx-2 px-2 py-1 rounded-md">
                <Avatar className="mt-0.5 h-9 w-9 shrink-0">
                  <AvatarImage src={msg.author?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {msg.author
                      ? getInitials(msg.author.display_name)
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">
                      {msg.author?.display_name ?? "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(new Date(msg.created_at))}
                    </span>
                    {msg.edited_at && (
                      <span className="text-xs text-muted-foreground">(edited)</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="border-t p-4">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3"
        >
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${activeChannel?.name ?? "channel"}`}
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <SmilePlus className="h-5 w-5" />
          </button>
          {input.trim() && (
            <button
              type="submit"
              className="text-primary hover:text-primary/80"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
