"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { validateUsername, sanitizeUsername } from "@/lib/validators";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // If user already has a username set (not the default email prefix), skip onboarding
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile?.username && !profile.username.startsWith("user-")) {
        router.push("/app");
        return;
      }

      setIsChecking(false);
    }
    checkAuth();
  }, [router]);

  function handleUsernameChange(value: string) {
    const sanitized = sanitizeUsername(value);
    setUsername(sanitized);

    if (sanitized.length > 0) {
      const result = validateUsername(sanitized);
      setUsernameError(result.valid ? "" : (result.error || ""));
    } else {
      setUsernameError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !dobMonth || !dobDay || !dobYear) return;

    const usernameResult = validateUsername(username);
    if (!usernameResult.valid) {
      setUsernameError(usernameResult.error || "Invalid username");
      return;
    }

    // Validate date of birth
    const month = parseInt(dobMonth);
    const day = parseInt(dobDay);
    const year = parseInt(dobYear);

    if (!month || !day || !year || month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
      toast.error("Please enter a valid date of birth");
      return;
    }

    const dob = new Date(year, month - 1, day);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 13) {
      toast.error("You must be at least 13 years old to use Chatterbox");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          dateOfBirth: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete setup");
      }

      toast.success("You're all set!");
      router.push("/app");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-foreground">Finish setting up</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Choose a username and enter your date of birth
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                type="text"
                placeholder="cooluser"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                required
                className="h-10"
              />
              {usernameError ? (
                <p className="mt-1 text-xs text-destructive">{usernameError}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  This is how others will see you. Only lowercase letters, numbers, dots, hyphens, and underscores.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Date of birth
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="MM"
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  required
                  className="h-10 text-center"
                  maxLength={2}
                />
                <Input
                  type="text"
                  placeholder="DD"
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  required
                  className="h-10 text-center"
                  maxLength={2}
                />
                <Input
                  type="text"
                  placeholder="YYYY"
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  required
                  className="h-10 text-center"
                  maxLength={4}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10"
              disabled={isLoading || !!usernameError}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Complete setup"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground pt-2">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
