"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { toast } from "sonner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Message sent! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Get in touch</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a question, want to partner, or just want to say hello?
              We&apos;d love to hear from you.
            </p>

            <div className="mt-12 space-y-6">
              <div>
                <h3 className="text-sm font-semibold">General inquiries</h3>
                <a
                  href="mailto:hello@georgesprojects.com"
                  className="mt-1 block text-sm text-primary underline underline-offset-4"
                >
                  hello@georgesprojects.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Sales</h3>
                <a
                  href="mailto:sales@georgesprojects.com"
                  className="mt-1 block text-sm text-primary underline underline-offset-4"
                >
                  sales@georgesprojects.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Support</h3>
                <a
                  href="mailto:support@georgesprojects.com"
                  className="mt-1 block text-sm text-primary underline underline-offset-4"
                >
                  support@georgesprojects.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Press</h3>
                <a
                  href="mailto:press@georgesprojects.com"
                  className="mt-1 block text-sm text-primary underline underline-offset-4"
                >
                  press@georgesprojects.com
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-8">
            <h2 className="text-lg font-semibold">Send us a message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Subject</label>
                <Input
                  name="subject"
                  placeholder="How can we help?"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us more..."
                  required
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
