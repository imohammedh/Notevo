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
  <body style="font-family: system-ui; background:#fafafa; padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; margin:0 auto;">
      <tr>
        <td style="text-align:left; padding-bottom:5px;">
          <!-- Logo aligned left -->
          <img
            src="https://uncommon-toad-675.convex.cloud/api/storage/123fdf3c-b912-4321-8200-b44b5df4aacd"
            alt="Notevo Logo"
            width="70"
            style="display:inline-block;"
          />
        </td>
      </tr>

      <tr>
        <td>
          <h1 style="margin-bottom:16px;">Welcome to Notevo</h1>
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

          <p style="margin-top:12px; font-size:12px; color:#666;">
            If you didn't request this, you can safely ignore this email.
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
