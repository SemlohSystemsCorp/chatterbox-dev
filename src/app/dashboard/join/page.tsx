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

    try {
      const res = await fetch("/api/workspaces/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to join workspace.");
        setLoading(false);
        return;
      }

      // Navigate to the workspace
      if (data.channelId) {
        router.push(`/workspace/${data.workspaceId}/channel/${data.channelId}`);
      } else {
        router.push(`/workspace/${data.workspaceId}/channel/general`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
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
