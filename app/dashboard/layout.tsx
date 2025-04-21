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
      <SidebarInset className="flex flex-col bg-brand_primary">
        <div className={`w-full absolute top-0 ${open && `mx-auto`} py-2.5`}>
          <div
            className={`w-full flex items-center justify-start container ${!open && ` mx-auto`} gap-3`}
          >
            {!open && <SidebarTrigger />}
            {isClient && <BreadcrumbWithCustomSeparator />}
          </div>
        </div>
        <div className="mt-16 flex-1 overflow-auto">{children}</div>
      </SidebarInset>
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
