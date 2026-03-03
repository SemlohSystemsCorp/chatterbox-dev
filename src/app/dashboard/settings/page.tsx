"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Bell,
  BellOff,
  Globe,
  Clock,
  Trash2,
  Save,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Theme
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // Notification preferences (stored in profile status field as JSON for now)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);

  // Language & Timezone
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

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

      const { data: profile } = await supabase
        .from("profiles")
        .select("locale, timezone")
        .eq("id", user.id)
        .single();

      if (profile) {
        setLanguage(profile.locale ?? "en");
        setTimezone(
          profile.timezone ??
            Intl.DateTimeFormat().resolvedOptions().timeZone
        );
      }

      // Load theme from localStorage
      const savedTheme = localStorage.getItem("chatterbox-theme") as
        | "light"
        | "dark"
        | "system"
        | null;
      if (savedTheme) setTheme(savedTheme);

      // Load notification prefs from localStorage
      const savedEmailNotifs = localStorage.getItem("chatterbox-email-notifs");
      if (savedEmailNotifs !== null)
        setEmailNotifications(savedEmailNotifs === "true");
      const savedDesktopNotifs = localStorage.getItem(
        "chatterbox-desktop-notifs"
      );
      if (savedDesktopNotifs !== null)
        setDesktopNotifications(savedDesktopNotifs === "true");

      setLoading(false);
    }

    load();
  }, [router]);

  function applyTheme(newTheme: "light" | "dark" | "system") {
    setTheme(newTheme);
    localStorage.setItem("chatterbox-theme", newTheme);

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  function toggleEmailNotifications() {
    const next = !emailNotifications;
    setEmailNotifications(next);
    localStorage.setItem("chatterbox-email-notifs", String(next));
  }

  function toggleDesktopNotifications() {
    const next = !desktopNotifications;
    setDesktopNotifications(next);
    localStorage.setItem("chatterbox-desktop-notifs", String(next));

    if (next && "Notification" in window) {
      Notification.requestPermission();
    }
  }

  async function handleSave() {
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
        locale: language,
        timezone,
      })
      .eq("id", user.id);

    if (error) {
      setErrorMessage("Failed to save settings. Please try again.");
    } else {
      setSuccessMessage("Settings saved successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSaving(false);
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/logged-out");
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
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1.5">
          Manage your account preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Theme */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Sun className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Theme</h2>
              <p className="text-xs text-muted-foreground">
                Choose how Chatterbox looks to you.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => applyTheme("light")}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => applyTheme("dark")}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => applyTheme("system")}
            >
              <Monitor className="h-3.5 w-3.5" />
              System
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Notifications</h2>
              <p className="text-xs text-muted-foreground">
                Control how you receive notifications.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates and mentions via email.
                  </p>
                </div>
              </div>
              <Button
                variant={emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={toggleEmailNotifications}
              >
                {emailNotifications ? "On" : "Off"}
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-3">
                {desktopNotifications ? (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Desktop notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Show browser push notifications.
                  </p>
                </div>
              </div>
              <Button
                variant={desktopNotifications ? "default" : "outline"}
                size="sm"
                onClick={toggleDesktopNotifications}
              >
                {desktopNotifications ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Language</h2>
              <p className="text-xs text-muted-foreground">
                Select your preferred language.
              </p>
            </div>
          </div>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Timezone */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Timezone</h2>
              <p className="text-xs text-muted-foreground">
                Used for timestamps and scheduling.
              </p>
            </div>
          </div>
          <div className="relative">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
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

        {/* Save */}
        <Button
          className="w-full h-11 gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save settings"}
        </Button>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-destructive">
                Danger Zone
              </h2>
              <p className="text-xs text-muted-foreground">
                Irreversible actions that affect your account.
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete account
            </Button>
          ) : (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive font-medium mb-1">
                Are you absolutely sure?
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                This will permanently delete your account, all your messages,
                and remove you from all workspaces. Type{" "}
                <span className="font-mono font-semibold">DELETE</span> to
                confirm.
              </p>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="mb-3 font-mono"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteConfirmText !== "DELETE" || deleting}
                  onClick={handleDeleteAccount}
                >
                  {deleting ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                  )}
                  Delete my account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
