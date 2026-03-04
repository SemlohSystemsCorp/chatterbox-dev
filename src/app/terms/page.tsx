import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: March 2026</p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Chatterbox, you agree to be bound by these
              Terms of Service. If you do not agree, do not use the service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use Chatterbox. By creating an
              account, you represent that you meet this requirement.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Your Account</h2>
            <p>
              You are responsible for maintaining the security of your account and
              password. Chatterbox cannot and will not be liable for any loss or
              damage resulting from unauthorized access to your account.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Acceptable Use</h2>
            <p>
              You agree not to use Chatterbox to send spam, harass others,
              distribute malware, or violate any applicable laws. We reserve the
              right to suspend or terminate accounts that violate these terms.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Content</h2>
            <p>
              You retain ownership of content you post. By posting content, you
              grant Chatterbox a license to store, display, and transmit that
              content as necessary to operate the service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Service Availability</h2>
            <p>
              We strive for high availability but do not guarantee uninterrupted
              access. We may modify or discontinue features with reasonable notice.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Termination</h2>
            <p>
              You may delete your account at any time. We may suspend or terminate
              your access if you violate these terms.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of
              Chatterbox after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a
                href="mailto:legal@georgesprojects.com"
                className="text-primary underline underline-offset-4"
              >
                legal@georgesprojects.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
