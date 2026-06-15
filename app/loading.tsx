import { AppShell } from "@/components/sections/app-shell";
import { MetricsSectionSkeleton } from "@/components/sections/metrics-section";
import { RecentActivitySectionSkeleton } from "@/components/sections/recent-activity-section";
import { WorkflowSectionSkeleton } from "@/components/sections/workflow-section";

export default function Loading() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <MetricsSectionSkeleton />
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <RecentActivitySectionSkeleton />
          <WorkflowSectionSkeleton />
        </div>
      </div>
    </AppShell>
  );
}
