import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./otp/ResendOTP";
import { ResendMagicLink } from "./ResendMagicLink";
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub,
    Google,
    ResendMagicLink,
    ResendOTP,
    Password,
    Password({ id: "password-link", verify: Resend }),
  ],
});
