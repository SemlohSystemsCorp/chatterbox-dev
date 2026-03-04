"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  Loader2,
  Mail,
  Plus,
  X,
  Link2,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  created_at: string;
}

interface InviteModalProps {
  workspaceId: string;
  workspaceName: string;
  currentUserRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({
  workspaceId,
  workspaceName,
  currentUserRole,
  open,
  onOpenChange,
}: InviteModalProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const isAdmin = ["owner", "admin"].includes(currentUserRole);

  const fetchInvitations = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/invite`);
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations);
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [workspaceId, isAdmin]);

  useEffect(() => {
    if (open) {
      fetchInvitations();
      setError(null);
      setSuccess(null);
      setEmail("");
    }
  }, [open, fetchInvitations]);

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: "member" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send invitation.");
      } else {
        setSuccess(`Invitation sent to ${email.trim()}`);
        setEmail("");
        fetchInvitations();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError("Something went wrong.");
    }

    setSending(false);
  }

  async function handleRevoke(invitationId: string) {
    setRevoking(invitationId);
    try {
      await fetch(
        `/api/workspaces/${workspaceId}/invite/${invitationId}`,
        { method: "DELETE" }
      );
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
    } catch {
      // silently fail
    }
    setRevoking(null);
  }

  async function copyInviteLink() {
    const latestToken = invitations[0]?.token;
    if (!latestToken) {
      // Create a generic invitation to get a token
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: `invite-link@${workspaceName.toLowerCase().replace(/\s+/g, "")}.workspace`,
            role: "member",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const url = `${window.location.origin}/invite/${data.invitation.token}`;
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          fetchInvitations();
          return;
        }
      } catch {
        // fall through
      }
      return;
    }

    const url = `${window.location.origin}/invite/${latestToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatExpiry(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Expired";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Invite people</DialogTitle>
          <DialogDescription>
            Invite teammates to {workspaceName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 overflow-y-auto min-h-0">
          {/* Invite link */}
          {isAdmin && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Invite link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground truncate">
                  <Link2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {invitations[0]?.token
                      ? `${window.location.origin}/invite/${invitations[0].token}`
                      : "Generate an invite link..."}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={copyInviteLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Send by email */}
          {isAdmin && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Invite by email
              </label>
              <form onSubmit={handleSendInvite} className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending || !email.trim()}
                  className="shrink-0"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Send
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Error / Success messages */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-600 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Pending invitations */}
          {isAdmin && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-medium">
                    Pending invitations
                  </label>
                  {invitations.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {invitations.length}
                    </Badge>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : invitations.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    No pending invitations.
                  </p>
                ) : (
                  <ScrollArea className="max-h-48">
                    <div className="space-y-2">
                      {invitations.map((inv) => (
                        <div
                          key={inv.id}
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
                        >
                          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate flex-1">
                            {inv.email}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="secondary" className="text-[10px]">
                              {inv.role}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" />
                              {formatExpiry(inv.expires_at)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRevoke(inv.id)}
                              disabled={revoking === inv.id}
                            >
                              {revoking === inv.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </>
          )}

          {!isAdmin && (
            <p className="text-sm text-muted-foreground">
              Ask a workspace admin to invite people by email.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
