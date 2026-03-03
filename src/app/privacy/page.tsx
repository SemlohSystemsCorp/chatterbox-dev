import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PrivacyPage() {
  let content = "";
  try {
    content = await fs.readFile(
      path.join(process.cwd(), "public", "privacy.txt"),
      "utf-8"
    );
  } catch {
    content = "Privacy Policy content not found. Please add a public/privacy.txt file.";
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
          <span className="text-lg font-bold">Chatterbox</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => {
            const trimmed = paragraph.trim();
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
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
