import { reportDb } from "@/modules/reports/services/report-db";
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
    status: "Submitted",
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
  filters: ReportHistoryFilters & { sortDirection?: "asc" | "desc" }
): Promise<ReportHistoryResult> {
  let dbReports: DailyReportDraft[] = [];

  if (typeof window !== "undefined") {
    try {
      // Retrieve locally saved drafts, queued, or submitted reports
      const localRecords = await reportDb.drafts.toArray();
      // Exclude the active editing draft
      dbReports = localRecords.filter((r) => r.id !== "current-draft");
    } catch (error) {
      console.error("Failed to fetch local reports from IndexedDB:", error);
    }
  }

  // De-duplicate by ID (in case seed reports are saved in IndexedDB as well)
  const reportMap = new Map<string, DailyReportDraft>();
  seedReports.forEach((r) => reportMap.set(r.id, r));
  dbReports.forEach((r) => reportMap.set(r.id, r));

  const allReports: DailyReportDraft[] = Array.from(reportMap.values()).map(r => ({
    ...r,
    status: ((r.status as any) === "Missed" ? "Missed" : "Submitted") as any
  }));

  // Generate missed reports for the past 30 days
  const existingDates = new Set(allReports.map((r) => r.reportDate));
  const today = new Date();
  for (let i = 0; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    if (!existingDates.has(dateStr)) {
      allReports.push({
        id: `missed-${dateStr}`,
        employeeId: "GTF-1042", // Assuming current user
        reportDate: dateStr,
        status: "Missed" as any,
        updatedAt: dateStr + "T00:00:00.000Z",
        tasks: [],
        meetings: [],
        notes: { pending: "", blockers: "", tomorrowPlan: "" },
      });
    }
  }

  const normalizedQuery = filters.query.trim().toLowerCase();

  const filtered = allReports.filter((report) => {
    const statusMatches =
      filters.status === "All" || report.status === filters.status;
    const queryMatches =
      normalizedQuery.length === 0 ||
      report.reportDate.includes(normalizedQuery) ||
      report.status.toLowerCase().includes(normalizedQuery);
    
    let dateMatches = true;
    if (filters.datePreset && filters.datePreset !== "All") {
      const reportDate = new Date(report.reportDate);
      const limitDate = new Date();
      switch (filters.datePreset) {
        case "Today":
          // reportDate is already just the date part. Compare exactly.
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          dateMatches = report.reportDate === todayStr;
          break;
        case "7Days":
          limitDate.setDate(today.getDate() - 7);
          dateMatches = reportDate >= limitDate;
          break;
        case "10Days":
          limitDate.setDate(today.getDate() - 10);
          dateMatches = reportDate >= limitDate;
          break;
        case "15Days":
          limitDate.setDate(today.getDate() - 15);
          dateMatches = reportDate >= limitDate;
          break;
        case "1Month":
        case "30Days":
          limitDate.setDate(today.getDate() - 30);
          dateMatches = reportDate >= limitDate;
          break;
      }
    }

    return statusMatches && queryMatches && dateMatches;
  });

  // Sort by reportDate
  const sortDir = filters.sortDirection || "desc";
  filtered.sort((a, b) =>
    sortDir === "desc"
      ? b.reportDate.localeCompare(a.reportDate)
      : a.reportDate.localeCompare(b.reportDate)
  );

  const pageSize = 10;
  const startIndex = (filters.page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    reports: paginated,
    total: filtered.length,
    pageSize,
  };
}

export async function getReportById(
  reportId: string,
): Promise<DailyReportDraft | null> {
  if (typeof window !== "undefined") {
    const local = await reportDb.drafts.get(reportId);
    if (local) return local;
  }
  return seedReports.find((report) => report.id === reportId) ?? null;
}

export function getSeedReports(): DailyReportDraft[] {
  return seedReports;
}

export function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function copyReportToDraft(report: DailyReportDraft): Promise<void> {
  if (typeof window !== "undefined") {
    await reportDb.drafts.put({
      ...report,
      id: "current-draft",
      updatedAt: new Date().toISOString(),
    });
  }
}

