"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function handleRecoveryToken() {
      const supabase = createClient();

      // Check if there's a hash fragment with access_token (Supabase recovery redirect)
      const hash = window.location.hash.substring(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (accessToken && type === "recovery") {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (error) {
            setError("This reset link is invalid or has expired. Please request a new one.");
            setIsInitializing(false);
            return;
          }

          // Clear the hash from URL
          window.history.replaceState(null, "", window.location.pathname);
          setSessionReady(true);
          setIsInitializing(false);
          return;
        }
      }

      // No hash fragment — check if user already has a valid session (e.g. came via callback route)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSessionReady(true);
        setIsInitializing(false);
        return;
      }

      // No session and no token — invalid access
      setError("No reset token found. Please request a new password reset link.");
      setIsInitializing(false);
    }

    handleRecoveryToken();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw new Error(error.message);
      }

      setDone(true);
      setTimeout(() => router.push("/app"), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // Loading state while checking token
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state — invalid or expired token
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-[400px]">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <h1 className="mt-4 text-xl font-semibold text-foreground">
                Link expired
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button className="w-full h-10" asChild>
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mb-6 text-center">
            {done ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <h1 className="mt-4 text-xl font-semibold text-foreground">
                  Password updated
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Your password has been reset. Redirecting you now...
                </p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-foreground">
                  Set a new password
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Choose a strong password for your account.
                </p>
              </>
            )}
          </div>

          {!done && sessionReady && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  New password
                </label>
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  minLength={8}
                  className="h-10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-10"
                />
              </div>
              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
