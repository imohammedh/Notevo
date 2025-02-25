"use client";
import { Button } from "../ui/button"
import Link from "next/link"
import MaxWContainer from "../ui/MaxWContainer"
import Image from "next/image"
import heroImg from "../../public/AIChatBot.svg"
import { motion } from "framer-motion";
import { Particles } from "../magicui/particles"; 
export default function HeroSection() { 
  return (
    <section className="min-h-[90vh] md:min-h-[80vh] mt-1 md:mt-20 lg:mt-32 flex justify-center items-center w-full">
        <MaxWContainer className="*:text-center relative px-4 sm:px-6 lg:px-8">
          
          <motion.h1 
            initial={{y: 100 , opacity: 0 }} 
            animate={{ y:0 , opacity:1 }}
            transition={{ ease: "easeInOut",duration:0.3,delay:0.3}}
            className="text-2xl sm:text-4xl lg:text-7xl font-semibold pb-3 lg:pb-5"
            >
            Take Notes to the Next Level with <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-transparent to-brand_tertiary/20 rounded-xl bg-clip-content">
              AI-Powered
            </span> Conversations
          </motion.h1>    
          <motion.p  
            initial={{y: 100 , opacity: 0 }} 
            animate={{ y:0 , opacity:1 }}
            transition={{ ease: "easeInOut",duration:0.5,delay:0.5}}
            className=" text-brand_secondary/70 text-sm sm:text-lg lg:text-xl font-medium lg:font-medium px-2"
            >
            Interact with Your Notes Like Never Before. <br className="hidden sm:block" />
            Organize, Discuss, and Enhance Your Ideas Seamlessly.
          </motion.p>
          <motion.span 
              initial={{y: 100 , opacity: 0 }} 
              animate={{ y:0 , opacity:1 }}
              transition={{ ease: "easeInOut",duration:0.7,delay:0.7}}
              className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 py-6 sm:py-8 lg:py-10"
            >
            <Button className="w-full sm:w-auto">
              <Link href="/signin" className="text-sm sm:text-base font-medium">Get Started for Free</Link>
            </Button>
            <Button className="w-full sm:w-auto" variant="ghost">
              <Link href="/#features" className="text-sm sm:text-base font-medium">Learn More</Link>
            </Button>
          </motion.span>
          <motion.div 
            initial={{y: 90 , opacity: 0 }} 
            animate={{ y:0 , opacity:1 }}
            transition={{ ease: "linear",duration:0.5,delay:0.5}}
            className=" absolute -z-20 bg-gradient-to-t from-brand_fourthary/20 to-brand_tertiary/20 top-5 sm:top-16 h-[20rem] w-full rounded-2xl blur-[10rem]"/>
          <motion.div 
            initial={{y: 90 , opacity: 0 }} 
            animate={{ y:0 , opacity:1 }}
            transition={{ ease: "linear",duration:0.9,delay:0.9}}
            className="w-full p-2 sm:p-4 lg:p-5 rounded-xl  bg-gradient-to-t from-transparent to-brand_tertiary/10 backdrop-blur-xl"
          >
            <Image src={heroImg} alt="hero img" priority quality={100} 
              className="opacity-70"/>
          </motion.div>
          <motion.span 
            initial={{y: 90 , opacity: 0 }} 
            animate={{ y:0 , opacity:1 }}
            transition={{ ease: "linear",duration:1,delay:1}}
            className=" transition-all ease-in-out"
          >
          <Particles
          className="absolute inset-0 -z-20"
          quantity={100}
          ease={80}
          color={"#e5e5e5"}
          refresh
          />
          </motion.span>
        </MaxWContainer>
    </section>
  )
}
