"use client";

import { type ReactNode, useState, useEffect, useRef, memo } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";
import { MobileWarning } from "@/components/ui/mobile-warning";

const DashboardContent = memo(({ children }: { children: ReactNode }) => {
  const { open, isMobile, sidebarWidth } = useSidebar();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shadow, setShadow] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
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

  if (!isClient || isLoading) {
    return (
      <div className="flex h-screen w-full bg-accent overflow-hidden">
        <div style={{ width: `${sidebarWidth}px` }} />
        <main className={`relative flex flex-col flex-1 min-h-svh border-border ${
          open && !isMobile ? `rounded-t-xl border-t border-l mt-3` : ''
        } rounded-none bg-background`}>
          <div className="mt-14 flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div> 
    );
  }

  return (
    <div className="flex h-screen w-full bg-accent overflow-hidden">
      <AppSidebar />
      <main
        ref={mainRef}
        className={`relative flex flex-col flex-1 min-h-svh border-primary/20 ${
          open && !isMobile ? `rounded-t-xl border-t border-l mt-3` : ''
        } rounded-none bg-background`}
      >
        <div
          className={`w-full absolute top-0 mx-auto py-2.5 ${
            shadow ? "shadow-2xl shadow-border/10" : "shadow-none"
          }`}
        >
        <div className="w-full flex items-center justify-start px-5 gap-3">
          {(!open || isMobile) && <SidebarTrigger />}
          <BreadcrumbWithCustomSeparator />
        </div>
        </div>
        <div
          className="mt-14 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          ref={scrollableRef}
        >
          {children}
        </div>
        <MobileWarning />
      </main>
    </div>
  );
});

DashboardContent.displayName = 'DashboardContent';

const DashboardLayout = memo(({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;