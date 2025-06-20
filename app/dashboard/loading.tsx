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

// Skeleton component for reusable skeleton elements
const Skeleton = ({ className = "", ...props }: { className?: string; [key: string]: any }) => {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md ${className}`}
      {...props}
    />
  );
};

// Loading skeleton content
const DashboardLoadingSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header section skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Chart/Graph skeleton */}
      <div className="p-6 border rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>

      {/* Table skeleton */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Additional content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border rounded-lg space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
    }, 2000); // Increased to 2 seconds so you can see the skeleton
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
        {/* Sidebar skeleton */}
        <div 
          className={`bg-sidebar border-r transition-all duration-300 ease-in-out ${
            open && !isMobile ? 'w-64' : 'w-16'
          }`}
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-4 space-y-4">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded" />
              {open && !isMobile && <Skeleton className="h-5 w-24" />}
            </div>
            
            {/* Navigation skeleton */}
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2">
                  <Skeleton className="h-4 w-4" />
                  {open && !isMobile && <Skeleton className="h-4 w-20" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <main 
          className={`relative flex flex-col flex-1 min-h-svh transition-all duration-300 ease-in-out border-border ${
            open && !isMobile ? `rounded-t-xl border-t border-l mt-3` : ''
          } rounded-none bg-background`}
        >
          {/* Header skeleton */}
          <div className="w-full absolute top-0 mx-auto py-2.5 bg-background border-b">
            <div className="w-full flex items-center justify-start px-5 gap-3">
              {(!open || isMobile) && (
                <Skeleton className="h-6 w-6" />
              )}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <span className="text-muted-foreground">/</span>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="mt-14 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <DashboardLoadingSkeleton />
          </div>
          <MobileWarning />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-accent overflow-hidden">
      <AppSidebar />
      <main
        ref={mainRef}
        className={`relative flex flex-col flex-1 min-h-svh transition-all duration-300 ease-in-out border-primary/20 ${
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