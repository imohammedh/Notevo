"use client";
import { HowToStartSteps } from "@/lib/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  StepNum: string;
  Title: string;
  Body: string;
}

export default function HowToStartSection() {
  return (
    <section id="how-to-start" className="relative py-24 overflow-hidden">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              How To Start
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with Notevo in just a few simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {HowToStartSteps.map((step: Step, index: number) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-background/50 backdrop-blur-xl border border-border/20 rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500" />
                    <div className="relative bg-primary/10 rounded-full p-4">
                      <span className="text-xl font-semibold text-primary">
                        {step.StepNum}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.Title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.Body}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}