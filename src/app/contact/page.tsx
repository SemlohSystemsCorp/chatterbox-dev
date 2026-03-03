import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
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

        <h1 className="text-3xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-12">
          Have a question, feedback, or just want to say hello? We would love to
          hear from you.
        </p>

        <div className="grid gap-12 sm:grid-cols-3">
          {/* Contact Form */}
          <div className="sm:col-span-2">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <Input id="name" type="text" placeholder="Your name" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="How can we help?"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button type="button" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>

          {/* Office Info Sidebar */}
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-3">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href="mailto:support@chatterbox.com"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      support@chatterbox.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Office</p>
                    <p className="text-sm text-muted-foreground">
                      123 Innovation Drive
                      <br />
                      San Francisco, CA 94105
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Office Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday
                <br />
                9:00 AM - 6:00 PM PST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
