"use client";

import { type ReactNode, useState, useEffect, useRef } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";

function DashboardContent({ children }: { children: ReactNode }) {
  const { open, isMobile } = useSidebar();
  const [isClient, setIsClient] = useState(false);
  const [shadow, setShadow] = useState(true);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableRef.current) {
        const top = scrollableRef.current.scrollTop;
        setShadow(top > 0);
      }
    };

    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-brand_fourthary from-15% via-brand_fourthary to-purple-600 overflow-hidden">
      {isClient && <AppSidebar />}
      <main
        className={`relative flex flex-col flex-1 min-h-svh transition-all duration-300 ease-in-out border-brand_tertiary/20 ${
          open && !isMobile && `rounded-t-xl border-t border-l mt-3`
        } rounded-none bg-brand_primary/80`}
      >
        <div
          className={`w-full absolute top-0 mx-auto py-2.5 transition-shadow duration-300 ${
            shadow ? "shadow-xl shadow-brand_tertiary/5" : "shadow-none"
          }`}
        >
          <div className="w-full flex items-center justify-start container gap-3">
            {(!open || isMobile) && <SidebarTrigger />}
            {isClient && <BreadcrumbWithCustomSeparator />}
          </div>
        </div>
        <div
          className="mt-14 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-brand_tertiary scrollbar-track-transparent"
          ref={scrollableRef}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
