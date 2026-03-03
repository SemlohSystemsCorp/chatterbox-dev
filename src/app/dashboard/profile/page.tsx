"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, display_name, company")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setDisplayName(profile.display_name ?? "");
        setCompany(profile.company ?? "");
      }

      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("You must be logged in to update your profile.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        display_name: displayName,
        company,
      })
      .eq("id", user.id);

    if (error) {
      setErrorMessage("Failed to update profile. Please try again.");
    } else {
      setSuccessMessage("Profile updated successfully.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <Input value={email} disabled className="bg-muted/50" />
          <p className="text-xs text-muted-foreground mt-1">
            Email cannot be changed here.
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name</label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Display Name
          </label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How others see you in Chatterbox"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Company</label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company or organization"
          />
        </div>

        {/* Messages */}
        {successMessage && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {/* Save button */}
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
