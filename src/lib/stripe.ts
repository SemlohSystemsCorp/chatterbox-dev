import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "For small teams getting started",
    price: 0,
    features: [
      "Up to 5 servers",
      "100 members per server",
      "10MB file uploads",
      "7-day message history",
      "Basic voice channels",
    ],
  },
  pro: {
    name: "Pro",
    description: "For growing teams that need more",
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    price: 9.99,
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
  },
  enterprise: {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: 24.99,
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
  },
} as const;
