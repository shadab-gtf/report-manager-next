"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { listReports, copyReportToDraft, getLocalDateString } from "@/modules/reports/services/report-repository";
import type { ReportStatus, DailyReportDraft } from "@/types/report";
import { PencilIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { AnimatedTabs } from "@/components/motion/animated-tabs";

const statuses: Array<"All" | ReportStatus | "Missed"> = [
  "All",
  "Submitted",
  "Missed",
];

const DATE_PRESETS = [
  { key: "All", label: "All Time" },
  { key: "Today", label: "Today" },
  { key: "7Days", label: "7 Days" },
  { key: "10Days", label: "10 Days" },
  { key: "15Days", label: "15 Days" },
  { key: "1Month", label: "1 Month" },
];

function formatUpdatedTime(reportDate: string, updatedAtStr: string): string {
  const [year, month, day] = reportDate.split("-").map(Number);
  const reportDateObj = new Date(year, month - 1, day);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = days[reportDateObj.getDay()];
  
  const date = new Date(updatedAtStr);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${dayOfWeek}, ${hours}:${minutes}:${seconds} ${ampm}`;
}

export function ReportHistoryTable() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ReportStatus | "Missed">("All");
  const [datePreset, setDatePreset] = useState("1Month");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Fetch reports from the service using TanStack React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports-history", query, status, page, sortDirection, datePreset],
    queryFn: () => listReports({ query, status, page, sortDirection, datePreset }),
    placeholderData: (previousData) => previousData, // Keep previous page data during transitions
    staleTime: 5000,
  });

  const reports = data?.reports ?? [];
  const totalReports = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 10;
  const totalPages = Math.ceil(totalReports / pageSize) || 1;

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, newPage)));
  };

  const handleEdit = async (report: DailyReportDraft) => {
    const today = getLocalDateString();
    if (report.reportDate !== today) return;
    await copyReportToDraft(report);
    router.push("/reports/create");
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_160px]">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1); // Reset page to 1 on search
          }}
          placeholder="Search reports"
          className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        />
        <button
          type="button"
          onClick={() =>
            setSortDirection((current) => (current === "desc" ? "asc" : "desc"))
          }
          className="min-h-11 rounded-md border border-border px-3 text-sm font-semibold hover:bg-muted"
        >
          Date {sortDirection}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-border pb-4 justify-between">
        <AnimatedTabs
          tabs={DATE_PRESETS.map((preset) => ({
            id: preset.key,
            label: preset.label,
          }))}
          activeTab={datePreset}
          onTabChange={(tab) => setDatePreset(tab as string)}
          layoutId="employee-reports-date-filter"
          className="flex flex-wrap items-center gap-2"
          tabClassName="relative rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer border border-border bg-card hover:border-primary/30 focus:outline-none"
          activeTabClassName="text-white border-transparent bg-transparent"
          indicatorClassName="absolute inset-0 rounded-full bg-primary shadow-sm"
        />
        
        <div className="flex gap-2 items-center flex-wrap mt-2 sm:mt-0">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer transition-colors ${
                status === s
                  ? "bg-primary text-white border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        {isLoading ? (
          <div className="p-10 flex flex-col gap-4 min-w-[650px]">
            <div className="h-6 w-full animate-pulse rounded bg-skeleton" />
            <div className="h-6 w-full animate-pulse rounded bg-skeleton" />
            <div className="h-6 w-full animate-pulse rounded bg-skeleton" />
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-danger min-w-[650px]">
            Failed to load reports: {(error as Error).message}
          </div>
        ) : (
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 min-w-[200px]">Report Tasks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => {
                const today = getLocalDateString();
                const isEditable = report.reportDate === today;
                return (
                  <tr key={report.id} className="hover:bg-muted/70">
                    <td className="px-4 py-4 font-semibold">{report.reportDate}</td>
                    <td className="px-4 py-4">
                      <button 
                        type="button"
                        onClick={() => handleEdit(report)}
                        disabled={!isEditable}
                        className="text-left group flex flex-col items-start disabled:opacity-70 disabled:cursor-auto cursor-pointer"
                        title={isEditable ? "Click to view/edit tasks" : ""}
                      >
                        <div className={`font-semibold ${isEditable ? 'text-primary group-hover:underline' : 'text-foreground'}`}>
                          {report.tasks?.[0]?.title || `Daily Tasks`}
                        </div>
                        {report.tasks?.length > 1 && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            + {report.tasks.length - 1} more task{report.tasks.length > 2 ? 's' : ''}
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {report.status === "Missed" ? (
                        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                          Missed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                          Submitted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {formatUpdatedTime(report.reportDate, report.updatedAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(report)}
                        disabled={!isEditable}
                        className="inline-flex items-center gap-1.5 rounded-md bg-card border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer disabled:pointer-events-none"
                        title={isEditable ? "Edit report" : "Editing only allowed on the same day"}
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No reports match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && !isError && totalReports > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing {reports.length} of {totalReports} reports.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="min-h-9 rounded border border-border px-3 text-xs font-semibold hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              Previous
            </button>
            <span className="inline-flex items-center text-sm px-2">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="min-h-9 rounded border border-border px-3 text-xs font-semibold hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
