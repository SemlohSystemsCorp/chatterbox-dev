"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ArrowRight,
  ChevronDown,
  Hash,
  Video,
  Shield,
  Zap,
  Users,
  Lock,
  BookOpen,
  FileText,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isLoggedIn?: boolean;
}

const productLinks = [
  {
    icon: Hash,
    title: "Channels",
    description: "Organized text, voice, and forum channels",
    href: "/#features",
  },
  {
    icon: Video,
    title: "Voice & Video",
    description: "Crystal-clear calls and screen sharing",
    href: "/#features",
  },
  {
    icon: Shield,
    title: "Permissions",
    description: "Fine-grained role-based access control",
    href: "/#features",
  },
  {
    icon: Zap,
    title: "Real-Time",
    description: "Instant messages, reactions, and presence",
    href: "/#features",
  },
  {
    icon: Users,
    title: "Servers",
    description: "Dedicated spaces for every team",
    href: "/#features",
  },
  {
    icon: Lock,
    title: "Security",
    description: "SSO, audit logs, and compliance tools",
    href: "/#features",
  },
];

const resourceLinks = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Guides and API reference",
    href: "/docs",
  },
  {
    icon: FileText,
    title: "Changelog",
    description: "Latest updates and releases",
    href: "/changelog",
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "FAQs and support articles",
    href: "/help",
  },
];

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [productOpen, setProductOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Chatterbox</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Product dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Product
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${productOpen ? "rotate-180" : ""}`} />
            </button>
            {productOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                <div className="w-[520px] rounded-xl border bg-card p-4 shadow-lg">
                  <div className="grid grid-cols-2 gap-1">
                    {productLinks.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <link.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{link.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {link.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>

          {/* Resources dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Resources
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
            </button>
            {resourcesOpen && (
              <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                <div className="w-[280px] rounded-xl border bg-card p-2 shadow-lg">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                    >
                      <link.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{link.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {link.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <Button size="sm" asChild>
              <Link href="/app">
                Open Chatterbox
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </div>
            {productLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <Link
              href="/pricing"
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </div>
            {resourceLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            ))}
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <div className="my-2 h-px bg-border" />
            <div className="flex flex-col gap-2 pt-2">
              {isLoggedIn ? (
                <Button asChild>
                  <Link href="/app">Open Chatterbox</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
