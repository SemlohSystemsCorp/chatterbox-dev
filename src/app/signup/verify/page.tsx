"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signup_email");
    if (!storedEmail) {
      router.push("/signup");
      return;
    }
    setEmail(storedEmail);
    setNewEmail(storedEmail);
  }, [router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code || code.length !== 6) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid code");
      }

      // Sign in with password
      const password = sessionStorage.getItem("signup_password");
      if (!password) {
        throw new Error("Session expired. Please sign up again.");
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      // Clean up session storage
      sessionStorage.removeItem("signup_email");
      sessionStorage.removeItem("signup_password");

      toast.success("Email verified!");
      router.push("/onboarding");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to resend code");
      }

      toast.success("New code sent!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsResending(false);
    }
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || newEmail === email) {
      setEditingEmail(false);
      return;
    }

    setIsResending(true);
    try {
      // Update the email on the account
      const res = await fetch("/api/auth/update-signup-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldEmail: email, newEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update email");
      }

      setEmail(newEmail);
      sessionStorage.setItem("signup_email", newEmail);
      setEditingEmail(false);
      toast.success(`Verification code sent to ${newEmail}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsResending(false);
    }
  }

  if (!email) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-foreground">Check your email</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Verification code
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                autoFocus
                className="h-10 text-center text-lg tracking-[0.5em]"
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full h-10" disabled={isLoading || code.length !== 6}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            {editingEmail ? (
              <form onSubmit={handleChangeEmail} className="space-y-2">
                <Input
                  type="email"
                  placeholder="new@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="h-10"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="flex-1"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Update & resend"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingEmail(false);
                      setNewEmail(email);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {isResending ? "Sending..." : "Resend code"}
                </button>
                <span className="text-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={() => setEditingEmail(true)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Change email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
