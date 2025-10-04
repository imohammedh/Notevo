"use client";

import { type ReactNode, memo, useRef, useEffect, useState } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";
import { MobileWarning } from "@/components/ui/mobile-warning";

const DashboardContent = memo(({ children }: { children: ReactNode }) => {
  const { open, isMobile } = useSidebar();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setShowShadow(scrollTop > 0);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-accent overflow-hidden">
      <AppSidebar />
      <main
        className={`relative flex flex-col flex-1 min-h-svh transition-all duration-300 ease-in-out border-primary/20 ${
          open && !isMobile ? `rounded-t-xl border-t border-l mt-3` : ''
        } rounded-none bg-background `}
      >
        <div 
          className={`w-full flex items-center justify-start px-5 gap-3 mx-auto rounded-t-xl border-t border-l border-none py-2.5 bg-background transition-shadow duration-200 ${
            showShadow ? 'shadow-xl shadow-primary/10' : ''
          }`}
        >
          {(!open || isMobile) && <SidebarTrigger />}
          <BreadcrumbWithCustomSeparator />
        </div>
        <div
          ref={scrollContainerRef}
          className="pt-7 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
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