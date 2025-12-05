"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@/cache/useQuery";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const getusers = useQuery(api.users.users);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackground(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent rounded-b-[3rem] mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showBackground ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="absolute inset-0 shadow-xl shadow-primary/10 rounded-b-[3rem] mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showBackground ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      <div className="container relative z-10 mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Simple, Structured
            </span>
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
            className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Notevo helps you capture your thoughts, organize them effortlessly
            and interact with your notes in one clean, modern interface.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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
            className="flex items-center justify-center gap-8 pt-8"
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
                    <Avatar className="w-10 h-10 border-2 border-background">
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
                      <Avatar className="w-10 h-10 border-2 border-background">
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
                      <Avatar className="w-10 h-10 border-2 border-background bg-primary/10">
                        <AvatarFallback className="text-sm font-medium">
                          +{getusers.length - 4}
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
                  `${getusers.length}+`
                )}
              </span>{" "}
              Active users
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
