"use client";

import Link from "next/link";
import { MessageSquare, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
        </Link>

        {/* Success Icon */}
        <div className="relative inline-flex mb-6">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Email verified!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Your account is all set. Complete your profile setup to get the most
          out of Chatterbox, or jump straight into your dashboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Button size="lg" className="w-full" asChild>
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/dashboard?onboarding=true">
              <Sparkles className="mr-2 h-4 w-4" />
              Complete Onboarding
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          You can always complete onboarding later from your profile settings.
        </p>
      </div>
    </div>
  );
}
