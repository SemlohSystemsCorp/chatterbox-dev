"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hash, Lock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CreateChannelModalProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChannelCreated?: (channel: { id: string; name: string; type: string }) => void;
}

export function CreateChannelModal({
  workspaceId,
  open,
  onOpenChange,
  onChannelCreated,
}: CreateChannelModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"public" | "private">("public");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName("");
      setDescription("");
      setType("public");
      setError(null);
    }
    onOpenChange(open);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create channel");
        setCreating(false);
        return;
      }

      onChannelCreated?.(data.channel);
      handleOpenChange(false);
      router.push(`/workspace/${workspaceId}/channel/${data.channel.id}`);
    } catch {
      setError("Something went wrong");
    }

    setCreating(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
          <DialogDescription>
            Channels are where conversations happen. Create one for a topic,
            project, or team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          {/* Channel type */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Channel type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("public")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-left transition-colors",
                  type === "public"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80 hover:bg-muted/50"
                )}
              >
                <Hash className={cn("h-4 w-4", type === "public" ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className="text-sm font-medium">Public</p>
                  <p className="text-xs text-muted-foreground">Anyone can join</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setType("private")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-left transition-colors",
                  type === "private"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80 hover:bg-muted/50"
                )}
              >
                <Lock className={cn("h-4 w-4", type === "private" ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className="text-sm font-medium">Private</p>
                  <p className="text-xs text-muted-foreground">Invite only</p>
                </div>
              </button>
            </div>
          </div>

          {/* Channel name */}
          <div>
            <label htmlFor="channel-name" className="text-sm font-medium mb-2 block">
              Channel name
            </label>
            <div className="relative">
              {type === "private" ? (
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              ) : (
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="channel-name"
                placeholder="e.g. design-team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                autoFocus
                required
              />
            </div>
            {name && slug !== name.trim().toLowerCase() && (
              <p className="text-xs text-muted-foreground mt-1">
                Will be created as <strong>#{slug}</strong>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="channel-desc" className="text-sm font-medium mb-2 block">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="channel-desc"
              placeholder="What is this channel about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!slug || creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create channel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
