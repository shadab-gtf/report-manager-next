import type { DashboardMetric } from "@/types/dashboard";
import { MetricCard } from "@/components/ui/metric-card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsSectionProps {
  metrics: DashboardMetric[];
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  return (
    <section aria-label="Productivity metrics" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}

export function MetricsSectionSkeleton() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-border bg-card p-6">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="mt-5 h-10 w-full max-w-xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-5"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-5 h-9 w-20" />
            <Skeleton className="mt-3 h-4 w-28" />
          </div>
        ))}
      </section>
    </div>
  );
}
