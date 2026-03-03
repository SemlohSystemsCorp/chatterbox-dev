"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 2;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Pre-fill name from profile if available
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, company, onboarding_completed")
        .eq("id", user.id)
        .single();

      // Redirect if onboarding already completed
      if (profile?.onboarding_completed) {
        router.push("/dashboard");
        return;
      }

      if (profile?.full_name) {
        setName(profile.full_name);
      }
      if (profile?.company) {
        setCompany(profile.company);
      }

      setInitialLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleFinish(skipCompany?: boolean) {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const updates: Record<string, unknown> = {
      full_name: name.trim(),
      display_name: name.trim().split(" ")[0],
      onboarding_completed: true,
    };

    if (!skipCompany && company.trim()) {
      updates.company = company.trim();
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (updateError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  }

  function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault();
    handleFinish();
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= step
                  ? "bg-primary w-8"
                  : "bg-muted w-6"
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

        {/* Step 1: Name */}
        {step === 1 && (
          <form onSubmit={handleNameSubmit}>
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                What&apos;s your name?
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                This is how you&apos;ll appear to your team.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                autoFocus
                required
              />

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

        {/* Step 2: Company */}
        {step === 2 && (
          <form onSubmit={handleCompanySubmit}>
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Where do you work?
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Help your teammates find you.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Finish setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => handleFinish(true)}
                disabled={loading}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Skip for now
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Step 2 of {TOTAL_STEPS}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
