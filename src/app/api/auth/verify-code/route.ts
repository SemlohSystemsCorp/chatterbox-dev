import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { userId, email, code } = await request.json();

    if (!userId || !email || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // Find matching unused code
    const { data: verification, error: fetchError } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("email", email)
      .eq("code", code)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verification) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Mark code as used
    await supabase
      .from("verification_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", verification.id);

    // Mark profile as email verified
    await supabase
      .from("profiles")
      .update({ email_verified: true })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
