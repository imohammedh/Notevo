import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./otp/ResendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub,
    Google,
    Resend({
      from: process.env.AUTH_EMAIL ?? "Notevo <onboarding@notevo.me>",
    }),
    ResendOTP,
    Password,
    Password({ id: "password-link", verify: Resend }),
  ],
});
