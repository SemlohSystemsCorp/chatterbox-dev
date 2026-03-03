import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TermsPage() {
  let content = "";
  try {
    content = await fs.readFile(
      path.join(process.cwd(), "public", "terms.txt"),
      "utf-8"
    );
  } catch {
    content = "Terms of Service content not found. Please add a public/terms.txt file.";
  }

  const paragraphs = content.split(/\n\n+/).filter(Boolean);

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
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Chatterbox</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Terms of Service
        </h1>

        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => {
            const trimmed = paragraph.trim();
            // Detect headings (lines that are all uppercase or short standalone lines)
            const isHeading =
              trimmed === trimmed.toUpperCase() && trimmed.length < 120 && !trimmed.includes(".");

            if (isHeading) {
              return (
                <h2
                  key={i}
                  className="text-xl font-semibold mt-8 mb-2"
                >
                  {trimmed}
                </h2>
              );
            }

            return (
              <p
                key={i}
                className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
              >
                {trimmed}
              </p>
            );
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            See also our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
