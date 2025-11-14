"use client";
import { Features } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Organize from "@/public/Organize.svg";
import TalkNote from "@/public/AI-Powered.svg";
import Categorization from "@/public/Activities.svg";
import TextEditor from "@/public/Rich Text Editor.svg";
import Sync from "@/public/sync_note.png";
import Section from "@/components/ui/Section";
import MaxWContainer from "@/components/ui/MaxWContainer";

const featureImages = {
  "AI-Powered": TalkNote,
  "Sync Across Devices": Sync,
  "Rich Text Editor": TextEditor,
  "Smart Organization": Organize,
  "Activity Tracking": Categorization,
};

export default function FeaturesSection() {
  return (
    <Section
      sectionId="features"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-background to-background/50"
    >
      <MaxWContainer className="relative z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Features you'll love
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to take your note-taking to the next level
          </p>
        </motion.div>

        <div className="space-y-24">
          {Features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const image =
              featureImages[feature.title as keyof typeof featureImages];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`flex flex-col ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 md:gap-12 items-center`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-full md:w-1/2"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 from-50% via-secondary/10 to-transparent border-border/20 rounded-2xl" />
                    <div className="relative bg-gradient-to-br from-primary/10 from-50% via-secondary/10 to-transparent border-border/20 rounded-2xl p-2 overflow-hidden">
                      <Image
                        src={image}
                        alt={`${feature.title} demo`}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-full md:w-1/2"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative bg-primary/10 rounded-lg p-3">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </MaxWContainer>
    </Section>
  );
}
