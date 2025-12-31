"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export default function Footer() {
  const { theme } = useTheme();
  const defaultIcon: string =
    theme === "dark" ? "/Notevo-logo.svg" : "/DarkNotevo-logo.svg";
  const [IconImage, setIconImage] = useState<string>(defaultIcon);
  useEffect(() => {
    if (theme === "dark") {
      setIconImage("/Notevo-logo.svg");
    } else {
      setIconImage("/DarkNotevo-logo.svg");
    }
  }, [theme]);
  return (
    <footer className=" relative w-full text-foreground py-20  bg-gradient-to-t from-accent from-50% to-transparent">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          <div>
            <Link href="/">
              <Image
                src={IconImage}
                alt="Notevo logo"
                className="pb-2 hover:opacity-50"
                width={50}
                height={50}
              />
            </Link>
            <h2 className="text-2xl font-bold text-foreground">Notevo</h2>
            <p className="mt-2 text-muted-foreground">
              Notes without the hassle.
            </p>{" "}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground">Notevo</h3>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>
                <Link
                  prefetch={true}
                  href="/#How_To_Start"
                  className="hover:underline"
                >
                  How To Start
                </Link>
              </li>
              <li>
                <Link
                  prefetch={true}
                  href="/#features"
                  className="hover:underline"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className=" text-lg font-semibold text-foreground">Legal</h3>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>
                <Link
                  prefetch={true}
                  href="/terms-of-service"
                  className="hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  prefetch={true}
                  href="/privacy-policy"
                  className="hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-5 border-t border-primary/20 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-start text-muted-foreground text-sm">
            Copyright © {new Date().getFullYear()} Notevo. All rights reserved.
          </div>
          <div className="w-[200px]">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
