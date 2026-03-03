import Link from "next/link";
import { ArrowLeft, Heart, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-8">
          About Chatterbox
        </h1>

        {/* Mission Statement */}
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">
          Chatterbox is built on a simple belief: great teams communicate
          effortlessly. We are on a mission to make workplace collaboration
          faster, more intuitive, and genuinely enjoyable for teams of every
          size.
        </p>

        {/* Our Story */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Chatterbox started in 2023 when a small group of engineers grew
              frustrated with the cluttered, noisy communication tools they used
              every day. They wanted something that stayed out of the way and let
              conversations flow naturally, without endless notifications and
              bloated feature sets.
            </p>
            <p>
              What began as an internal tool quickly grew into something bigger.
              Early testers loved the clean interface, the snappy performance,
              and the focus on what actually matters: connecting people. Today,
              Chatterbox is trusted by thousands of teams around the world to
              keep their conversations organized and their work moving forward.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-6">
              <Heart className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">People First</h3>
              <p className="text-sm text-muted-foreground">
                Every feature we build starts with a real human need. We listen
                to our users and design for the way people actually work.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <Zap className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Speed Matters</h3>
              <p className="text-sm text-muted-foreground">
                Communication should never feel slow. We obsess over performance
                so your messages arrive instantly and the app always feels
                responsive.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <Shield className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Trust & Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Your conversations are yours. We use end-to-end encryption,
                never sell your data, and give you full control over your
                information.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <Users className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Inclusive by Design</h3>
              <p className="text-sm text-muted-foreground">
                Great tools work for everyone. We build with accessibility in
                mind and support teams across languages, time zones, and
                abilities.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Our Team</h2>
          <p className="text-muted-foreground leading-relaxed">
            Chatterbox is built by a distributed team of engineers, designers,
            and product thinkers spread across North America and Europe. We come
            from companies like Slack, Discord, and Notion, and we are united by
            a shared passion for building communication tools that people
            genuinely love to use. We are always looking for curious,
            kind-hearted people to join us.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Interested in joining us?{" "}
            <Link href="/careers" className="text-primary hover:underline">
              View open positions
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
