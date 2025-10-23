import type { ReactNode } from "react";
import DashboardClientLayout from "@/components/dashboard-components/DashboardClientLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
