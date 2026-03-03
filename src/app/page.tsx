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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ChatterboxLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M8 11C8 9.89543 8.89543 9 10 9H22C23.1046 9 24 9.89543 24 11V19C24 20.1046 23.1046 21 22 21H18L14 25V21H10C8.89543 21 8 20.1046 8 19V11Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="12.5" cy="15" r="1.5" className="fill-primary" />
      <circle cx="16" cy="15" r="1.5" className="fill-primary" />
      <circle cx="19.5" cy="15" r="1.5" className="fill-primary" />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 272 92" fill="currentColor">
      <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
      <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
      <path d="M225 3v65h-9.5V3h9.5z"/>
      <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
      <path d="M35.29 41.19V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49-.21z"/>
    </svg>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.93.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.73-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.39 7.09-28.3 3.72-6.36 8.67-11.39 14.87-15.08 6.2-3.7 12.9-5.59 20.12-5.73 3.92 0 9.06 1.21 15.43 3.59 6.36 2.39 10.44 3.6 12.24 3.6 1.34 0 5.87-1.42 13.57-4.23 7.28-2.61 13.43-3.69 18.46-3.27 13.64 1.1 23.89 6.47 30.7 16.14-12.2 7.39-18.24 17.74-18.12 31.03.11 10.33 3.86 18.94 11.23 25.8 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.1-2.96 15.67-8.86 22.67-7.12 8.32-15.73 13.13-25.07 12.37a25.2 25.2 0 01-.19-3.07c0-7.77 3.38-16.09 9.39-22.89 3-3.44 6.82-6.31 11.45-8.6 4.62-2.26 8.99-3.51 13.1-3.72.12 1.1.18 2.2.18 3.24z"/>
    </svg>
  );
}

function NikeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 69.7 30.4" fill="currentColor">
      <path d="M17.8 30.4L0 12.2 47 0l22.7 6.2L17.8 30.4z"/>
    </svg>
  );
}

function SamsungLogo({ className }: { className?: string }) {
  return (
    <span className={`${className} font-bold tracking-[0.25em] text-[1.2rem] leading-none uppercase`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      SAMSUNG
    </span>
  );
}

function UberLogo({ className }: { className?: string }) {
  return (
    <span className={`${className} font-bold tracking-tight text-[1.5rem] leading-none`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      Uber
    </span>
  );
}

function LogitechLogo({ className }: { className?: string }) {
  return (
    <span className={`${className} font-extrabold tracking-tight text-[1.4rem] leading-none`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      logi<span className="font-normal">tech</span>
    </span>
  );
}

function PringlesLogo({ className }: { className?: string }) {
  return (
    <span className={`${className} font-extrabold tracking-tight text-[1.4rem] italic leading-none`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      Pringles
    </span>
  );
}

function TeamUSALogo({ className }: { className?: string }) {
  return (
    <span className={`${className} font-black tracking-widest text-[1.1rem] leading-none`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      TEAM USA
    </span>
  );
}

const trustedBy: { name: string; logo: React.ComponentType<{ className?: string }>; width: string; isSvg?: boolean }[] = [
  { name: "Google", logo: GoogleLogo, width: "w-24", isSvg: true },
  { name: "Apple", logo: AppleLogo, width: "w-7", isSvg: true },
  { name: "Nike", logo: NikeLogo, width: "w-16", isSvg: true },
  { name: "Samsung", logo: SamsungLogo, width: "" },
  { name: "Uber", logo: UberLogo, width: "" },
  { name: "Logitech", logo: LogitechLogo, width: "" },
  { name: "Pringles", logo: PringlesLogo, width: "" },
  { name: "Team USA", logo: TeamUSALogo, width: "" },
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
              <ChatterboxLogo className="h-8 w-8" />
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
                    <ChatterboxLogo className="h-6 w-6" />
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
                className={`${company.width} text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors select-none flex items-center`}
                title={company.name}
              >
                {company.isSvg ? (
                  <company.logo className="w-full h-auto" />
                ) : (
                  <company.logo />
                )}
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
                <ChatterboxLogo className="h-7 w-7" />
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
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-semibold mb-4">Product</p>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "Integrations", "Changelog", "Roadmap"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold mb-4">Company</p>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Press", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-sm font-semibold mb-4">Resources</p>
              <ul className="space-y-2.5">
                {[
                  "Documentation",
                  "API Reference",
                  "Community",
                  "Status",
                  "Support",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
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
