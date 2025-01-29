"use client";
import { SignInMethodDivider } from "@/components/SignInMethodDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import ADiv from "@/components/dashboard-components/ADiv";
import { useState } from "react";
import WelcomeBan from "@/components/ui/WelcomeBan";
import { useToast } from "@/hooks/use-toast";
export default function SignInPage() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");
  return (
    <ADiv className="flex min-h-screen w-full">
      <div className="rounded-xl border border-solid border-brand_tertiary/20 max-w-[450px] flex flex-col container mx-auto my-auto gap-4 pb-8">
        <WelcomeBan Welcome_to="Sign in or create an account"/>
        {step === "signIn" ? (
          <>
            <span className="flex items-center justify-center gap-3 flex-col md:flex-row">
            <SignInWithGitHub />
            <SignInWithGoogle/>
            </span>
            <SignInMethodDivider />
            <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
          </>
        ) : (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Check your email
            </h2>
            <p>A sign-in link has been sent to your email address.</p>
            <Button
              className=" w-full"
              onClick={() => setStep("signIn")}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </ADiv>
  );
}

function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      className="w-full flex-1"
      variant="outline"
      type="button"
      onClick={() => {
        setLoading(true);
        void signIn("github", { redirectTo: "/dashboard" }).finally(() => setLoading(false));
      }}
      disabled={loading}
    >
      {loading ? "GitHub..." : <><GitHubLogoIcon className="mr-2 h-4 w-4" /> GitHub</>}
    </Button>
  );
}

function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      className="w-full flex-1"
      variant="outline"
      type="button"
      onClick={() => {
        setLoading(true);
        void signIn("google", { redirectTo: "/dashboard" }).finally(() => setLoading(false));
      }}
      disabled={loading}
    >
      {loading ? "Google..." : <><FcGoogle className="mr-2 h-4 w-4" /> Google</>}
    </Button>
  );
}

function SignInWithMagicLink({
  handleLinkSent,
}: {
  handleLinkSent: () => void;
}) {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        formData.set("redirectTo", "/dashboard");
        signIn("resend", formData)
          .then(handleLinkSent)
          .catch(() => {
            toast({
            variant:"destructive",
            title: "Invalid Email or Password",
            description: "Example for a valied email : example@mail.com",
            })
          })
          .finally(() => setLoading(false));
      }}
    >
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" disabled={loading} />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send sign-in link"}
      </Button>
    </form>
  );
}
