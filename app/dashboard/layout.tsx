"use client";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar  from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative"> 
        <div className=" p-2 flex items-center justify-start gap-2">
          <SidebarTrigger className=" lg:block hidden"/>
          {/* <BreadcrumbWithCustomSeparator/> */}
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}