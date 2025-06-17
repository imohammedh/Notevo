"use client";
import { SignInMethodDivider } from "@/components/SignInMethodDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ImgSrc from "@/public/AIChatBotLogin.svg";
import ImgSrcNotevoLogo from "@/public/Notevo-logo.svg";

export default function SignInPage() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-background via-transparent to-background/90 p-6 md:p-10 overflow-hidden">

      <div className="w-full relative max-w-sm md:max-w-3xl">
      {/* Glow effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute top-0 -left-4 h-72 w-72 animate-blob rounded-full bg-primary/30 blur-2xl filter" />
        <div className="absolute top-0 -right-4 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-secondary/30 blur-2xl filter" />
        <div className="absolute -bottom-8 left-20 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-accent/30 blur-2xl filter" />
      </div>
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden bg-background/60 backdrop-blur-md border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center mb-2 text-center">
                    <Image
                      src={ImgSrcNotevoLogo}
                      alt="log Image"
                      width={45}
                      height={45}
                      className="mb-3 hover:scale-110 transition-transform duration-200 sm:block md:hidden lg:hidden"
                    />
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login or create an account
                    </p>
                  </div>
                  {step === "signIn" ? (
                    <>
                      <SignInWithMagicLink
                        handleLinkSent={() => setStep("linkSent")}
                      />
                      <span className="relative z-10 px-2 text-muted-foreground">
                        Or continue with
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        <SignInWithGitHub />
                        <SignInWithGoogle />
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-2xl tracking-tight text-foreground">
                        Check your email
                      </h2>
                      <p className="text-muted-foreground">A sign-in link has been sent to your email address.</p>
                      <Button
                        className="w-full hover:scale-105 transition-transform duration-200"
                        onClick={() => setStep("signIn")}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="relative hidden bg-card/70 backdrop-blur-md md:block">
                <Image
                  src={ImgSrc}
                  alt="login Image"
                  className="absolute blur-sm opacity-30 inset-0 h-full w-full object-cover"
                />
                <Image
                  src={ImgSrcNotevoLogo}
                  alt="log Image"
                  width={75}
                  height={75}
                  className="absolute top-2/4 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 object-cover hover:scale-110 transition-transform duration-200"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-foreground">
            By signing up and continue, you agree to our{" "}
            <Link href="/terms-of-service">Terms of Service</Link> and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="w-full flex-1 hover:scale-105 transition-transform duration-200"
      variant="outline"
      type="button"
      onClick={() => {
        setLoading(true);
        void signIn("github", { redirectTo: "/dashboard" }).finally(() =>
          setLoading(false),
        );
      }}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoadingAnimation className="mx-2 w-4 h-4" /> GitHub...
        </>
      ) : (
        <>
          <GitHubLogoIcon className="mr-2 h-4 w-4" /> GitHub
        </>
      )}
    </Button>
  );
}

function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="w-full flex-1 hover:scale-105 transition-transform duration-200"
      variant="outline"
      type="button"
      onClick={() => {
        setLoading(true);
        void signIn("google", { redirectTo: "/dashboard" }).finally(() =>
          setLoading(false),
        );
      }}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoadingAnimation className="mx-2 w-4 h-4" /> Google...
        </>
      ) : (
        <>
          <FcGoogle className="mr-2 h-4 w-4" /> Google
        </>
      )}
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
  const { toast } = useToast();

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
              variant: "destructive",
              title: "Invalid Email or Password",
              description: "Example for a valied email : example@mail.com",
            });
          })
          .finally(() => setLoading(false));
      }}
    >
      <label htmlFor="email" className="text-foreground">Email</label>
      <Input
        name="email"
        id="email"
        className="mb-4"
        autoComplete="email"
        disabled={loading}
      />
      <Button type="submit" disabled={loading} className="hover:scale-105 transition-transform duration-200">
        {loading ? (
          <>
            <LoadingAnimation className="mx-2 w-4 h-4" /> Sending...
          </>
        ) : (
          "Send sign-in link"
        )}
      </Button>
    </form>
  );
}
