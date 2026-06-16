import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { AnalyticsDashboard } from "@/modules/manager/components/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Team submission compliance trends and metrics dashboards.",
};

export default function TeamAnalyticsPage() {
  return (
    <AppShell activeSegment="manager/analytics">
      <AnalyticsDashboard />
    </AppShell>
  );
}
