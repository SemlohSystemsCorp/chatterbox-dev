"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individuals and small teams getting started.",
    icon: Zap,
    features: [
      "Up to 3 workspaces",
      "10,000 messages per workspace",
      "5 GB file storage",
      "7-day message history",
      "Basic integrations",
    ],
    buttonLabel: "Current Plan",
    highlighted: false,
    current: true,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo per user",
    description: "For growing teams that need more power and flexibility.",
    icon: Sparkles,
    features: [
      "Unlimited workspaces",
      "Unlimited messages",
      "50 GB file storage",
      "Full message history",
      "Advanced integrations",
      "Custom themes & branding",
      "Priority support",
      "Guest access",
    ],
    buttonLabel: "Upgrade to Pro",
    highlighted: true,
    current: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with advanced security needs.",
    icon: Crown,
    features: [
      "Everything in Pro",
      "SSO & SAML authentication",
      "Advanced admin controls",
      "99.99% uptime SLA",
      "Audit logs & compliance",
      "Dedicated account manager",
      "Custom data retention",
      "On-premise deployment option",
    ],
    buttonLabel: "Contact Sales",
    highlighted: false,
    current: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "What happens when I hit the free plan limits?",
    answer:
      "You'll receive a notification when you're approaching your limits. Once reached, you'll need to upgrade to continue adding workspaces or sending messages beyond the cap.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Annual billing saves you 20% compared to monthly. That brings the Pro plan down to $9.60/mo per user when billed annually.",
  },
  {
    question: "How does per-user pricing work?",
    answer:
      "You're only charged for active members in your workspaces. Guest users and deactivated accounts are not counted toward your billing.",
  },
];

export default function PlanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Plan & Billing</h1>
        <p className="text-muted-foreground mt-1.5">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current plan card */}
      <div className="rounded-xl border border-border/50 bg-card p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg">Free Plan</h2>
                <Badge variant="secondary">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                $0 / month
              </p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 mt-4">
          {["Up to 3 workspaces", "10,000 messages per workspace", "5 GB file storage", "7-day message history"].map(
            (feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                {feature}
              </div>
            )
          )}
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Available Plans
        </h2>
        <div className="grid gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 transition-all ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-lg shadow-primary/[0.04]"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="flex justify-end mb-2">
                    <Badge variant="default">Recommended</Badge>
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        plan.highlighted
                          ? "bg-primary/15"
                          : "bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          plan.highlighted ? "text-primary" : "text-primary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground block">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.current ? "outline" : plan.highlighted ? "default" : "outline"}
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.buttonLabel}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/50 bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/80 transition-colors"
              >
                <span className="font-medium text-sm">{faq.question}</span>
                <span className="text-muted-foreground text-sm ml-4 shrink-0">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
