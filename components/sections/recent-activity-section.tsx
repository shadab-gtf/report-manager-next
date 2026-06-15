import type { RecentReportsData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/status-pill";

interface RecentActivitySectionProps {
  recentReports: Promise<RecentReportsData>;
}

export async function RecentActivitySection({
  recentReports,
}: RecentActivitySectionProps) {
  const data = await recentReports;

  return (
    <section className="rounded-lg hidden border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Recent Activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drafts, submissions, and sync events are tracked together.
          </p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Report
              </th>
              <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">
                Detail
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Status
              </th>
              <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-muted/70">
                <td className="px-4 py-4 font-medium text-foreground">
                  {activity.title}
                </td>
                <td className="hidden px-4 py-4 text-muted-foreground md:table-cell">
                  {activity.detail}
                </td>
                <td className="px-4 py-4">
                  <StatusPill status={activity.status}>
                    {activity.status.replace("-", " ")}
                  </StatusPill>
                </td>
                <td className="hidden px-4 py-4 text-muted-foreground sm:table-cell">
                  {activity.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function RecentActivitySectionSkeleton() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <Skeleton className="h-7 w-44" />
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <div className="mt-6 grid gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    </section>
  );
}
