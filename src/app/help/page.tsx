import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

const categories = [
  {
    title: "Getting Started",
    articles: [
      { title: "Creating your account", description: "Sign up and verify your email" },
      { title: "Setting up your first server", description: "Create a workspace and invite your team" },
      { title: "Understanding channels", description: "Text, voice, and forum channels explained" },
      { title: "Customizing your profile", description: "Username, avatar, and status" },
    ],
  },
  {
    title: "Account & Security",
    articles: [
      { title: "Changing your password", description: "Reset or update your password" },
      { title: "Two-factor authentication", description: "Add an extra layer of security" },
      { title: "Deleting your account", description: "Permanently remove your data" },
      { title: "Managing email notifications", description: "Control what emails you receive" },
    ],
  },
  {
    title: "Servers & Channels",
    articles: [
      { title: "Creating and managing servers", description: "Server settings and customization" },
      { title: "Roles and permissions", description: "Control who can do what" },
      { title: "Invite links", description: "Share your server with others" },
      { title: "Channel types", description: "Text, voice, forum, and announcements" },
    ],
  },
  {
    title: "Billing & Plans",
    articles: [
      { title: "Free vs. Pro vs. Enterprise", description: "Compare plans and features" },
      { title: "Managing your subscription", description: "Upgrade, downgrade, or cancel" },
      { title: "Student and nonprofit discounts", description: "Apply for special pricing" },
      { title: "Payment methods", description: "Cards, invoices, and billing history" },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Help Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about Chatterbox.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category.title} className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 font-semibold">{category.title}</h2>
              <div className="space-y-3">
                {category.articles.map((article) => (
                  <div
                    key={article.title}
                    className="border-b border-border/50 pb-3 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border bg-muted/30 p-8 text-center">
          <h2 className="text-lg font-semibold">Still need help?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Reach out to our team.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
          >
            Contact support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
