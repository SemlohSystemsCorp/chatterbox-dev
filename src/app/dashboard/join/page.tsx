"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  UserPlus,
  Link2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function JoinWorkspacePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Try to find the invitation by token
    const { data: invitation, error: invError } = await supabase
      .from("workspace_invitations")
      .select("id, workspace_id, role, expires_at, accepted_at")
      .eq("token", inviteCode.trim())
      .single();

    if (invError || !invitation) {
      setError("Invalid invite code. Please check and try again.");
      setLoading(false);
      return;
    }

    if (invitation.accepted_at) {
      setError("This invite has already been used.");
      setLoading(false);
      return;
    }

    if (new Date(invitation.expires_at) < new Date()) {
      setError("This invite has expired. Ask your admin for a new one.");
      setLoading(false);
      return;
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", invitation.workspace_id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      router.push(`/workspace/${invitation.workspace_id}/channel/general`);
      return;
    }

    // Join workspace
    const { error: joinError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: invitation.workspace_id,
        user_id: user.id,
        role: invitation.role,
      });

    if (joinError) {
      setError("Failed to join workspace. Please try again.");
      setLoading(false);
      return;
    }

    // Mark invitation as accepted
    await supabase
      .from("workspace_invitations")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", invitation.id);

    // Join all public channels
    const { data: publicChannels } = await supabase
      .from("channels")
      .select("id")
      .eq("workspace_id", invitation.workspace_id)
      .eq("type", "public");

    if (publicChannels && publicChannels.length > 0) {
      await supabase.from("channel_members").insert(
        publicChannels.map((ch) => ({
          channel_id: ch.id,
          user_id: user.id,
        }))
      );
    }

    const { data: generalChannel } = await supabase
      .from("channels")
      .select("id")
      .eq("workspace_id", invitation.workspace_id)
      .eq("name", "general")
      .single();

    if (generalChannel) {
      router.push(
        `/workspace/${invitation.workspace_id}/channel/${generalChannel.id}`
      );
    } else {
      router.push(`/workspace/${invitation.workspace_id}/channel/general`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Join a workspace
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Enter an invite code from your team admin to join their workspace.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium">
                Invite code
              </label>
              <Input
                id="code"
                type="text"
                placeholder="Paste your invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="h-12 text-base font-mono"
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                This is usually a UUID like{" "}
                <span className="font-mono">a1b2c3d4-e5f6-...</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading || !inviteCode.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Join workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6">
            Don&apos;t have an invite?{" "}
            <Link
              href="/dashboard/new/workspace"
              className="text-primary font-medium hover:underline"
            >
              Create your own workspace
            </Link>
          </p>
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <h3 className="text-sm font-semibold mb-4">How it works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Link2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Get an invite</p>
                  <p className="text-xs text-muted-foreground">
                    Ask a workspace admin to send you an invite code or link.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Join instantly</p>
                  <p className="text-xs text-muted-foreground">
                    Paste the code above and you&apos;ll be added right away.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Start collaborating</p>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll auto-join all public channels in the workspace.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Secure access</p>
                  <p className="text-xs text-muted-foreground">
                    Invite codes expire and can only be used once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
