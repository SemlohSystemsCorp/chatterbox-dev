import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
  Bolt,
  ShieldCheck,
  Workflow,
  BrainCircuit,
  Layers3,
  Radio,
  FileSearch,
  Video,
  Palette,
  Globe2,
  Star,
  MessageCircleHeart,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaGoogle, FaApple, FaAmazon, FaSpotify, FaSlack, FaDropbox, FaStripe, FaXTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa6";

const trustedBy = [
  { name: "Google", icon: FaGoogle, size: "text-2xl" },
  { name: "Apple", icon: FaApple, size: "text-3xl" },
  { name: "Amazon", icon: FaAmazon, size: "text-3xl" },
  { name: "Spotify", icon: FaSpotify, size: "text-2xl" },
  { name: "Slack", icon: FaSlack, size: "text-2xl" },
  { name: "Dropbox", icon: FaDropbox, size: "text-2xl" },
  { name: "Stripe", icon: FaStripe, size: "text-3xl" },
];

const features = [
  {
    icon: Radio,
    title: "Real-time Messaging",
    description:
      "Sub-50ms delivery with live typing indicators, read receipts, and online presence. Conversations feel instant.",
  },
  {
    icon: Workflow,
    title: "Channels & Threads",
    description:
      "Organize by team, project, or topic. Threads keep deep discussions contained without cluttering the main feed.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Search",
    description:
      "Find any message, file, or decision instantly. Semantic search understands what you mean, not just what you type.",
  },
  {
    icon: Video,
    title: "Huddles & Calls",
    description:
      "Jump into audio and video huddles directly from any channel. Screen share, record, and transcribe automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II compliant. End-to-end encryption, SSO/SAML, SCIM provisioning, and granular admin controls.",
  },
  {
    icon: Layers3,
    title: "Integrations Hub",
    description:
      "Connect 500+ tools. GitHub, Jira, Figma, Google Workspace, and custom webhooks. Your stack, unified.",
  },
  {
    icon: FileSearch,
    title: "File Sharing & Previews",
    description:
      "Drag-and-drop files up to 10GB. Inline previews for images, PDFs, code snippets, and spreadsheets.",
  },
  {
    icon: Palette,
    title: "Custom Workflows",
    description:
      "Automate approvals, alerts, and handoffs with a visual workflow builder. No code required.",
  },
  {
    icon: Globe2,
    title: "Global Infrastructure",
    description:
      "Edge-deployed across 40+ regions. 99.99% uptime SLA. Your team stays connected, wherever they are.",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For small teams getting started",
    features: [
      "Up to 10 team members",
      "10K message history",
      "5GB file storage",
      "1:1 and group channels",
      "Basic integrations",
      "Mobile & desktop apps",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "per user/mo",
    description: "For growing teams that need more",
    features: [
      "Unlimited members",
      "Unlimited message history",
      "50GB file storage per user",
      "Threaded conversations",
      "Video huddles & screen share",
      "AI-powered search",
      "Custom workflows",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    description: "For organizations at scale",
    features: [
      "Everything in Pro",
      "Unlimited file storage",
      "SSO / SAML / SCIM",
      "SOC 2 & HIPAA compliance",
      "99.99% uptime SLA",
      "Dedicated success manager",
      "Custom integrations",
      "On-prem deployment option",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const stats = [
  { value: "10M+", label: "Messages sent daily" },
  { value: "50K+", label: "Teams worldwide" },
  { value: "99.99%", label: "Uptime guaranteed" },
  { value: "<50ms", label: "Message latency" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ===================== NAVBAR ===================== */}
      <nav className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Chatterbox
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#customers"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Customers
              </Link>
              <Link
                href="#security"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Security
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-500/[0.06] blur-3xl" />
          <div className="absolute top-[200px] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-500/[0.06] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Now with AI-powered search & workflows
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.08] mb-6">
              Team communication
              <br />
              <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                that just works
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time messaging, organized channels, threaded conversations,
              and enterprise-grade security. Chatterbox is the communications
              platform your team actually enjoys using.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 h-12" asChild>
                <Link href="/signup">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 h-12"
              >
                <Video className="mr-2 h-4 w-4" />
                Watch demo
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Free forever for teams up to 10. No credit card required.
            </p>
          </div>

          {/* ── App Preview ── */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/5 overflow-hidden ring-1 ring-white/[0.05]">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  chatterbox.app
                </span>
              </div>
              <div className="flex min-h-[340px]">
                {/* Sidebar */}
                <div className="w-56 lg:w-64 bg-sidebar border-r border-sidebar-border p-3 hidden sm:block">
                  <div className="flex items-center gap-2 mb-5 px-1">
                    <div className="h-6 w-6 rounded-md bg-sidebar-primary flex items-center justify-center">
                      <MessageSquare className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-sidebar-foreground">
                      Acme Corp
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1.5">
                    Channels
                  </p>
                  <div className="space-y-0.5">
                    {[
                      { name: "general", active: true, unread: 3 },
                      { name: "engineering", active: false },
                      { name: "design", active: false },
                      { name: "product", active: false },
                    ].map((ch) => (
                      <div
                        key={ch.name}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm ${
                          ch.active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/60"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-sidebar-foreground/40">#</span>
                          {ch.name}
                        </span>
                        {ch.unread && (
                          <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 font-bold">
                            {ch.unread}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-2 mt-5 mb-1.5">
                    Direct Messages
                  </p>
                  <div className="space-y-0.5">
                    {[
                      { name: "Sarah Kim", online: true },
                      { name: "James D.", online: true },
                      { name: "Alex Chen", online: false },
                    ].map((dm) => (
                      <div
                        key={dm.name}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-sidebar-foreground/60"
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            dm.online ? "bg-green-500" : "bg-muted-foreground/30"
                          }`}
                        />
                        {dm.name}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chat area */}
                <div className="flex-1 flex flex-col">
                  <div className="px-5 py-3 border-b border-border/40 flex items-center gap-2">
                    <span className="text-muted-foreground/50 font-medium">
                      #
                    </span>
                    <span className="font-semibold text-sm">general</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      Company-wide announcements
                    </span>
                  </div>
                  <div className="flex-1 p-5 space-y-5">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0">
                        SK
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            Sarah Kim
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            10:32 AM
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 mt-0.5">
                          Just shipped the new dashboard redesign! Check it out
                          and let me know your thoughts.
                        </p>
                        <div className="flex gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs">
                            <span>&#127881;</span>
                            <span className="font-medium text-primary">4</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs">
                            <span>&#128293;</span>
                            <span className="font-medium">2</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                        JD
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            James Davis
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            10:34 AM
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 mt-0.5">
                          This looks amazing! The new sidebar navigation is so
                          much cleaner. Approved.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Composer */}
                  <div className="px-5 pb-4">
                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                      <span className="text-sm text-muted-foreground/50 flex-1">
                        Message #general
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground/40">
                        <Bolt className="h-4 w-4" />
                        <Palette className="h-4 w-4" />
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TRUSTED BY ===================== */}
      <section id="customers" className="py-16 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-muted-foreground/60 uppercase tracking-widest mb-10">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {trustedBy.map((company) => (
              <div
                key={company.name}
                className="text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors select-none flex items-center gap-2"
                title={company.name}
              >
                <company.icon className={company.size} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="py-16 border-t border-border/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section
        id="features"
        className="py-24 border-t border-border/30 relative"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.02] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 px-3 py-1 text-xs gap-1.5"
            >
              <Bolt className="h-3 w-3 text-primary" />
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need,
              <br />
              nothing you don&apos;t
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Purpose-built for teams that need speed, security, and a
              communications platform that gets out of the way.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/25 hover:bg-card hover:shadow-xl hover:shadow-primary/[0.03] transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SECURITY ===================== */}
      <section id="security" className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 px-3 py-1 text-xs gap-1.5"
              >
                <ShieldCheck className="h-3 w-3 text-primary" />
                Enterprise Security
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Security your CISO
                <br />
                will love
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Chatterbox is built security-first from the ground up. Not
                bolted on after the fact.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "End-to-end encryption",
                  "SOC 2 Type II certified",
                  "SSO / SAML 2.0",
                  "SCIM provisioning",
                  "HIPAA compliant",
                  "Data residency controls",
                  "Audit logging",
                  "Admin analytics",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent blur-2xl" />
              <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Security Dashboard</p>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: "Encryption",
                      value: "AES-256-GCM",
                      status: "Active",
                    },
                    {
                      label: "Auth Method",
                      value: "SAML 2.0 + MFA",
                      status: "Active",
                    },
                    {
                      label: "Compliance",
                      value: "SOC 2 / HIPAA",
                      status: "Certified",
                    },
                    {
                      label: "Data Region",
                      value: "US-East-1",
                      status: "Active",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {row.label}
                        </p>
                        <p className="text-sm font-medium">{row.value}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        {row.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIAL ===================== */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-yellow-500 text-yellow-500"
              />
            ))}
          </div>
          <blockquote className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-6">
            &ldquo;Chatterbox replaced three different tools for us. The
            threading alone saved our engineering team hours every week. It&apos;s
            the communications platform we always wanted.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              MR
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Maria Rodriguez</p>
              <p className="text-xs text-muted-foreground">VP of Engineering, Uber</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRICING ===================== */}
      <section
        id="pricing"
        className="py-24 border-t border-border/30 relative"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 px-3 py-1 text-xs gap-1.5"
            >
              <MessageCircleHeart className="h-3 w-3 text-primary" />
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free, scale when you&apos;re ready. No surprises, no hidden
              fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  tier.highlighted
                    ? "border-primary/40 bg-card shadow-xl shadow-primary/5 ring-1 ring-primary/20"
                    : "border-border/50 bg-card/50"
                }`}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3">
                    Most Popular
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href="/signup">
                    {tier.cta}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/[0.08] via-violet-500/[0.04] to-transparent border border-primary/10 p-12 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/10 blur-3xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Ready to ditch the noise?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join 50,000+ teams communicating better with Chatterbox. Free
              forever for small teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 h-12" asChild>
                <Link href="/signup">
                  Get started for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 h-12"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer */}
          <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">Chatterbox</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Enterprise communications, reimagined for modern teams.
              </p>
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <FaXTwitter className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-semibold mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Changelog", href: "/changelog" },
                  { label: "Help", href: "/help" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold mb-4">Company</p>
              <ul className="space-y-2.5">
                {[
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-sm font-semibold mb-4">Resources</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Help Center", href: "/help" },
                  { label: "Contact Support", href: "/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-sm font-semibold mb-4">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "#" },
                  { label: "GDPR", href: "#" },
                  { label: "Security", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/40 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Chatterbox by Semloh Systems
              Corp. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
