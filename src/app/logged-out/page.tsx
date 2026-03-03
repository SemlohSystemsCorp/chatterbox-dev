import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoggedOutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          You&apos;ve been logged out
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Thanks for using Chatterbox. See you next time.
        </p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Button asChild>
            <Link href="/login">
              Sign back in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
