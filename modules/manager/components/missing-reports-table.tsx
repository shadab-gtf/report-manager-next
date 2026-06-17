"use client";

import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ExclamationCircleIcon, EnvelopeIcon, CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMissingReports } from "../hooks/use-manager-analytics";
import { MissingReport } from "../types/manager";
import type { DatePreset } from "../services/manager-service";
import Link from "next/link";
import { PageTransition } from "@/components/motion/page-transition";
import { AnimatedTabs } from "@/components/motion/animated-tabs";

const DATE_PRESETS: Array<{ key: DatePreset; label: string }> = [
  { key: "Today", label: "Today" },
  { key: "7Days", label: "7 Days" },
  { key: "10Days", label: "10 Days" },
  { key: "15Days", label: "15 Days" },
  { key: "30Days", label: "30 Days" },
  { key: "Custom", label: "Custom Date" },
];

interface CustomDateRangeProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  onClose: () => void;
}

function CustomDateRange({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClose,
}: CustomDateRangeProps) {
  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Start date"
      />
      <span className="text-xs text-muted-foreground">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="End date"
      />
      <button
        type="button"
        onClick={onClose}
        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        aria-label="Clear custom date"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

const columnHelper = createColumnHelper<MissingReport>();

export function MissingReportsTable() {
  const [filter, setFilter] = useState<DatePreset>("Today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const customRange = filter === "Custom" && customStart && customEnd
    ? { start: customStart, end: customEnd }
    : undefined;

  const { data: missingReports = [], isLoading } = useMissingReports(filter, customRange);

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
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${days >= 5
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
        cell: (info) => {
          const row = info.row.original;
          const mockEmail = `${row.employeeName.toLowerCase().replace(/\s+/g, ".")}@company.com`;
          const subject = encodeURIComponent("Action Required: Missing Daily Reports");
          const body = encodeURIComponent(
            `Hi ${row.employeeName},\n\nJust a gentle reminder to submit your daily reports. Our records show you have missed ${row.daysMissed} day(s).\n\nPlease update them as soon as possible.\n\nThanks!`
          );

          return (
            <Link
              href={`mailto:${mockEmail}?subject=${subject}&body=${body}`}
              className="inline-flex items-center gap-1 rounded border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light transition-colors"
            >
              <EnvelopeIcon className="h-3.5 w-3.5" />
              Nudge
            </Link>
          );
        },
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
    <PageTransition className="grid gap-6">
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
      <div className="flex flex-wrap items-center gap-2">
        <AnimatedTabs
          tabs={DATE_PRESETS.map((preset) => ({
            id: preset.key,
            label: (
              <>
                {preset.key === "Custom" && (
                  <CalendarDaysIcon className="mr-1 inline h-3.5 w-3.5 -mt-px" />
                )}
                {preset.label}
              </>
            ),
          }))}
          activeTab={filter}
          onTabChange={(tab) => setFilter(tab as DatePreset)}
          layoutId="missing-reports-date-filter"
          className="flex flex-wrap items-center gap-2"
          tabClassName="relative rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer border border-border bg-card hover:border-primary/30 focus:outline-none"
          activeTabClassName="text-white border-transparent bg-transparent"
          indicatorClassName="absolute inset-0 rounded-full bg-primary shadow-sm"
        />

        {filter === "Custom" && (
          <CustomDateRange
            startDate={customStart}
            endDate={customEnd}
            onStartChange={setCustomStart}
            onEndChange={setCustomEnd}
            onClose={() => setFilter("Today")}
          />
        )}
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
    </PageTransition>
  );
}
