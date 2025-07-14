"use client";

import { type ReactNode, memo } from "react";
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

  return (
    <div className="flex h-screen w-full bg-accent overflow-hidden">
      <AppSidebar />
      <main
        className={`relative flex flex-col flex-1 min-h-svh transition-all duration-300 ease-in-out border-primary/20 ${
          open && !isMobile ? `rounded-t-xl border-t border-l mt-3` : ''
        } rounded-none bg-background`}
      >

        <div className="w-full flex items-center justify-start px-5 gap-3  mx-auto py-2.5">
          {(!open || isMobile) && <SidebarTrigger />}
          <BreadcrumbWithCustomSeparator />
        </div>
        <div
          className="pt-7 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
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