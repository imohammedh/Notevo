import MaxWContainer from "../ui/MaxWContainer";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";
import Section from "../ui/Section";
export default function SignUpToday() {
  return (
    <Section>
      <div className="relative flex flex-col gap-6 h-[250px] w-full items-center justify-center overflow-hidden rounded-xl bg-transparent">
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.1}
          duration={1}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_top,black,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[85%] skew-y-0",
          )}
        />

        <h3 className="text-xl sm:text-2xl md:text-4xl text-center bg-gradient-to-b from-brand_tertiary to-transparent bg-clip-text text-transparent font-semibold leading-relaxed sm:leading-relaxed">
          Ready to Experience the Future of Note-Taking?{" "}
          <br className="hidden sm:block" /> Sign Up Today and Start Your Free
          Trial
        </h3>
        <Button className="w-full sm:w-auto">
          <Link
            href="/signin"
            className="text-sm sm:text-base px-6 sm:px-8 lg:px-10"
          >
            Sign Up
          </Link>
        </Button>
      </div>
    </Section>
  );
}
