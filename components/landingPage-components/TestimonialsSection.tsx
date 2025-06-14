"use client";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Testimonials from "./Testimonials";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-background/50 to-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by users worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our users have to say about their experience with Notevo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background" />
            <Testimonials />
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      </div>
    </section>
  );
} 