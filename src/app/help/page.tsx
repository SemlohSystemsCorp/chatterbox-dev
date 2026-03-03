import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Rocket,
  Hash,
  MessageSquare,
  Puzzle,
  Shield,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const topics = [
  {
    icon: Rocket,
    title: "Getting Started",
    description:
      "Learn the basics of setting up your workspace, inviting team members, and sending your first message.",
  },
  {
    icon: Hash,
    title: "Channels",
    description:
      "Create and manage channels, set permissions, pin messages, and organize conversations by topic.",
  },
  {
    icon: MessageSquare,
    title: "Messaging",
    description:
      "Send messages, share files, use threads, react with emoji, and format text with markdown.",
  },
  {
    icon: Puzzle,
    title: "Integrations",
    description:
      "Connect Chatterbox with the tools you already use, including GitHub, Jira, Google Drive, and more.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Understand our encryption, manage two-factor authentication, and configure your organization's security policies.",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description:
      "Manage your subscription, update payment methods, download invoices, and understand your usage.",
  },
];

export default function HelpPage() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-4">Help Center</h1>
        <p className="text-muted-foreground mb-8">
          Find answers, guides, and resources to help you get the most out of
          Chatterbox.
        </p>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help articles..."
            className="pl-10"
          />
        </div>

        {/* Topics Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Common Topics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.title}
                  className="rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Support */}
        <section className="rounded-lg border border-border p-8 text-center mb-12">
          <h2 className="text-xl font-semibold mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help. Reach out and we will get back to
            you within 24 hours.
          </p>
          <Button asChild>
            <a href="mailto:support@chatterbox.com">Contact Support</a>
          </Button>
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Want to learn more about Chatterbox?{" "}
            <Link href="/about" className="text-primary hover:underline">
              Visit our About page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
