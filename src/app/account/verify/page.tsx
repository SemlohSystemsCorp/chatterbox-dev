"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, ArrowRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email =
    typeof window !== "undefined"
      ? sessionStorage.getItem("chatterbox_verify_email")
      : null;
  const userId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("chatterbox_verify_user_id")
      : null;

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Take last char
    setCode(newCode);
    setError(null);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (value && index === 5 && newCode.every((d) => d !== "")) {
      handleVerify(newCode.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus the next empty input or last input
    const nextEmpty = newCode.findIndex((d) => d === "");
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  }

  async function handleVerify(codeStr?: string) {
    const fullCode = codeStr || code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          code: fullCode,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Verification failed. Please try again.");
        setLoading(false);
        return;
      }

      // Clear session storage
      sessionStorage.removeItem("chatterbox_verify_email");
      sessionStorage.removeItem("chatterbox_verify_user_id");

      router.push("/account/verified");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!userId || !email) return;

    setResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, fullName: "" }),
      });

      if (res.ok) {
        setResendSuccess(true);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Failed to resend code. Please try again.");
      }
    } catch {
      setError("Failed to resend code.");
    }

    setResending(false);
  }

  // If no email in session, show fallback
  if (typeof window !== "undefined" && !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            No verification pending
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            It looks like you don&apos;t have a pending verification. Please
            sign up first.
          </p>
          <Button asChild>
            <Link href="/signup">Go to Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            We sent a 6-digit code to{" "}
            <strong className="text-foreground">{email}</strong>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        {/* Resend success */}
        {resendSuccess && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400 mb-4">
            A new code has been sent to your email.
          </div>
        )}

        {/* Code Input */}
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-mono font-bold"
              disabled={loading}
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          className="w-full h-11 mb-4"
          onClick={() => handleVerify()}
          disabled={loading || code.some((d) => d === "")}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Verify email
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Resend */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            {resending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCw className="h-3.5 w-3.5" />
            )}
            Resend code
          </button>
        </div>

        {/* Back to login */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Wrong email?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Start over
          </Link>
        </p>
      </div>
    </div>
  );
}
