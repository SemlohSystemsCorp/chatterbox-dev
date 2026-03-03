"use client";

import { useState } from "react";
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

export default function SettingsPage() {
  const router = useRouter();

  // Theme
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);

  // Language
  const [language, setLanguage] = useState("en");

  // Timezone
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1.5">
          Manage your account preferences and application settings.
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
              onClick={() => setTheme("light")}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setTheme("system")}
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
                onClick={() => setEmailNotifications(!emailNotifications)}
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
                onClick={() => setDesktopNotifications(!desktopNotifications)}
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
                Select your preferred language for the interface.
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
                Auto-detected from your browser. You can change it below.
              </p>
            </div>
          </div>
          <Input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="h-10"
            placeholder="e.g. America/New_York"
          />
        </div>

        {/* Save */}
        <Button className="w-full h-11 gap-2">
          <Save className="h-4 w-4" />
          Save settings
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
                Are you sure?
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                This will permanently delete your account, all your messages,
                and remove you from all workspaces. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Yes, delete my account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
