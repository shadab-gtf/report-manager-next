import { Suspense } from "react";
import type {
  DashboardOverview,
  RecentReportsData,
  ReportPipelineData,
} from "@/types/dashboard";
import { AppShell } from "./app-shell";
import { DashboardHero } from "./dashboard-hero";
import { MetricsSection, MetricsSectionSkeleton } from "./metrics-section";
import {
  RecentActivitySection,
  RecentActivitySectionSkeleton,
} from "./recent-activity-section";
import {
  WorkflowSection,
  WorkflowSectionSkeleton,
} from "./workflow-section";

interface DashboardPageSectionProps {
  overview: Promise<DashboardOverview>;
  recentReports: Promise<RecentReportsData>;
  pipeline: Promise<ReportPipelineData>;
}

export function DashboardPageSection({
  overview,
  recentReports,
  pipeline,
}: DashboardPageSectionProps) {
  return (
    <AppShell>
      <div className="grid gap-6">
        <Suspense fallback={<MetricsSectionSkeleton />}>
          <DashboardOverviewSections overview={overview} />
        </Suspense>
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Suspense fallback={<RecentActivitySectionSkeleton />}>
            <RecentActivitySection recentReports={recentReports} />
          </Suspense>
          <Suspense fallback={<WorkflowSectionSkeleton />}>
            <WorkflowSection pipeline={pipeline} />
          </Suspense>
        </div>
      </div>
    </AppShell>
  );
}

async function DashboardOverviewSections({
  overview,
}: {
  overview: Promise<DashboardOverview>;
}) {
  const data = await overview;

  return (
    <>
      <DashboardHero overview={data} />
      <MetricsSection metrics={data.metrics} />
    </>
  );
}
