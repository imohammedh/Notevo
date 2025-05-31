"use client";
import { NavLinks } from "../../lib/data";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import imgsrc from "../../public/Notevo-logo.svg";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
export default function Navbar() {
  const { scrollY } = useScroll();
  const [inView, setInView] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 90) {
      setInView(true);
    } else {
      setInView(false);
    }
  });

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "linear" }}
      className=" p-1 fixed top-0 w-full z-50 transition-all"
    >
      <div
        className={cn(
          " container mx-auto flex justify-between items-center border-solid border border-transparent text-mainColor200 p-4 rounded-xl transition-all ease-linear",
          inView
            ? "border-brand_tertiary/10 bg-brand_primary/70 backdrop-blur-md [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)] scale-[1] shadow-xl"
            : "bg-transparent scale-[0.95]",
        )}
      >
        <div className=" flex justify-center items-center">
          <Link
            href="/"
            className=" text-3xl font-bold text-brand_primary pr-5"
          >
            {" "}
            <Image
              src={imgsrc}
              alt="NoteWise Logo"
              className="hover:opacity-50"
              priority
              width={40}
              height={40}
            />{" "}
          </Link>
          <ul className=" hidden lg:flex">
            {NavLinks.map((link, i) => {
              return (
                <Link
                  key={i}
                  href={link.path}
                  className="px-2 text-base hover:font-semibold transition ease-in-out duration-200"
                >
                  {link.Name}
                </Link>
              );
            })}
          </ul>
          <button
            className="lg:hidden ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        <div className=" hidden lg:flex justify-center items-center gap-3">
          <Button variant="default">
            <Link href="/signin" className=" text-sm font-medium">
              Get Started for Free
            </Link>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 rounded-xl m-2 border-brand_tertiary/10 bg-brand_primary/70 backdrop-blur-md [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)]">
            {NavLinks.map((link, i) => (
              <Link
                key={i}
                href={link.path}
                className="block px-3 py-2 text-base hover:bg-brand_tertiary/10 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.Name}
              </Link>
            ))}
            <Button variant="default">
              <Link href="/signin" className="text-sm font-medium w-full">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      )}
    </motion.header>
  );
}
