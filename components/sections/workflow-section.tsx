import type { ReportPipelineData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkflowSectionProps {
  pipeline: Promise<ReportPipelineData>;
}

export async function WorkflowSection({ pipeline }: WorkflowSectionProps) {
  const data = await pipeline;

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-card-foreground">
        Today&apos;s Workflow
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Multi-step reporting progress with offline-safe checkpoints.
      </p>
      <div className="mt-6 grid gap-5">
        {data.items.map((item) => {
          const progress = Math.min(
            100,
            Math.round((item.value / item.target) * 100),
          );

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="font-semibold text-muted-foreground">
                  {progress}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-lg border border-border bg-background p-4">
        <p className="text-sm font-semibold text-foreground">
          Offline queue active
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Draft autosave, IndexedDB recovery, and background sync are represented
          in the frontend architecture for backend integration.
        </p>
      </div>
    </section>
  );
}

export function WorkflowSectionSkeleton() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-2 h-4 w-full" />
      <div className="mt-6 grid gap-5">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="mt-2 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
