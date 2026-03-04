import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateUsername } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const { username, dateOfBirth } = await req.json();

    if (!username || !dateOfBirth) {
      return NextResponse.json(
        { error: "Username and date of birth are required" },
        { status: 400 }
      );
    }

    const usernameResult = validateUsername(username);
    if (!usernameResult.valid) {
      return NextResponse.json(
        { error: usernameResult.error },
        { status: 400 }
      );
    }

    // Validate age (must be 13+)
    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 13) {
      return NextResponse.json(
        { error: "You must be at least 13 years old" },
        { status: 400 }
      );
    }

    // Get current user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = admin as any;

    // Check if username is taken
    const { data: existingUsername } = await db
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .single();

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Update profile with username and DOB
    const { error: updateError } = await db
      .from("profiles")
      .update({
        username,
        display_name: username,
        date_of_birth: dateOfBirth,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Update user metadata
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { username },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
