import type { DashboardMetric } from "@/types/dashboard";

const toneClassName: Record<DashboardMetric["tone"], string> = {
  primary: "border-primary/20 bg-primary-light/50 text-primary",
  success: "border-success/20 bg-success-light text-success",
  warning: "border-warning/20 bg-warning-light text-warning",
  info: "border-info/20 bg-info-light text-info",
};

interface MetricCardProps {
  metric: DashboardMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="rounded border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {metric.label}
        </p>
        <span className={`h-2 w-2 rounded-full ${toneClassName[metric.tone]}`} />
      </div>
      <p className="mt-3 text-2xl font-normal text-card-foreground">
        {metric.value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{metric.change}</p>
    </article>
  );
}
