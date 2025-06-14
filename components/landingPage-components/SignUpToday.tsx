"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Section from "../ui/Section";
import MaxWContainer from "../ui/MaxWContainer";

export default function SignUpToday() {
  return (
    <Section className="relative overflow-hidden">
      <MaxWContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center justify-center gap-8 py-16 px-6 rounded-2xl border border-border/20 bg-background/50 backdrop-blur-sm"
        >
          <div className="text-center space-y-4 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Ready to Experience the Future of Note-Taking?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start your journey today and experience the power of AI-powered note-taking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup" className="text-base font-medium">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/#pricing" className="text-base font-medium">
                View Pricing
              </Link>
            </Button>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
          </div>
        </motion.div>
      </MaxWContainer>
    </Section>
  );
}
