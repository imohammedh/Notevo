"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useQuery } from "@/src/cache/useQuery";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect } from "react";
import BrowserMockup from "./BrowserMockup";
import MaxWContainer from "../ui/MaxWContainer";
import { useMediaQuery } from "react-responsive";
export default function HeroSection() {
  const getusers = useQuery(api.users.users);
  const [showBackground, setShowBackground] = useState(false);
  const { scrollY } = useScroll();
  const [inView, setInView] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTabletAir_horizontal = useMediaQuery({ maxWidth: 1180 });
  const isTabletPro_horizontal = useMediaQuery({ maxWidth: 1366 });
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
      {/* Background Elements */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-accent from-50%  to-transparent",
          inView ? "shadow-[0_15px_25px] shadow-muted " : "",
        )}
        initial={{ opacity: 0, margin: 0, borderRadius: 0 }}
        animate={{
          opacity: showBackground ? 1 : 0,
          margin:
            inView &&
            !isMobile &&
            !isTabletAir_horizontal &&
            !isTabletPro_horizontal
              ? 30
              : 0,
          borderRadius:
            inView &&
            !isMobile &&
            !isTabletAir_horizontal &&
            !isTabletPro_horizontal
              ? 20
              : 0,
        }}
        transition={{
          opacity: { duration: showBackground ? 0.8 : 0 },
          margin: { duration: 0.2 },
          borderRadius: { duration: inView ? 0.3 : 0 },
          delay: 0,
          ease: "easeInOut",
        }}
      />
      <div className=" container py-32 Desktop:py-0 relative text-start flex  justify-between items-center flex-grow flex-col Desktop:flex-row Desktop:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            className="bg-gradient-to-r from-primary to-foreground/50 bg-clip-text text-transparent text-4xl md:text-6xl Desktop:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span>Simple, Structured</span>
            <br />
            <motion.span
              initial={{ backgroundSize: "0% 100%" }}
              animate={
                showBackground
                  ? { backgroundSize: "100% 100%" }
                  : { backgroundSize: "0% 100%" }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="
    bg-gradient-to-r 
    from-primary/20 
    to-secondary/10 
    bg-no-repeat 
    bg-[length:0%_100%] 
    p-0.5
    rounded-xl
  "
            >
              Note-Taking
            </motion.span>
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg md:text-xl text-muted-foreground font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Notevo helps you capture your thoughts and organize them
            effortlessly in one clean, modern interface.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-start items-center"
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
            className="flex items-center justify-start gap-8 py-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex -space-x-4">
              {!getusers ? (
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
                  {getusers.slice(0, 4).map((user, indx) => (
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
                  {getusers.length > 4 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm font-medium">
                          + {getusers.length - 4}
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
                {!getusers ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  ` ${getusers.length} +`
                )}
              </span>{" "}
              Active users
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-8 relative"
        >
          <BrowserMockup />
        </motion.div>
      </div>
    </section>
  );
}
