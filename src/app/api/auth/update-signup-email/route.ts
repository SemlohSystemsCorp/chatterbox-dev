import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { oldEmail, newEmail } = await req.json();

    if (!oldEmail || !newEmail) {
      return NextResponse.json(
        { error: "Both emails are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Check if new email is already taken
    const { data: existingEmail } = await db
      .from("profiles")
      .select("id")
      .eq("email", newEmail)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Find the user by old email
    const { data: profile } = await db
      .from("profiles")
      .select("id")
      .eq("email", oldEmail)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Update email in auth
    const { error: authError } = await supabase.auth.admin.updateUserById(
      profile.id,
      { email: newEmail }
    );

    if (authError) {
      console.error("Auth update error:", authError);
      return NextResponse.json(
        { error: "Failed to update email" },
        { status: 500 }
      );
    }

    // Update email in profile
    await db
      .from("profiles")
      .update({ email: newEmail })
      .eq("id", profile.id);

    // Generate and send new verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete old code and insert new one
    await db.from("verification_codes").delete().eq("email", oldEmail);
    await db
      .from("verification_codes")
      .upsert({ email: newEmail, code, expires_at: expiresAt }, { onConflict: "email" });

    await sendVerificationEmail(newEmail, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update signup email error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
