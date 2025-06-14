"use client";
import { testimonials1, testimonials2 } from "@/lib/data";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import MaxWContainer from "../ui/MaxWContainer";
import Section from "../ui/Section";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export default function Testimonials() {
  return (
    <div className="relative h-[20rem] rounded-lg flex flex-col antialiased bg-transparent items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full"
      >
        <InfiniteMovingCards
          items={[...testimonials1] as Testimonial[]}
          direction="right"
          speed="fast"
          className="mb-8"
        />
        <InfiniteMovingCards
          items={[...testimonials2] as Testimonial[]}
          direction="left"
          speed="fast"
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}
