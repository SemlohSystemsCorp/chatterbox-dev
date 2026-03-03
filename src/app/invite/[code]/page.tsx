"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [status, setStatus] = useState<
    "loading" | "joining" | "success" | "error" | "login_required"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    async function processInvite() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("login_required");
        return;
      }

      setStatus("joining");

      // Find the invitation
      const { data: invitation, error: invError } = await supabase
        .from("workspace_invitations")
        .select(
          "id, workspace_id, role, expires_at, accepted_at, workspaces(name)"
        )
        .eq("token", code)
        .single();

      if (invError || !invitation) {
        setErrorMessage("This invite link is invalid or has been revoked.");
        setStatus("error");
        return;
      }

      const ws = invitation.workspaces as unknown as { name: string } | null;
      if (ws) setWorkspaceName(ws.name);

      if (invitation.accepted_at) {
        setErrorMessage("This invite has already been used.");
        setStatus("error");
        return;
      }

      if (new Date(invitation.expires_at) < new Date()) {
        setErrorMessage(
          "This invite has expired. Ask your admin for a new one."
        );
        setStatus("error");
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
        // Already a member, find channel to redirect
        const { data: generalChannel } = await supabase
          .from("channels")
          .select("id")
          .eq("workspace_id", invitation.workspace_id)
          .eq("name", "general")
          .single();

        setRedirectUrl(
          generalChannel
            ? `/workspace/${invitation.workspace_id}/channel/${generalChannel.id}`
            : `/workspace/${invitation.workspace_id}/channel/general`
        );
        setStatus("success");
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
        setErrorMessage("Failed to join workspace. Please try again.");
        setStatus("error");
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

      setRedirectUrl(
        generalChannel
          ? `/workspace/${invitation.workspace_id}/channel/${generalChannel.id}`
          : `/workspace/${invitation.workspace_id}/channel/general`
      );
      setStatus("success");
    }

    processInvite();
  }, [code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        {/* Loading */}
        {(status === "loading" || status === "joining") && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-xl font-bold tracking-tight mb-1">
              {status === "loading"
                ? "Checking invite..."
                : "Joining workspace..."}
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait a moment.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-1">
              You&apos;re in!
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {workspaceName
                ? `You've joined ${workspaceName}.`
                : "You've joined the workspace."}
            </p>
            <Button className="w-full" asChild>
              <Link href={redirectUrl}>
                Open workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-1">
              Invite failed
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {errorMessage}
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/join">Enter code manually</Link>
              </Button>
            </div>
          </>
        )}

        {/* Login required */}
        {status === "login_required" && (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-1">
              Sign in to continue
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              You need an account to join this workspace.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href={`/login?next=/invite/${code}`}>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/signup?next=/invite/${code}`}>
                  Create an account
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
