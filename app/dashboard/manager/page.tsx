import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { ManagerDashboard } from "@/modules/manager/components/manager-dashboard";

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description: "Team submission overview and reporting metrics.",
};

export default function ManagerDashboardPage() {
  return (
    <AppShell activeSegment="dashboard/manager">
      <ManagerDashboard />
    </AppShell>
  );
}
