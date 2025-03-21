"use client";
import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider>
      {isClient && <AppSidebar />}
      <main className="w-full relative">
        <div className=" w-full fixed top-0 bg-brand_primary/70 backdrop-blur-md [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)] z-50 p-2">
          <div className="flex items-center justify-start ">
            <SidebarTrigger className=" lg:block hidden" />
            {isClient && <BreadcrumbWithCustomSeparator />}
          </div>
        </div>
        <div className=" mt-16">{children}</div>
      </main>
    </SidebarProvider>
  );
}
