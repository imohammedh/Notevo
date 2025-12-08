// convex/ResendMagicLink.ts
import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
export const ResendMagicLink = Resend({
  id: "resend",
  apiKey: process.env.AUTH_RESEND_KEY,
  async sendVerificationRequest({ identifier: email, provider, url }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL ?? "Notevo <onboarding@notevo.me>",
      to: [email],
      replyTo: "support@notevo.me",
      subject: "Sign in to Notevo",
      html: `
      <html>
  <body style="font-family: system-ui; background:#fafafa; padding:24px; margin: 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; auto;">
      <tr>
        <td style="text-align:left; padding-bottom:3px;">
          <!-- Logo aligned left -->
          <img
            src="https://notevo.me/favicon.png"
            alt="Notevo Logo"
            width="50"
            style="display:inline-block;"
          />
        </td>
      </tr>

      <tr>
        <td>
          <h1 style="margin-bottom:10px;">Welcome to Notevo</h1>
          <p>Click the button below to sign in :</p>
          <p>
            <a href="${url}"
               style="display:inline-block; background:#000; color:#fff;
                      padding:10px 18px; border-radius:4px;
                      text-decoration:none;">
              Sign in
            </a>
          </p>

          <hr style="margin:24px 0; border:none; border-top:1px solid #e5e5e5;" />

          <p style="font-size:12px; color:#666; line-height:1.5;">
            By continuing, you agree to our
            <a href="https://notevo.me/terms-of-service" style="color:#2563eb;">Notevo Terms of Service</a>
            and
            <a href="https://notevo.me/privacy-policy" style="color:#2563eb;">Notevo Privacy Policy</a>.
          </p>

          <p style="margin-top:8px; font-size:12px; color:#666;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <p style="margin-top:8px; font-size:10px; color:#666;">
            Copyright © 2025-2026 Notevo. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
