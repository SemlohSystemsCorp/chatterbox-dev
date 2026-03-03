"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split("@")[0],
          display_name: email.split("@")[0],
          timezone,
          auth_provider: "email",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      try {
        const res = await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.user.id,
            email,
            fullName: "",
          }),
        });

        if (!res.ok) {
          const body = await res.json();
          setError(body.error || "Failed to send verification email.");
          setLoading(false);
          return;
        }
      } catch {
        setError("Failed to send verification email. Please try again.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("chatterbox_verify_email", email);
      sessionStorage.setItem("chatterbox_verify_user_id", data.user.id);
      router.push("/account/verify");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Get started with Chatterbox for free.
          </p>
        </div>

        {/* OAuth */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 text-sm font-medium"
            onClick={() => handleOAuth("google")}
            disabled={!!oauthLoading}
          >
            {oauthLoading === "google" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 h-6 w-6" />
            )}
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 text-sm font-medium"
            onClick={() => handleOAuth("github")}
            disabled={!!oauthLoading}
          >
            {oauthLoading === "github" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaGithub className="mr-2 h-5 w-5" />
            )}
            Continue with GitHub
          </Button>
        </div>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            or
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={loading || !!oauthLoading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
