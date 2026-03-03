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
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
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
        .select(
          "full_name, display_name, company, job_title, phone, bio, website"
        )
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setDisplayName(profile.display_name ?? "");
        setCompany(profile.company ?? "");
        setJobTitle(profile.job_title ?? "");
        setPhone(profile.phone ?? "");
        setBio(profile.bio ?? "");
        setWebsite(profile.website ?? "");
      }

      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("You must be logged in.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        display_name: displayName.trim() || null,
        company: company.trim() || null,
        job_title: jobTitle.trim() || null,
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        website: website.trim() || null,
      })
      .eq("id", user.id);

    if (error) {
      setErrorMessage("Failed to update profile. Please try again.");
    } else {
      setSuccessMessage("Profile updated successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
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
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

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

      <form onSubmit={handleSave} className="space-y-5">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <Input value={email} disabled className="bg-muted/50" />
          <p className="text-xs text-muted-foreground mt-1">
            Email cannot be changed here.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Display Name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How others see you"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Job Title
            </label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Company</label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company or organization"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Phone</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your team a little about yourself"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Website</label>
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
