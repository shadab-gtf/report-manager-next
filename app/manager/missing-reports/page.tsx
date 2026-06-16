import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { MissingReportsTable } from "@/modules/manager/components/missing-reports-table";

export const metadata: Metadata = {
  title: "Missing Reports",
  description: "Track non-compliant team daily updates.",
};

export default function MissingReportsPage() {
  return (
    <AppShell activeSegment="manager/missing-reports">
      <MissingReportsTable />
    </AppShell>
  );
}
