import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

const entries = [
  {
    date: "March 2026",
    title: "Public beta launch",
    changes: [
      "Launched Chatterbox to the public",
      "Email sign-up with verification codes",
      "Google and GitHub OAuth",
      "Server creation with auto-generated invite codes",
      "Text channels with real-time messaging",
      "Role-based permissions (owner, admin, moderator, member)",
      "Friend requests and direct messages",
      "Password reset flow via email",
    ],
  },
  {
    date: "February 2026",
    title: "Internal alpha",
    changes: [
      "Core database schema and RLS policies",
      "Authentication system with Supabase",
      "Server and channel management",
      "Basic chat with message history",
      "User profiles and onboarding flow",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          What&apos;s new in Chatterbox.
        </p>

        <div className="mt-12 space-y-12">
          {entries.map((entry) => (
            <div key={entry.date} className="relative border-l-2 border-border pl-8">
              <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <p className="text-sm font-medium text-primary">{entry.date}</p>
              <h2 className="mt-1 text-lg font-semibold">{entry.title}</h2>
              <ul className="mt-3 space-y-1.5">
                {entry.changes.map((change) => (
                  <li
                    key={change}
                    className="text-sm text-muted-foreground"
                  >
                    &bull; {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
