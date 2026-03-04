import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">About Chatterbox</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We&apos;re building the team communication platform we always wanted.
        </p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Our mission</h2>
            <p>
              Chatterbox exists to give teams a professional, powerful, and
              enjoyable place to communicate. We took the best ideas from
              platforms like Discord and Slack and rebuilt them from scratch with
              a focus on clarity, speed, and simplicity.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Why we built this</h2>
            <p>
              Most team chat tools are either too casual or too corporate. We
              wanted something in between — a platform with real-time channels,
              voice, and video that feels polished without being bloated. No
              unnecessary features, no confusing pricing, no clutter.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">The team</h2>
            <p>
              Chatterbox is built by a small team of engineers and designers who
              care deeply about great software. We&apos;re independent,
              self-funded, and focused on building the best product we can.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Open to feedback</h2>
            <p>
              We&apos;re still early and actively building. If you have ideas,
              feedback, or just want to say hi, reach out at{" "}
              <a
                href="mailto:hello@georgesprojects.com"
                className="text-primary underline underline-offset-4"
              >
                hello@georgesprojects.com
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
