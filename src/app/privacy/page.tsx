import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: March 2026</p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">What we collect</h2>
            <p>
              We collect the minimum information needed to operate the service:
              your email address, username, date of birth, and the content you
              create (messages, server settings, etc.). We also collect basic
              usage data to improve the product.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">How we use your data</h2>
            <p>
              Your data is used to provide and improve Chatterbox. We use your
              email to send verification codes, password resets, and important
              service updates. We do not sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Data storage</h2>
            <p>
              Your data is stored securely using Supabase infrastructure with
              encryption at rest and in transit. We retain your data for as long
              as your account is active.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Third-party services</h2>
            <p>
              We use Supabase for authentication and database, Resend for
              transactional emails, and Stripe for payment processing. Each
              service has its own privacy policy governing how they handle your
              data.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Cookies</h2>
            <p>
              We use essential cookies to manage authentication sessions. We do
              not use tracking cookies or third-party advertising cookies.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Your rights</h2>
            <p>
              You can request a copy of your data, correct inaccuracies, or
              delete your account at any time. To make a request, email us at{" "}
              <a
                href="mailto:privacy@georgesprojects.com"
                className="text-primary underline underline-offset-4"
              >
                privacy@georgesprojects.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Changes</h2>
            <p>
              We may update this policy from time to time. We&apos;ll notify you
              of significant changes via email or an in-app notice.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
