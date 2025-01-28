"use client";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar  from "@/components/dashboard-components/AppSidebar";
import React from "react";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full"> 
          <div className=" p-2 flex items-center justify-start">
          <SidebarTrigger />
          </div>
          {children}
      </main>
      </SidebarProvider>
    </ConvexClientProvider>
  );
}
