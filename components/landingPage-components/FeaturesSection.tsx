"use client";
import { Features } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import MaxWContainer from "@/components/ui/MaxWContainer";
import SectionHeading from "./SectionHeading";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Section from "../ui/Section";
import { StaticImageData } from "next/image";
import NotevoLightNotePic from "@/public/NotevoLightNotePic.svg";
import NotevoDarkNotePic from "@/public/NotevoDarkNotePic.svg";
import NotevoLightWorkingspacePagePic from "@/public/NotevoLightWorkingspacePagePic.svg";
import NotevoDarkWorkingspacePagePic from "@/public/NotevoDarkWorkingspacePagePic.svg";
export default function FeaturesSection() {
  const { resolvedTheme } = useTheme();
  const [featureImages, setFeatureImages] = useState<
    Record<string, StaticImageData>
  >({
    "Rich Text Editor": NotevoDarkNotePic,
    "Simple Organization": NotevoDarkWorkingspacePagePic,
  });
  useEffect(() => {
    if (resolvedTheme === "light") {
      setFeatureImages({
        "Rich Text Editor": NotevoLightNotePic,
        "Simple Organization": NotevoLightWorkingspacePagePic,
      });
    } else {
      setFeatureImages({
        "Rich Text Editor": NotevoDarkNotePic,
        "Simple Organization": NotevoDarkWorkingspacePagePic,
      });
    }
  }, [resolvedTheme]);
  return (
    <Section sectionId="features" className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none z-[-5] overflow-hidden">
        {/* 3. Mirrored arrow - left side - drawn a bit later */}
        <svg
          className="absolute -left-8 top-[30%] w-32 h-24 text-primary/50 -rotate-[8deg]"
          viewBox="0 0 140 100"
        >
          <path
            d="M129 60 Q120 90,110 65 T20 95 "
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="absolute -right-8 top-[50%] w-32 h-24 text-primary/20 rotate-[8deg]"
          viewBox="0 0 140 100"
        >
          <path
            d="M20 70 Q50 40,90 65 T120 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <MaxWContainer className="relative z-10 ">
        <SectionHeading
          SectionTitle="Features you'll love"
          SectionSubTitle="Everything you need to take your note-taking to the next level"
        />

        <div className="space-y-24">
          {Features.map((feature, index) => {
            const isEven = index % 2 === 0;
            const image = featureImages[feature.title];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`flex flex-col ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 md:gap-12 items-center`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-full md:w-2/3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 from-50% to-transparent border-border rounded-lg" />
                    <div className="relative bg-gradient-to-br from-primary/10 from-50%  to-transparent border-border rounded-lg p-1 Desktop:p-2 overflow-hidden">
                      <Image
                        src={image}
                        alt={`${feature.title} demo`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
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
