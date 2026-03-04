import Link from "next/link";
import { ArrowRight, Hash, Headphones, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "Organized Channels",
    description:
      "Text, voice, forum, and announcement channels — keep every conversation in its place.",
  },
  {
    title: "Servers & Teams",
    description:
      "Create servers for your team, community, or project. Invite anyone with a link.",
  },
  {
    title: "Voice & Video",
    description:
      "Crystal-clear voice channels and video calls. Screen share with your whole team.",
  },
  {
    title: "Role-Based Permissions",
    description:
      "Fine-grained roles and permissions. Control who sees what, down to the channel level.",
  },
  {
    title: "Real-Time Messaging",
    description:
      "Messages, reactions, typing indicators, presence — all instant, all the time.",
  },
  {
    title: "Enterprise Security",
    description:
      "SSO, audit logs, compliance tools, and encryption. Built for organizations that care.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Team chat, done right.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            The power of Discord&apos;s servers and channels, with the polish
            and professionalism your team deserves. Real-time communication
            without the chaos.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {isLoggedIn ? (
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/app">
                  Open Chatterbox
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/signup">
                    Start for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* App Preview */}
        <div className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-xl border bg-card shadow-2xl">
          <div className="flex h-[500px] md:h-[600px]">
            {/* Server list */}
            <div className="hidden w-[72px] flex-col items-center gap-2 border-r bg-secondary/30 py-3 sm:flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="my-1 h-[2px] w-8 rounded-full bg-border" />
              {[
                { letter: "A", color: "bg-violet-500" },
                { letter: "D", color: "bg-blue-500" },
                { letter: "W", color: "bg-emerald-500" },
              ].map((s) => (
                <div
                  key={s.letter}
                  className={`flex h-12 w-12 items-center justify-center rounded-3xl ${s.color} text-sm font-bold text-white`}
                >
                  {s.letter}
                </div>
              ))}
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-muted text-lg text-muted-foreground">
                +
              </div>
            </div>

            {/* Channel sidebar */}
            <div className="hidden w-60 flex-col border-r bg-card md:flex">
              <div className="flex h-12 items-center border-b px-4">
                <span className="font-semibold">Acme Corp</span>
              </div>
              <div className="flex-1 space-y-4 p-3">
                <div>
                  <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    General
                  </p>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5 text-sm font-medium">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      general
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      announcements
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Engineering
                  </p>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      frontend
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      backend
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
                      <Headphones className="h-4 w-4" />
                      standup
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex flex-1 flex-col">
              <div className="flex h-12 items-center gap-2 border-b px-4">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">general</span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  — Team-wide discussions
                </span>
              </div>
              <div className="flex-1 space-y-4 p-4">
                {[
                  {
                    name: "Sarah Chen",
                    msg: "Just deployed v2.4 to staging. Can someone run the test suite?",
                    time: "10:32 AM",
                    color: "bg-violet-500",
                  },
                  {
                    name: "Alex Rivera",
                    msg: "On it! Running now. Also, the new dashboard looks incredible.",
                    time: "10:34 AM",
                    color: "bg-blue-500",
                  },
                  {
                    name: "Jordan Lee",
                    msg: "Agreed — the charts are so much smoother. Great work @sarah",
                    time: "10:35 AM",
                    color: "bg-emerald-500",
                  },
                ].map((m) => (
                  <div key={m.time} className="flex gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${m.color} text-xs font-bold text-white`}
                    >
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold">{m.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.time}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90">{m.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                <div className="flex items-center rounded-lg border bg-muted/30 px-4 py-2.5">
                  <span className="text-sm text-muted-foreground">
                    Message #general
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-muted-foreground">
              Built from the ground up for teams that want powerful communication
              without the noise.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 transition-colors hover:border-primary/20"
              >
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Get started in minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Set up your team workspace in three simple steps.
            </p>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create your server",
                description:
                  "Sign up, name your workspace, and customize it with your brand.",
              },
              {
                step: "2",
                title: "Invite your team",
                description:
                  "Share an invite link or send invitations directly via email.",
              },
              {
                step: "3",
                title: "Start talking",
                description:
                  "Create channels, hop on voice, and let the conversations flow.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-sm font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to upgrade your team chat?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of teams already using Chatterbox. Free to start, no
            credit card required.
          </p>
          <div className="mt-10">
            {isLoggedIn ? (
              <Button size="lg" asChild>
                <Link href="/app">
                  Open Chatterbox
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
