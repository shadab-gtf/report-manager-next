"use client";

import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ExclamationCircleIcon, BellIcon } from "@heroicons/react/24/outline";
import { useMissingReports } from "../hooks/use-manager-analytics";
import { MissingReport } from "../types/manager";

const columnHelper = createColumnHelper<MissingReport>();

export function MissingReportsTable() {
  const [filter, setFilter] = useState<"Today" | "7Days" | "30Days">("Today");

  const { data: missingReports = [], isLoading } = useMissingReports(filter);

  const columns = useMemo(
    () => [
      columnHelper.accessor("employeeName", {
        header: "Employee Name",
        cell: (info) => (
          <div>
            <p className="font-semibold text-foreground">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground font-mono">{info.row.original.employeeId}</p>
          </div>
        ),
      }),
      columnHelper.accessor("department", {
        header: "Department",
        cell: (info) => <span className="text-sm font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("daysMissed", {
        header: "Days Missed",
        cell: (info) => {
          const days = info.getValue();
          return (
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                days >= 5
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : days >= 3
                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
              }`}
            >
              {days} {days === 1 ? "day" : "days"} missed
            </span>
          );
        },
      }),
      columnHelper.accessor("lastSubmission", {
        header: "Last Submission",
        cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Remind",
        cell: () => (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                import("sonner").then(({ toast }) => {
                  toast.success("Reminder notification sent successfully to employee.");
                });
              }
            }}
            className="inline-flex items-center gap-1 rounded border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light transition-colors"
          >
            <BellIcon className="h-3.5 w-3.5" />
            Nudge
          </button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: missingReports,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="grid gap-6">
      {/* Title block */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex items-start gap-4">
        <div className="rounded-full bg-danger-light p-3 text-danger shrink-0">
          <ExclamationCircleIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">Missing Reports Tracker</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track which team members have missed daily submissions and nudge them to update.
          </p>
        </div>
      </div>

      {/* Filter range selector */}
      <div className="flex rounded-md border border-border bg-card p-1 shadow-sm w-fit">
        {(["Today", "7Days", "30Days"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setFilter(range)}
            className={`rounded px-4 py-2 text-xs font-semibold transition-colors ${
              filter === range
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {range === "Today" ? "Missing Today" : range === "7Days" ? "Last 7 Days" : "Last 30 Days"}
          </button>
        ))}
      </div>

      {/* Missing reports table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-3.5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Loading missing reports logs...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Perfect Compliance! No missing reports in the selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
