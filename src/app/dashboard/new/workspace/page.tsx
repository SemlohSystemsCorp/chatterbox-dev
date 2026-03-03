"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Hash,
  Plus,
  Users,
  Lock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

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

    const slug =
      generateSlug(name) + "-" + Math.random().toString(36).slice(2, 6);

    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        name: name.trim(),
        slug,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (wsError || !workspace) {
      setError("Failed to create workspace. Please try again.");
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      });

    if (memberError) {
      setError(
        "Workspace created but failed to add you as member. Please try again."
      );
      setLoading(false);
      return;
    }

    const { data: channel } = await supabase
      .from("channels")
      .insert({
        workspace_id: workspace.id,
        name: "general",
        description: "Company-wide announcements and discussions",
        type: "public",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (channel) {
      await supabase.from("channel_members").insert({
        channel_id: channel.id,
        user_id: user.id,
      });

      router.push(`/workspace/${workspace.id}/channel/${channel.id}`);
    } else {
      router.push(`/workspace/${workspace.id}/channel/general`);
    }
  }

  const slug = generateSlug(name);

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
          Create a workspace
        </h1>
        <p className="text-muted-foreground mt-1.5">
          A workspace is where your team communicates. Set one up for your
          company, project, or group.
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

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Workspace name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Acme Corp, Design Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                autoFocus
                required
              />
              {slug && (
                <p className="text-xs text-muted-foreground">
                  Slug: <span className="font-mono">{slug}</span>
                </p>
              )}
            </div>

            {/* Preview */}
            {name.trim() && (
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Preview
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {name.trim().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{name.trim()}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      general channel will be created
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <h3 className="text-sm font-semibold mb-4">
              What you&apos;ll get
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Hash className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Channels</p>
                  <p className="text-xs text-muted-foreground">
                    Organize conversations by team, project, or topic.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Invite your team</p>
                  <p className="text-xs text-muted-foreground">
                    Add members with a shareable invite link.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Private channels</p>
                  <p className="text-xs text-muted-foreground">
                    Create invite-only channels for sensitive topics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Real-time messaging</p>
                  <p className="text-xs text-muted-foreground">
                    Messages delivered instantly across all devices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Free plan</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Up to 10 members and 10K messages included. Upgrade anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
