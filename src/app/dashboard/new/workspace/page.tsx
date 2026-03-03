"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Hash,
  Users,
  Building2,
  Plus,
  X,
  Mail,
  Check,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TOTAL_STEPS = 4;

export default function NewWorkspacePage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Name
  const [name, setName] = useState("");

  // Step 2: Channels
  const [extraChannels, setExtraChannels] = useState<string[]>([]);
  const [channelInput, setChannelInput] = useState("");

  // Step 3: Invite
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  // Step 4: Review & Create
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdWorkspace, setCreatedWorkspace] = useState<{
    id: string;
    channelId: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  function generateSlug(value: string) {
    return (
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 6)
    );
  }

  function addChannel() {
    const ch = channelInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/g, "")
      .replace(/\s+/g, "-");
    if (ch && ch !== "general" && !extraChannels.includes(ch)) {
      setExtraChannels([...extraChannels, ch]);
    }
    setChannelInput("");
  }

  function removeChannel(ch: string) {
    setExtraChannels(extraChannels.filter((c) => c !== ch));
  }

  function addEmail() {
    const email = emailInput.trim().toLowerCase();
    if (email && email.includes("@") && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email]);
    }
    setEmailInput("");
  }

  function removeEmail(email: string) {
    setInviteEmails(inviteEmails.filter((e) => e !== email));
  }

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/workspaces/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: generateSlug(name),
          channels: extraChannels,
          inviteEmails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create workspace.");
        setLoading(false);
        return;
      }

      setCreatedWorkspace({
        id: data.workspace.id,
        channelId: data.channelId,
      });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function goToWorkspace() {
    if (!createdWorkspace) return;
    if (createdWorkspace.channelId) {
      router.push(
        `/workspace/${createdWorkspace.id}/channel/${createdWorkspace.channelId}`
      );
    } else {
      router.push(`/workspace/${createdWorkspace.id}/channel/general`);
    }
  }

  async function copyInviteLink() {
    if (!createdWorkspace) return;
    const url = `${window.location.origin}/workspace/${createdWorkspace.id}/channel/general`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Success screen
  if (createdWorkspace) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {name} is ready!
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your workspace has been created
            {inviteEmails.length > 0
              ? ` and ${inviteEmails.length} invite${inviteEmails.length === 1 ? " has" : "s have"} been sent.`
              : "."}
          </p>

          <div className="space-y-3">
            <Button className="w-full h-11" onClick={goToWorkspace}>
              Open workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={copyInviteLink}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy workspace link
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-primary w-8" : "bg-muted w-6"
              }`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Workspace name */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) setStep(2);
            }}
          >
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Name your workspace
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                This is usually your company or team name.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="e.g. Acme Corp, Design Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                autoFocus
                required
              />

              {name.trim() && (
                <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {name.trim().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{name.trim()}</p>
                    <p className="text-xs text-muted-foreground">
                      Your new workspace
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11"
                disabled={!name.trim()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Step 1 of {TOTAL_STEPS}
            </p>
          </form>
        )}

        {/* Step 2: Channels */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Hash className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Add channels
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Channels keep conversations organized. #general is created
                automatically.
              </p>
            </div>

            <div className="space-y-4">
              {/* General channel (always included) */}
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
                <Hash className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium">general</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Default
                </span>
              </div>

              {/* Custom channels */}
              {extraChannels.map((ch) => (
                <div
                  key={ch}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5"
                >
                  <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{ch}</span>
                  <button
                    onClick={() => removeChannel(ch)}
                    className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Add channel input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addChannel();
                }}
                className="flex gap-2"
              >
                <Input
                  type="text"
                  placeholder="e.g. design, engineering, random"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  className="h-10"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  disabled={!channelInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button className="flex-1 h-11" onClick={() => setStep(3)}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Step 2 of {TOTAL_STEPS}
            </p>
          </div>
        )}

        {/* Step 3: Invite teammates */}
        {step === 3 && (
          <div>
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Invite your team
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Add teammates by email. You can always invite more later.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email list */}
              {inviteEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5"
                >
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{email}</span>
                  <button
                    onClick={() => removeEmail(email)}
                    className="ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Add email input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addEmail();
                }}
                className="flex gap-2"
              >
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-10"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  disabled={!emailInput.trim() || !emailInput.includes("@")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button className="flex-1 h-11" onClick={() => setStep(4)}>
                  {inviteEmails.length > 0 ? "Continue" : "Skip"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Step 3 of {TOTAL_STEPS}
            </p>
          </div>
        )}

        {/* Step 4: Review & Create */}
        {step === 4 && (
          <div>
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Review & create
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Everything look good? Let&apos;s launch your workspace.
              </p>
            </div>

            <div className="space-y-4">
              {/* Workspace summary */}
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary">
                      {name.trim().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{name.trim()}</p>
                    <p className="text-xs text-muted-foreground">Workspace</p>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {1 + extraChannels.length} channel
                      {extraChannels.length > 0 ? "s" : ""}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (general{extraChannels.length > 0 ? `, ${extraChannels.join(", ")}` : ""})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {inviteEmails.length > 0
                        ? `${inviteEmails.length} invite${inviteEmails.length === 1 ? "" : "s"} will be sent`
                        : "No invites (just you)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setStep(3)}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  className="flex-1 h-11"
                  onClick={handleCreate}
                  disabled={loading}
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
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Step 4 of {TOTAL_STEPS}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
