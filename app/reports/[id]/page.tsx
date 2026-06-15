import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/sections/app-shell";
import { getReportById } from "@/modules/reports/services/report-repository";

export const metadata: Metadata = {
  title: "Report Detail",
};

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  return (
    <AppShell activeSegment="reports">
      <article className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-primary">
          {report.status}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-card-foreground">
          Report for {report.reportDate}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {report.tasks.length} task entries · {report.meetings.length} meeting entries
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Note title="Pending" value={report.notes.pending} />
          <Note title="Blockers" value={report.notes.blockers} />
          <Note title="Tomorrow" value={report.notes.tomorrowPlan} />
        </div>
      </article>
    </AppShell>
  );
}

function Note({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
