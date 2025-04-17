"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import MaxWContainer from "../ui/MaxWContainer";
import Image from "next/image";
import heroImg from "../../public/AIChatBot.svg";
import { motion } from "framer-motion";
export default function HeroSection() {
  return (
    <section className="min-h-[85vh] lg:min-h-[80vh] mt-1 lg:mt-32 flex justify-center items-center w-full">
      <MaxWContainer className="flex flex-col items-center justify-center *:text-center relative px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.4, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 text-red-400 text-xs font-mono font-medium mb-6 border border-red-400/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          Bug • Fixing the AI API
        </motion.div>
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.5, delay: 0.5 }}
          className="text-2xl sm:text-4xl lg:text-7xl pb-3 lg:pb-5 bg-gradient-to-b from-brand_secondary to-transparent bg-clip-text text-transparent font-semibold"
        >
          Simple, Structured Note-Taking. <br className="hidden sm:block" />
          <span className="bg-gradient-to-l from-purple-900 from-15% to-purple-600 text-transparent bg-clip-text font-extrabold">
            Supercharged
          </span>{" "}
          by AI
        </motion.h1>
        <motion.p
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.6, delay: 0.6 }}
          className=" text-brand_secondary/70 text-sm sm:text-lg lg:text-xl font-medium lg:font-medium px-2"
        >
          Notevo helps you capture your thoughts, organize them effortlessly{" "}
          <br className="hidden sm:block" />
          and interact with your notes using powerful AI tools - all in one
          clean, modern interface.
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
          transition={{ ease: "linear", duration: 0.8, delay: 0.8 }}
          className=" absolute -z-20 bg-gradient-to-t from-purple-900/50 from-15% to-brand_fourthary left-0 top-5 sm:top-16 h-[20rem] w-full rounded-xl blur-[6rem]"
        />
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "linear", duration: 0.9, delay: 0.9 }}
          className="w-full p-2 sm:p-4 lg:p-5 rounded-xl bg-gradient-to-t from-transparent to-brand_tertiary/5 backdrop-blur-xl"
        >
          <Image
            src={heroImg}
            alt="hero img"
            priority
            quality={100}
            className="opacity-70 mask-image-gradient"
          />
        </motion.div>
      </MaxWContainer>
    </section>
  );
}
