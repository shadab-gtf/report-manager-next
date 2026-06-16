import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { TeamTable } from "@/modules/manager/components/team-table";

export const metadata: Metadata = {
  title: "My Team",
  description: "Operations team submission roster and details.",
};

export default function TeamDirectoryPage() {
  return (
    <AppShell activeSegment="manager/team">
      <TeamTable />
    </AppShell>
  );
}
