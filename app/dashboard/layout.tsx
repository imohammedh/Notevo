import type { ReactNode } from "react";
import type { Metadata } from "next";
import DashboardClientLayout from "@/components/dashboard-components/DashboardClientLayout";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Dashboard",
  description: "Your Notevo dashboard - manage your notes and workspaces",
  path: "/dashboard",
  noindex: true, // Private pages should not be indexed
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
