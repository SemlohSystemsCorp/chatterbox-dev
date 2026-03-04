import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabase as any)
      .from("profiles")
      .select("email")
      .eq("username", username.toLowerCase())
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: "No account found with that username" },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: profile.email });
  } catch (err) {
    console.error("Resolve username error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
