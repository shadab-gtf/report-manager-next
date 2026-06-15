import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { ReportHistoryTable } from "@/modules/reports/components/report-history-table";

export const metadata: Metadata = {
  title: "Report History",
};

export default function ReportHistoryPage() {
  return (
    <AppShell activeSegment="reports">
      <ReportHistoryTable />
    </AppShell>
  );
}
