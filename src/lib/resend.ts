import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Chatterbox <emails@georgesprojects.com>";

export async function sendVerificationEmail(email: string, code: string) {
  const digits = code.split("");
  const codeBoxes = digits
    .map(
      (d) =>
        `<td style="width: 44px; height: 52px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; vertical-align: middle; font-size: 28px; font-weight: 700; color: #0f172a; font-family: 'SF Mono', SFMono-Regular, Consolas, monospace;">${d}</td>`
    )
    .join('<td style="width: 8px;"></td>');

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your Chatterbox verification code",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 0;">
        <div style="padding: 40px 32px 0;">
          <div style="display: inline-block; width: 32px; height: 32px; background: #0f172a; border-radius: 6px; margin-bottom: 24px;"></div>
          <h1 style="font-size: 20px; font-weight: 600; color: #0f172a; margin: 0 0 8px;">Verify your email</h1>
          <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
            Enter this code in Chatterbox to verify <strong style="color: #0f172a;">${email}</strong>:
          </p>
        </div>
        <div style="padding: 0 32px;">
          <table cellpadding="0" cellspacing="0" style="margin: 0 auto 28px;">
            <tr>${codeBoxes}</tr>
          </table>
          <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 8px;">
            This code expires in <strong style="color: #0f172a;">10 minutes</strong>.
          </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding: 20px 32px;">
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
            If you didn&rsquo;t create a Chatterbox account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your Chatterbox password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Chatterbox</h1>
        <p style="color: #64748b; font-size: 15px; line-height: 1.5; margin-bottom: 24px;">We received a request to reset your password. Click the button below to choose a new one:</p>
        <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Reset Password
        </a>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-top: 32px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendInviteEmail(
  email: string,
  serverName: string,
  inviterName: string,
  inviteLink: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${inviterName} invited you to ${serverName} on Chatterbox`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Chatterbox</h1>
        <p style="color: #64748b; font-size: 15px; line-height: 1.5; margin-bottom: 16px;">
          <strong>${inviterName}</strong> invited you to join <strong>${serverName}</strong>.
        </p>
        <a href="${inviteLink}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Join Server
        </a>
        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-top: 32px;">If you weren't expecting this invitation, you can safely ignore this email.</p>
      </div>
    `,
  });
}
