"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  Loader2,
  Hash,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceWithRole {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/workspaces/list");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setUserName(data.profile.displayName);
          setWorkspaces(data.workspaces);
        }
      } catch {
        // Network error
      }
      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const greeting = userName
    ? `Welcome back, ${userName}`
    : "Welcome to Chatterbox";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground mt-1.5">
          {workspaces.length > 0
            ? "Jump into a workspace or create a new one."
            : "Get started by creating your first workspace or joining one."}
        </p>
      </div>

      {/* Workspaces list */}
      {workspaces.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Your workspaces
          </h2>
          <div className="space-y-2">
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspace/${ws.id}/channel/general`}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/25 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/[0.03] transition-all group"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {ws.icon_url ? (
                    <img
                      src={ws.icon_url}
                      alt={ws.name}
                      className="h-11 w-11 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {ws.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{ws.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {ws.role}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/new/workspace"
          className="rounded-xl border border-dashed border-border/60 bg-card/30 p-6 hover:border-primary/30 hover:bg-card/50 transition-all group"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">Create a workspace</h3>
          <p className="text-sm text-muted-foreground">
            Set up a new workspace for your team to collaborate.
          </p>
        </Link>

        <Link
          href="/dashboard/join"
          className="rounded-xl border border-dashed border-border/60 bg-card/30 p-6 hover:border-primary/30 hover:bg-card/50 transition-all group"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">Join a workspace</h3>
          <p className="text-sm text-muted-foreground">
            Enter an invite code or link to join an existing workspace.
          </p>
        </Link>
      </div>

      {/* Quick links */}
      {workspaces.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick links
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/dashboard/new/workspace">
                <Hash className="h-3.5 w-3.5" />
                New workspace
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/dashboard/join">
                <Users className="h-3.5 w-3.5" />
                Join workspace
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Clock className="h-3.5 w-3.5" />
              Recent threads
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
