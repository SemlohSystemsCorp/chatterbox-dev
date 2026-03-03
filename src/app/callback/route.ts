import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified, onboarding_completed")
          .eq("id", user.id)
          .single();

        // OAuth users are automatically verified
        if (
          user.app_metadata.provider &&
          user.app_metadata.provider !== "email"
        ) {
          await supabase
            .from("profiles")
            .update({
              email_verified: true,
              auth_provider: user.app_metadata.provider,
            })
            .eq("id", user.id);

          if (!profile?.onboarding_completed) {
            return NextResponse.redirect(`${origin}/account/verified`);
          }
        }

        if (profile && !profile.email_verified) {
          return NextResponse.redirect(`${origin}/account/verify`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
