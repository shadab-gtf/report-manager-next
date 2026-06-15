import type { ReportingStatus } from "@/types/dashboard";

const statusClassName: Record<ReportingStatus, string> = {
  submitted: "bg-success-light text-success",
  draft: "bg-warning-light text-warning",
  "pending-sync": "bg-info-light text-info",
};

interface StatusPillProps {
  status: ReportingStatus;
  children: React.ReactNode;
}

export function StatusPill({ status, children }: StatusPillProps) {
  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold ${statusClassName[status]}`}
    >
      {children}
    </span>
  );
}
