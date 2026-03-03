import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const releases = [
  {
    version: "v1.3.0",
    date: "February 18, 2026",
    changes: [
      { type: "New", text: "Video and voice calls with screen sharing support" },
      { type: "New", text: "Custom emoji uploads for workspaces" },
      { type: "Improved", text: "Message search now returns results 3x faster" },
      { type: "Improved", text: "File previews for PDFs, images, and code snippets" },
      { type: "Fixed", text: "Notification sound not playing on Firefox" },
    ],
  },
  {
    version: "v1.2.0",
    date: "January 6, 2026",
    changes: [
      { type: "New", text: "Threaded replies for organized conversations" },
      { type: "New", text: "Integration with GitHub for pull request notifications" },
      { type: "Improved", text: "Channel sidebar now supports drag-and-drop reordering" },
      { type: "Fixed", text: "Markdown rendering issues in code blocks" },
      { type: "Fixed", text: "Duplicate notifications when mentioned in a thread" },
    ],
  },
  {
    version: "v1.1.0",
    date: "November 12, 2025",
    changes: [
      { type: "New", text: "Direct message groups with up to 8 participants" },
      { type: "New", text: "Message pinning in channels" },
      { type: "Improved", text: "Reduced memory usage by 40% on desktop" },
      { type: "Improved", text: "Updated emoji picker with search functionality" },
      { type: "Fixed", text: "Unread badge count not resetting after reading messages" },
    ],
  },
  {
    version: "v1.0.0",
    date: "September 1, 2025",
    changes: [
      { type: "New", text: "Initial release of Chatterbox" },
      { type: "New", text: "Real-time messaging with channels and direct messages" },
      { type: "New", text: "File sharing with drag-and-drop uploads" },
      { type: "New", text: "User presence indicators and typing status" },
      { type: "New", text: "Workspace creation and member invitations" },
    ],
  },
];

function getBadgeVariant(type: string) {
  switch (type) {
    case "New":
      return "default" as const;
    case "Improved":
      return "secondary" as const;
    case "Fixed":
      return "outline" as const;
    default:
      return "default" as const;
  }
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-lg font-bold">Chatterbox</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4">Changelog</h1>
        <p className="text-muted-foreground mb-12">
          All the latest updates, improvements, and fixes to Chatterbox.
        </p>

        {/* Timeline */}
        <div className="space-y-12">
          {releases.map((release, index) => (
            <div key={release.version} className="relative">
              {/* Connector line */}
              {index < releases.length - 1 && (
                <div className="absolute left-[7px] top-8 bottom-0 w-px bg-border hidden sm:block" />
              )}

              <div className="flex gap-6">
                {/* Timeline dot */}
                <div className="hidden sm:block mt-2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-background" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-4">
                    <h2 className="text-xl font-semibold">{release.version}</h2>
                    <span className="text-sm text-muted-foreground">
                      {release.date}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {release.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Badge
                          variant={getBadgeVariant(change.type)}
                          className="mt-0.5 shrink-0 text-xs"
                        >
                          {change.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {change.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
