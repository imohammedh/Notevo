"use client";

import { type ReactNode, useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";
function DashboardContent({ children }: { children: ReactNode }) {
  const { open } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex h-screen w-full bg-brand_fourthary overflow-hidden">
      {isClient && <AppSidebar />}
      <main
        className={`relative flex flex-col flex-1 min-h-svh transition-all duration-300 delay-300 ease-in-out rounded-xl border-t border-l border-brand_tertiary/20 mt-2.5 ${!open && `border-none rounded-none mt-0`} bg-brand_primary`}
      >
        <div className={`w-full absolute top-0 ${open && `mx-auto`} py-2.5`}>
          <div
            className={`w-full flex items-center justify-start container ${!open && ` mx-auto`} gap-3`}
          >
            {!open && <SidebarTrigger />}
            {isClient && <BreadcrumbWithCustomSeparator />}
          </div>
        </div>
        <div className="mt-14 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-brand_tertiary scrollbar-track-brand_primary">
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
