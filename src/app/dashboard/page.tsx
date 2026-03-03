import Link from "next/link";
import { MessageSquare, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Welcome to Chatterbox
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          You&apos;re all set! Create your first workspace to start
          collaborating with your team.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              <Plus className="mr-2 h-4 w-4" />
              Create a Workspace
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">
              Join a Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
