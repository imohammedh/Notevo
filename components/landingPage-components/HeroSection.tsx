"use client";
import { Button } from "../ui/button"
import Link from "next/link"
import MaxWContainer from "../ui/MaxWContainer"
import Image from "next/image"
import heroImg from "../../public/UserDashboard-Note.svg"
import { motion } from "framer-motion";
export default function HeroSection() {
  return (
    <motion.section
        initial={{y:90,opacity:0}}
        whileInView={{y:0,opacity:1}}
        transition={{ease:"easeInOut",duration:0.7,delay:0.2}}
        viewport={{ once: true, amount: 0.5 }}
        className="min-h-[90vh] md:min-h-[80vh] mt-16 md:mt-24 lg:mt-44 flex justify-center items-center w-full">
        <MaxWContainer className="*:text-center relative px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-semibold pb-3 lg:pb-5">
            Take Notes to the Next Level with <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-transparent to-brand_tertiary/20 rounded-xl bg-clip-content">
              AI-Powered
            </span> Conversations
          </h1>
          
          <p className=" text-brand_secondary/70 text-sm sm:text-lg lg:text-xl font-medium lg:font-medium px-2">
            Interact with Your Notes Like Never Before. <br className="hidden sm:block" />
            Organize, Discuss, and Enhance Your Ideas Seamlessly.
          </p>
          <span className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 py-6 sm:py-8 lg:py-10">
            <Button className="w-full sm:w-auto">
              <Link href="/signin" className="text-sm sm:text-base font-medium">Get Started for Free</Link>
            </Button>
            <Button className="w-full sm:w-auto" variant="ghost">
              <Link href="/#features" className="text-sm sm:text-base font-medium">Learn More</Link>
            </Button>
          </span>

          <span className="relative w-full">
            <Image src={heroImg} alt="hero img" priority quality={100} 
              className="w-full p-2 sm:p-4 lg:p-5 rounded-xl bg-brand_tertiary/10 backdrop-blur-xl"/>
          </span>
        </MaxWContainer>
    </motion.section>
  )
}
