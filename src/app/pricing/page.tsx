import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams just getting started.",
    features: [
      "Up to 10 team members",
      "5 channels",
      "1 GB file storage",
      "7-day message history",
      "Basic integrations",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/user/mo",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "Unlimited team members",
      "Unlimited channels",
      "20 GB file storage per user",
      "Unlimited message history",
      "Advanced integrations",
      "Screen sharing & video calls",
      "Priority support",
      "Custom workflows",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with advanced security needs.",
    features: [
      "Everything in Pro",
      "SSO & SAML authentication",
      "Advanced compliance tools",
      "Dedicated account manager",
      "99.99% uptime SLA",
      "Custom data retention",
      "On-premise deployment option",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you will be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Absolutely. Every Pro plan comes with a 14-day free trial, no credit card required. You will have full access to all Pro features during the trial period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. Enterprise customers can also pay via invoice with net-30 terms.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data remains accessible for 30 days after cancellation. You can export all your messages, files, and channel history during that window. After 30 days, data is permanently deleted.",
  },
  {
    question: "Do you offer discounts for nonprofits or education?",
    answer:
      "Yes! We offer 50% off Pro plans for registered nonprofits and educational institutions. Contact our sales team to apply for the discount.",
  },
];

export default function PricingPage() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground mb-12">
          No hidden fees. No surprises. Pick the plan that fits your team.
        </p>

        {/* Pricing Tiers */}
        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg border p-6 flex flex-col ${
                tier.highlighted
                  ? "border-primary border-2 relative"
                  : "border-border"
              }`}
            >
              {tier.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {tier.description}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={tier.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href="/signup">{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
