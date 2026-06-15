import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { ReportBuilder } from "@/modules/reports/components/report-builder";

export const metadata: Metadata = {
  title: "Create Report",
};

export default function CreateReportPage() {
  return (
    <AppShell activeSegment="reports">
      <ReportBuilder />
    </AppShell>
  );
}
