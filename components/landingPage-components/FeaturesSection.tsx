"use client";
import { Features } from "@/lib/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Organize from "@/public/Organize.svg";
import TalkNote from "@/public/AI-Powered.svg";
import Categorization from "@/public/Activities.svg";
import TextEditor from "@/public/Rich Text Editor.svg";
import Sync from "@/public/sync_note.png";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const featureImages = {
  "AI-Powered": TalkNote,
  "Sync Across Devices": Sync,
  "Rich Text Editor": TextEditor,
  "Smart Organization": Organize,
  "Activity Tracking": Categorization,
};

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section id="features" className="relative py-24 overflow-hidden">
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
              Features you'll love
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to take your note-taking to the next level
          </p>
        </motion.div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
          onMouseMove={handleMouseMove}
        >
          {Features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
              onMouseEnter={() => setHoveredFeature(feature.title)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl" />
              <div className="relative bg-background/50 backdrop-blur-xl border border-border/20 rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg" />
                    <div className="relative bg-primary/10 rounded-lg p-3">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Floating Feature Image */}
          {hoveredFeature &&
            featureImages[hoveredFeature as keyof typeof featureImages] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="fixed pointer-events-none z-50"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl" />
                  <div className="relative bg-background/50 backdrop-blur-xl border border-border/20 rounded-2xl p-4">
                    <Image
                      src={
                        featureImages[
                          hoveredFeature as keyof typeof featureImages
                        ]
                      }
                      alt={`${hoveredFeature} demo`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              </motion.div>
            )}
        </div>
      </div>
    </section>
  );
}
