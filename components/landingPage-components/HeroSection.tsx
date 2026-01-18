"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect } from "react";
import BrowserMockup from "./BrowserMockup";
import MaxWContainer from "../ui/MaxWContainer";
import { useMediaQuery } from "react-responsive";
import { usePaginatedQuery } from "convex/react";
import NotevoDarkHomePage from "@/public/NotevoDarkHomePagePic.svg";
import NotevoLightHomePage from "@/public/NotevoLightHomePagePic.svg";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function HeroSection() {
  const { results, status } = usePaginatedQuery(
    api.users.users,
    {},
    { initialNumItems: 5 },
  );
  const [showBackground, setShowBackground] = useState(false);
  const { scrollY } = useScroll();
  const [inView, setInView] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTabletAir_horizontal = useMediaQuery({ maxWidth: 1180 });
  const isTabletPro_horizontal = useMediaQuery({ maxWidth: 1366 });
  const { resolvedTheme } = useTheme();
  const [homeImage, setHomeImage] = useState<string>(
    "/NotevoLightHomePagePic.svg",
  );
  useEffect(() => {
    if (resolvedTheme === "dark") {
      setHomeImage(NotevoDarkHomePage);
    } else {
      setHomeImage(NotevoLightHomePage);
    }
  }, [resolvedTheme]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackground(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 90) {
      setInView(true);
    } else {
      setInView(false);
    }
  });
  return (
    <section
      id="home"
      className="relative pb-12 pt-28 Desktop:pt-32 flex items-center justify-center overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/30 from-5% via-primary/10 via-30% to-transparent to-50% -z-[900]"
        initial={{ opacity: 0, margin: 0, borderRadius: 0 }}
        animate={{
          opacity: showBackground ? 1 : 0,
        }}
        transition={{
          opacity: { duration: showBackground ? 0.8 : 0 },
          delay: 0,
          ease: "easeInOut",
        }}
      />

      {/* Hand-drawn doodles with real drawing animation */}
      <div className="absolute inset-0 pointer-events-none select-none z-[-5] overflow-hidden">
        {/* 1. Loose scribble circle - top left - being drawn */}
        <motion.svg
          className="absolute -top-16 -left-20 w-40 h-40 md:w-48 md:h-48 text-primary/70"
          viewBox="0 0 120 120"
          initial={{ opacity: 0 }}
          animate={showBackground ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.path
            d="M30 60 Q15 35,50 25 Q85 15,95 50 Q105 75,80 90 Q55 105,30 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              showBackground
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: { duration: 0.5, ease: "easeOut", delay: 0.1 },
              opacity: { duration: 0.4 },
            }}
          />
        </motion.svg>

        {/* 2. Small messy arrow - right side - drawn with delay */}
        <motion.svg
          className="absolute -right-8 top-[50%] w-32 h-24 text-primary/10 rotate-[12deg]"
          viewBox="0 0 140 100"
          initial={{ opacity: 0 }}
          animate={showBackground ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.path
            d="M20 70 Q50 40,90 65 T120 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={showBackground ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.2, delay: 0.3, ease: "easeOut" }}
          />
        </motion.svg>

        {/* 3. Mirrored arrow - left side - drawn a bit later */}
        <motion.svg
          className="absolute -left-8 top-[30%] w-32 h-24 text-primary/20 -rotate-[8deg]"
          viewBox="0 0 140 100"
          initial={{ opacity: 0 }}
          animate={showBackground ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.path
            d="M120 70 Q90 40,50 65 T20 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={showBackground ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          />
        </motion.svg>
      </div>

      <MaxWContainer className=" relative flex flex-col items-center justify-center space-y-5">
        {/* Centered Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center "
        >
          <motion.h1
            className="bg-gradient-to-r from-primary from-70% to-primary/10 bg-clip-text text-transparent text-5xl md:text-6xl Desktop:text-[90px] font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span>Simple, Structured</span>
            <br />
            <motion.span
              className="relative inline-block px-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-primary from-70% to-primary/10 bg-clip-text">
                Note-Taking
              </span>
              {/* Hand-drawn pen underline */}
              <motion.svg
                viewBox="0 0 300 40"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-4 w-full h-8"
              >
                <motion.path
                  d="
        M 5 25
        Q 40 22, 80 26
        T 150 24
        T 220 26
        T 295 24
      "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary/90"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    showBackground
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                />
              </motion.svg>
            </motion.span>
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Notevo helps you capture your thoughts and organize them
            effortlessly in one clean, modern interface.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="relative group overflow-hidden"
            >
              <Link prefetch={true} href="/signup">
                <span className="relative z-10">Get Started for Free</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="relative group"
            >
              <Link prefetch={true} href="#features">
                <span className="relative z-10">Learn More</span>
                <motion.span
                  className="absolute inset-0 rounded-md bg-primary/10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-8 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex -space-x-4">
              {status === "LoadingFirstPage" ? (
                // Loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 animate-pulse" />
                    </Avatar>
                  </motion.div>
                ))
              ) : (
                <>
                  {results.slice(0, 4).map((user, indx) => (
                    <motion.div
                      key={user._id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + indx * 0.1 }}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={user.image || "/placeholder.svg"}
                          alt={user.name || "User"}
                          className="rounded-full"
                        />
                        <AvatarFallback className="bg-primary/20">
                          {user.name ? user.name.charAt(0) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ))}
                  {results.length > 4 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm font-medium">
                          + 75
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  )}
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Join{" "}
              <span className="font-semibold text-foreground">
                {!results ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  ` 79 +`
                )}
              </span>{" "}
              Active users
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className=" relative w-full p-1 Desktop:p-2 rounded-lg bg-gradient-to-t from-transparent from-10% to-primary/50 backdrop-blur-lg"
        >
          <Image
            src={homeImage}
            alt="Notevo home page"
            className=" mask-image-gradient p-full w-full"
            width={300}
            height={300}
          />
        </motion.div>
      </MaxWContainer>
    </section>
  );
}
