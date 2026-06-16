import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { TeamReports } from "@/modules/manager/components/team-reports";

export const metadata: Metadata = {
  title: "Team Reports",
  description: "Review daily reporting submissions.",
};

export default function TeamReportsPage() {
  return (
    <AppShell activeSegment="manager/reports">
      <TeamReports />
    </AppShell>
  );
}
