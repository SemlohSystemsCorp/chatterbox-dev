import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@supabase/supabase-js";

// Use service role for inserting verification codes (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { userId, email, fullName } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing userId or email" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const supabase = getAdminClient();

    // Invalidate any existing unused codes for this user
    await supabase
      .from("verification_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("used_at", null);

    // Insert new verification code
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        user_id: userId,
        email,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Failed to insert verification code:", insertError);
      return NextResponse.json(
        { error: "Failed to create verification code" },
        { status: 500 }
      );
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Chatterbox <emails@georgesprojects.com>",
      to: email,
      subject: "Verify your Chatterbox account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background-color:#0f0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
              <!-- Logo -->
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;background:#6366f1;border-radius:12px;padding:12px;">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0ibTMgMjEgMS05YTkgOSAwIDEgMSAxOCAwbC0xIDkiLz48cGF0aCBkPSJNMTIgMTR2LTQiLz48cGF0aCBkPSJtMTIgMTYgLjAxIDAiLz48L3N2Zz4=" alt="Chatterbox" width="24" height="24" />
                </div>
              </div>

              <!-- Card -->
              <div style="background:#1a1a24;border-radius:16px;padding:32px 24px;border:1px solid rgba(255,255,255,0.06);">
                <h1 style="color:#f4f4f5;font-size:20px;font-weight:700;text-align:center;margin:0 0 8px;">
                  Verify your email
                </h1>
                <p style="color:#a1a1aa;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6;">
                  Hey${fullName ? ` ${fullName.split(" ")[0]}` : ""}! Enter this code to verify your Chatterbox account.
                </p>

                <!-- Code -->
                <div style="background:#0f0f14;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                  <span style="font-family:'SF Mono',SFMono-Regular,Consolas,monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#f4f4f5;">
                    ${code}
                  </span>
                </div>

                <p style="color:#71717a;font-size:12px;text-align:center;margin:0;line-height:1.5;">
                  This code expires in 15 minutes.<br>
                  If you didn't create a Chatterbox account, you can safely ignore this email.
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align:center;margin-top:24px;">
                <p style="color:#52525b;font-size:11px;margin:0;">
                  Chatterbox &mdash; Enterprise Communications
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification send error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
