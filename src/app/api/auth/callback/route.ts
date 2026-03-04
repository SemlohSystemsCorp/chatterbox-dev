import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "magiclink"
    | "email"
    | "recovery"
    | null;
  const next = searchParams.get("next") ?? "/app";

  const supabase = await createClient();

  // OAuth code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this user has a profile yet (new OAuth users won't)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // Create profile for new OAuth user
          const derivedUsername =
            user.user_metadata?.preferred_username ||
            user.user_metadata?.user_name ||
            user.email?.split("@")[0]?.replace(/[^a-z0-9._-]/g, "") ||
            `user-${user.id.slice(0, 8)}`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from("profiles").insert({
            id: user.id,
            email: user.email,
            display_name: derivedUsername,
            username: derivedUsername,
            avatar_url: user.user_metadata?.avatar_url || null,
          });
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Token hash exchange (magic link, recovery, etc.)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
