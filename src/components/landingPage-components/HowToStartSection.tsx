"use client";
import { HowToStartSteps } from "@/src/lib/data";
import { motion } from "framer-motion";
import { useRef } from "react";
import { AnimatedBeam } from "@/src/components/magicui/animated-beam";
import { UserPlus, Link2, Rocket, PlusIcon, PenBoxIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Section from "@/src/components/ui/Section";

interface Step {
  id: string;
  StepNum: string;
  Title: string;
  Body: string;
}

const stepIcons = [UserPlus, PlusIcon, PenBoxIcon];

export default function HowToStartSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <Section sectionId="how-to-start" className="relative">
      <div className="container relative z-10 mx-auto px-4">
        <SectionHeading
          SectionTitle="How To Start"
          SectionSubTitle="Get started with Notevo in just a few simple steps"
        />

        <div ref={containerRef} className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 Desktop:grid-cols-3 gap-8">
            {HowToStartSteps.map((step: Step, index: number) => {
              const Icon = stepIcons[index];
              return (
                <motion.div
                  key={step.id}
                  className="group relative flex flex-col items-center justify-center"
                >
                  <div
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className="z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-lg mb-6 group-hover:border-primary/40 transition-colors"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h3 className=" flex justify-center items-center gap-2 text-xl text-center font-semibold text-foreground">
                      <span>{step.StepNum} .</span>
                      <span>{step.Title}</span>
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {HowToStartSteps.map((_, index) => {
            if (index < HowToStartSteps.length - 1) {
              return (
                <AnimatedBeam
                  key={`beam-${index}`}
                  containerRef={containerRef}
                  fromRef={{ current: nodeRefs.current[index] }}
                  toRef={{ current: nodeRefs.current[index + 1] }}
                  curvature={0}
                  duration={0}
                  gradientStartColor="hsl(var(--primary))"
                  gradientStopColor="hsl(var(--primary))"
                  pathColor="hsl(var(--primary)/0.5)"
                  pathWidth={10}
                  pathOpacity={0.5}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </Section>
  );
}
