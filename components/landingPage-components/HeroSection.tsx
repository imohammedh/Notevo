"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import MaxWContainer from "../ui/MaxWContainer";
import Image from "next/image";
import heroImg from "../../public/AIChatBot.svg";
import { motion } from "framer-motion";
export default function HeroSection() {
  return (
    <section className="min-h-[85vh] lg:min-h-[80vh] mt-1 lg:mt-20 flex justify-center items-center w-full">
      <motion.div
        className=" mx-2 lg:mx-10 py-10 w-full bg-gradient-to-b from-brand_fourthary via-purple-900/10 to-transparent rounded-xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.3, delay: 0.3 }}
      >
        <MaxWContainer className="*:text-center relative px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.5 }}
            className="text-2xl sm:text-4xl lg:text-7xl font-semibold pb-3 lg:pb-5"
          >
            Take Notes to the Next Level with <br className="hidden sm:block" />
            <span className="bg-gradient-to-l from-purple-900 from-15% to-purple-600 text-transparent bg-clip-text font-extrabold">
              AI-Powered
            </span>{" "}
            Conversations
          </motion.h1>
          <motion.p
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.6, delay: 0.6 }}
            className=" text-brand_secondary/70 text-sm sm:text-lg lg:text-xl font-medium lg:font-medium px-2"
          >
            Interact with Your Notes Like Never Before.{" "}
            <br className="hidden sm:block" />
            Organize, Discuss, and Enhance Your Ideas Seamlessly.
          </motion.p>
          <motion.span
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.7, delay: 0.7 }}
            className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 py-6 sm:py-8 lg:py-10"
          >
            <Button className="w-full sm:w-auto">
              <Link href="/signin" className="text-sm sm:text-base font-medium">
                Get Started for Free
              </Link>
            </Button>
            <Button className="w-full sm:w-auto" variant="ghost">
              <Link
                href="/#features"
                className="text-sm sm:text-base font-medium"
              >
                Learn More
              </Link>
            </Button>
          </motion.span>
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "linear", duration: 0.9, delay: 0.9 }}
            className="w-full p-2 sm:p-4 lg:p-5 rounded-xl  bg-gradient-to-t from-transparent to-brand_tertiary/5 backdrop-blur-xl"
          >
            <Image
              src={heroImg}
              alt="hero img"
              priority
              quality={100}
              className="opacity-70"
            />
          </motion.div>
        </MaxWContainer>
      </motion.div>
    </section>
  );
}
