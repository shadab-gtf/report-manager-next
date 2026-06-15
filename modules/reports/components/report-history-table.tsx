"use client";

import { useMemo, useState } from "react";
import { getSeedReports } from "@/modules/reports/services/report-repository";
import type { ReportStatus } from "@/types/report";

const statuses: Array<"All" | ReportStatus> = [
  "All",
  "Draft",
  "Submitted",
  "Queued",
  "Approved",
];

export function ReportHistoryTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ReportStatus>("All");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const reports = useMemo(() => {
    return getSeedReports()
      .filter((report) => {
        const matchesStatus = status === "All" || report.status === status;
        const matchesQuery =
          query.length === 0 ||
          report.reportDate.includes(query) ||
          report.status.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) =>
        sortDirection === "desc"
          ? b.reportDate.localeCompare(a.reportDate)
          : a.reportDate.localeCompare(b.reportDate),
      );
  }, [query, status, sortDirection]);

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reports"
          className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "All" | ReportStatus)}
          className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
        >
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
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
      <div className="mt-5 overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tasks</th>
              <th className="px-4 py-3">Meetings</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-muted/70">
                <td className="px-4 py-4 font-semibold">{report.reportDate}</td>
                <td className="px-4 py-4">{report.status}</td>
                <td className="px-4 py-4">{report.tasks.length}</td>
                <td className="px-4 py-4">{report.meetings.length}</td>
                <td className="px-4 py-4">{new Date(report.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No reports match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Showing {reports.length} of {getSeedReports().length} reports. Pagination contract is ready for server-side data.
      </p>
    </section>
  );
}
