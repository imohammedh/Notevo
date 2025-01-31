"use client";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar  from "@/components/dashboard-components/AppSidebar";
import NextNProgress from 'nextjs-progressbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <NextNProgress color="#fafafa" />
      <AppSidebar />
      <main className="w-full"> 
        <div className=" p-2 flex items-center justify-start gap-2">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}