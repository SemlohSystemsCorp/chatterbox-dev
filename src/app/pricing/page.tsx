import Link from "next/link";
import {
  Check,
  ArrowRight,
  GraduationCap,
  Heart,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For small teams getting started.",
    features: [
      "Up to 5 servers",
      "100 members per server",
      "10MB file uploads",
      "7-day message history",
      "Basic voice channels",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/user/mo",
    description: "For growing teams that need more.",
    features: [
      "Unlimited servers",
      "Unlimited members",
      "100MB file uploads",
      "Unlimited message history",
      "HD voice & video",
      "Custom server branding",
      "Priority support",
      "Advanced permissions",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$25",
    period: "/user/mo",
    description: "For organizations with advanced needs.",
    features: [
      "Everything in Pro",
      "500MB file uploads",
      "SSO / SAML",
      "Audit logs",
      "Compliance tools",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

const comparisonFeatures = [
  { name: "Servers", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Members per server", free: "100", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "File uploads", free: "10MB", pro: "100MB", enterprise: "500MB" },
  { name: "Message history", free: "7 days", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Voice channels", free: true, pro: true, enterprise: true },
  { name: "Video calls", free: false, pro: true, enterprise: true },
  { name: "Screen sharing", free: false, pro: true, enterprise: true },
  { name: "Custom branding", free: false, pro: true, enterprise: true },
  { name: "Advanced permissions", free: false, pro: true, enterprise: true },
  { name: "Priority support", free: false, pro: true, enterprise: true },
  { name: "SSO / SAML", free: false, pro: false, enterprise: true },
  { name: "Audit logs", free: false, pro: false, enterprise: true },
  { name: "Compliance tools", free: false, pro: false, enterprise: true },
  { name: "Custom integrations", free: false, pro: false, enterprise: true },
  { name: "SLA guarantee", free: false, pro: false, enterprise: true },
  { name: "Dedicated support", free: false, pro: false, enterprise: true },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto h-4 w-4 text-primary" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pb-4 pt-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          Start free, upgrade when you need to. No surprises, no hidden fees.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-xl border p-8 ${
                tier.highlight
                  ? "border-primary bg-card shadow-lg ring-1 ring-primary/20"
                  : "bg-card"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">
            Compare plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-4 text-left text-sm font-medium text-muted-foreground">
                    Feature
                  </th>
                  <th className="pb-4 text-center text-sm font-medium">Free</th>
                  <th className="pb-4 text-center text-sm font-medium text-primary">
                    Pro
                  </th>
                  <th className="pb-4 text-center text-sm font-medium">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f) => (
                  <tr key={f.name} className="border-b last:border-0">
                    <td className="py-3.5 text-sm">{f.name}</td>
                    <td className="py-3.5 text-center">
                      <CellValue value={f.free} />
                    </td>
                    <td className="py-3.5 text-center">
                      <CellValue value={f.pro} />
                    </td>
                    <td className="py-3.5 text-center">
                      <CellValue value={f.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Special discounts
            </h2>
            <p className="mt-3 text-muted-foreground">
              We believe great communication tools should be accessible to
              everyone.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <GraduationCap className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Students & Educators</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Verified students and educators get{" "}
                <strong className="text-foreground">50% off</strong> any paid
                plan. Use your .edu email to qualify.
              </p>
              <Button variant="outline" size="sm" className="mt-5" asChild>
                <Link href="/contact?type=student">Apply for discount</Link>
              </Button>
            </div>
            <div className="rounded-xl border bg-card p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold">Nonprofits</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Registered nonprofits receive{" "}
                <strong className="text-foreground">40% off</strong> all paid
                plans. Reach out to our team to get started.
              </p>
              <Button variant="outline" size="sm" className="mt-5" asChild>
                <Link href="/contact?type=nonprofit">Apply for discount</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "Yes, Pro comes with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards and debit cards through Stripe. Enterprise customers can pay by invoice.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Absolutely. Cancel anytime from your settings — no questions asked. You'll keep access until the end of your billing period.",
              },
              {
                q: "Do you offer volume discounts?",
                a: "Yes, teams with 50+ seats receive automatic volume pricing. Contact our sales team for a custom quote.",
              },
              {
                q: "What happens to my data if I downgrade?",
                a: "Your data is always safe. If you downgrade, older messages beyond the free plan limit become read-only but are never deleted.",
              },
              {
                q: "How does the student discount work?",
                a: "Sign up with your .edu email address and apply through our student verification form. Discount is applied within 24 hours.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Join thousands of teams using Chatterbox. Start free — no credit card
            required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
