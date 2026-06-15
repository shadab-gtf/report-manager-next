import type {
  DailyReportDraft,
  ReportHistoryFilters,
  ReportHistoryResult,
} from "@/types/report";

const seedReports: DailyReportDraft[] = [
  {
    id: "report-2026-06-14",
    employeeId: "GTF-1042",
    reportDate: "2026-06-14",
    status: "Submitted",
    updatedAt: "2026-06-14T18:30:00.000Z",
    submittedAt: "2026-06-14T18:30:00.000Z",
    tasks: [
      {
        id: "task-1",
        description: "Closed priority vendor reconciliation queue",
        category: "Operations",
        priority: "High",
        timeSpent: 3.5,
        completion: 100,
        status: "Completed",
        expectedCompletionDate: "2026-06-14",
        notes: "Validated all pending entries with finance team.",
      },
    ],
    meetings: [
      {
        id: "meeting-1",
        subject: "Daily operations sync",
        withWhom: "Regional operations team",
        time: "10:00",
        duration: 30,
        type: "Standup",
      },
    ],
    notes: {
      pending: "Follow up on two escalated exceptions.",
      blockers: "Waiting for vendor statement confirmation.",
      tomorrowPlan: "Complete reconciliation and publish exception summary.",
    },
  },
  {
    id: "report-2026-06-13",
    employeeId: "GTF-1042",
    reportDate: "2026-06-13",
    status: "Approved",
    updatedAt: "2026-06-13T18:10:00.000Z",
    submittedAt: "2026-06-13T18:10:00.000Z",
    tasks: [],
    meetings: [],
    notes: {
      pending: "No carry forward.",
      blockers: "None.",
      tomorrowPlan: "Prepare operations queue for Monday review.",
    },
  },
];

export async function listReports(
  filters: ReportHistoryFilters,
): Promise<ReportHistoryResult> {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const filtered = seedReports.filter((report) => {
    const statusMatches =
      filters.status === "All" || report.status === filters.status;
    const queryMatches =
      normalizedQuery.length === 0 ||
      report.reportDate.includes(normalizedQuery) ||
      report.status.toLowerCase().includes(normalizedQuery);

    return statusMatches && queryMatches;
  });

  return {
    reports: filtered,
    total: filtered.length,
    pageSize: 10,
  };
}

export async function getReportById(
  reportId: string,
): Promise<DailyReportDraft | null> {
  return seedReports.find((report) => report.id === reportId) ?? null;
}

export function getSeedReports(): DailyReportDraft[] {
  return seedReports;
}
