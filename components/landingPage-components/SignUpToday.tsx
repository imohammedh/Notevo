import MaxWContainer from "../ui/MaxWContainer"
import { Button } from "../ui/button"
import Link from "next/link"
export default function SignUpToday() {
  return (
    <section className="w-full py-10 sm:py-14 md:py-16 lg:py-20">
      <MaxWContainer className="flex justify-center items-center flex-col gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl text-center bg-gradient-to-b from-brand_tertiary to-transparent bg-clip-text text-transparent font-semibold leading-relaxed sm:leading-relaxed">
          Ready to Experience the Future of Note-Taking?{" "}
          <br className="hidden sm:block" /> Sign Up Today and Start Your Free Trial
        </h3>
        <Button className="w-full sm:w-auto">
          <Link href="/signin" className="text-sm sm:text-base px-6 sm:px-8 lg:px-10">
            Sign Up
          </Link>
        </Button>
      </MaxWContainer>
    </section>
  )
}
