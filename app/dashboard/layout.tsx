"use client";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard-components/AppSidebar";
import BreadcrumbWithCustomSeparator from "@/components/dashboard-components/BreadcrumbWithCustomSeparator";
import MaxWContainer from "@/components/ui/MaxWContainer";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <main className="w-full relative">
        <div className=" w-full fixed top-0 bg-brand_primary/70 backdrop-blur-md [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)] z-50 p-2"></div>
        <div className=" mt-16">{children}</div>
      </main>
    </SidebarProvider>
  );
}
