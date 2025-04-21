"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
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
    <>
      {isClient && <AppSidebar />}
      <main className="w-full relative">
        <div
          className={`w-full fixed top-0 bg-brand_primary/70 backdrop-blur-md [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)] z-50 ${open && `mx-auto`} p-2.5`}
        >
          <div
            className={` w-full flex items-center justify-start ${!open && `container mx-auto`} gap-3`}
          >
            {!open && <SidebarTrigger />}
            {isClient && <BreadcrumbWithCustomSeparator />}
          </div>
        </div>
        <div className="mt-16">{children}</div>
      </main>
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
