import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Look up the code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: stored, error: lookupError } = await (supabase as any)
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (lookupError || !stored) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Check expiry
    if (new Date(stored.expires_at) < new Date()) {
      return NextResponse.json({ error: "Code has expired" }, { status: 400 });
    }

    // Delete used code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("verification_codes").delete().eq("email", email);

    // Generate a session for the user
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (linkError || !linkData) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // Return the token_hash so the client can exchange it for a session
    const url = new URL(linkData.properties.action_link);
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");

    return NextResponse.json({ tokenHash, type });
  } catch (err) {
    console.error("Verify code error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
