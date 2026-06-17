"use client";

import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ExclamationCircleIcon, 
  EnvelopeIcon, 
  CalendarDaysIcon, 
  XMarkIcon,
  BellAlertIcon,
  ChevronUpDownIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  BriefcaseIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-blue-100 text-blue-700",
    "bg-red-100 text-red-700",
    "bg-primary-light text-primary",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
};

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
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            EMPLOYEE NAME
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => {
          const name = info.getValue();
          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(
                  name
                )}`}
              >
                {getInitials(name)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{info.row.original.employeeId}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("department", {
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            DEPARTMENT
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => {
          const dept = info.getValue();
          return (
            <span className="text-sm font-medium text-slate-700">{dept}</span>
          );
        },
      }),
      columnHelper.accessor("daysMissed", {
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            DAYS MISSED
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => {
          const days = info.getValue();
          return (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-100">
              <ExclamationCircleIcon className="h-3.5 w-3.5" />
              {days} {days === 1 ? "day" : "days"} missed
            </div>
          );
        },
      }),
      columnHelper.accessor("lastSubmission", {
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            LAST SUBMISSION
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <ClockIcon className="h-4 w-4 opacity-70" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => (
          <div className="text-[11px] font-bold text-slate-500">REMIND</div>
        ),
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
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-slate-50 transition-colors"
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
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <BellAlertIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Missing Reports Tracker</h1>
          <p className="mt-1 text-sm text-slate-500">
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
              <div className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-3.5 w-3.5" />
                {preset.label}
              </div>
            ),
          }))}
          activeTab={filter}
          onTabChange={(tab) => setFilter(tab as DatePreset)}
          layoutId="missing-reports-date-filter"
          className="flex flex-wrap items-center gap-2"
          tabClassName="relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border border-slate-200 bg-white hover:border-primary/30 focus:outline-none"
          activeTabClassName="text-white border-transparent bg-transparent"
          indicatorClassName="absolute inset-0 rounded-lg bg-primary shadow-sm"
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
