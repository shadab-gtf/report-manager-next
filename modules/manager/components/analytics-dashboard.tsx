"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { AnimatedTabs } from "@/components/motion/animated-tabs";
import {
  useComplianceTrend,
  useFrequentMissers,
  useMostConsistent,
} from "../hooks/use-manager-analytics";

const ComplianceTrendChart = dynamic(() => import("./compliance-trend-chart"), {
  ssr: false,
  loading: () => <div className="h-[320px] flex items-center justify-center text-xs text-muted-foreground bg-muted/20 rounded">Loading compliance chart...</div>,
});

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

const DATE_PRESETS = [
  { key: "Today", label: "Today" },
  { key: 7, label: "7 Days" },
  { key: 10, label: "10 Days" },
  { key: 15, label: "15 Days" },
  { key: 30, label: "30 Days" },
] as const;

export function AnalyticsDashboard() {
  const [daysCount, setDaysCount] = useState<"Today" | 7 | 10 | 15 | 30>(7);

  const apiDaysCount = daysCount === "Today" ? 1 : daysCount;
  const { data: trendData = [], isLoading: trendLoading } = useComplianceTrend(apiDaysCount);
  const { data: missers = [], isLoading: missersLoading } = useFrequentMissers();
  const { data: consistent = [], isLoading: consistentLoading } = useMostConsistent();

  const [consistentSearch, setConsistentSearch] = useState("");
  const [missersSearch, setMissersSearch] = useState("");

  const filteredConsistent = consistent.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(consistentSearch.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(consistentSearch.toLowerCase()) ||
      item.department.toLowerCase().includes(consistentSearch.toLowerCase())
  );

  const filteredMissers = missers.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(missersSearch.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(missersSearch.toLowerCase()) ||
      item.department.toLowerCase().includes(missersSearch.toLowerCase())
  );

  const totalExpected = trendData.reduce((acc, curr) => acc + curr.expected, 0);
  const totalSubmitted = trendData.reduce((acc, curr) => acc + curr.submitted, 0);
  const complianceRate = Math.round((totalSubmitted / totalExpected) * 100) || 94;

  return (
    <div className="grid gap-6">
      {/* Title */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
          <ChartBarIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manager Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Analyze submission trends, view consistency leaderboards, and identify reporting gaps.
          </p>
        </div>
      </div>

      {/* Stats Summary Panel
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Expected Submissions</p>
            <div className="rounded-full bg-primary-light p-2 text-primary">
              <CalendarIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">{trendLoading ? "..." : totalExpected}</p>
          <p className="mt-1 text-xs text-muted-foreground">Expected report count {daysCount === "Today" ? "Today" : `in past ${daysCount} days`}</p>
        </article>

        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Submitted Submissions</p>
            <div className="rounded-full bg-success-light p-2 text-success">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">{trendLoading ? "..." : totalSubmitted}</p>
          <p className="mt-1 text-xs text-muted-foreground">Successfully logged and synced reports</p>
        </article>

        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Period Compliance Rate</p>
            <div className="rounded-full bg-warning-light p-2 text-warning">
              <ChartBarIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-foreground">{trendLoading ? "..." : `${complianceRate}%`}</p>
          <p className="mt-1 text-xs text-muted-foreground">Average completion rate for this timeframe</p>
        </article>
      </section>
      */}

      {/* Chart Section */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              Submission Compliance Trend
              <InformationCircleIcon className="h-4 w-4 text-slate-400" />
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Interactive submission logs timeline</p>
          </div>
          
          <div className="flex rounded-lg border border-slate-200 bg-white shadow-sm p-1">
            <AnimatedTabs
              tabs={DATE_PRESETS.map((preset) => ({
                id: String(preset.key),
                label: preset.label,
              }))}
              activeTab={String(daysCount)}
              onTabChange={(tab) => setDaysCount(tab === "Today" ? "Today" : Number(tab) as any)}
              layoutId="analytics-date-filter"
              className="flex items-center"
              tabClassName="relative rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer text-slate-600 hover:text-slate-900 focus:outline-none"
              activeTabClassName="text-white bg-transparent"
              indicatorClassName="absolute inset-0 rounded-md bg-primary shadow-sm"
            />
          </div>
        </div>

        <ComplianceTrendChart data={trendData} />
      </section>

      {/* Leaderboard Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Most Consistent */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              Most Consistent Employees
            </h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={consistentSearch}
                onChange={(e) => setConsistentSearch(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {consistentLoading ? (
              <div className="py-4 text-center text-xs text-slate-500">Loading roster...</div>
            ) : filteredConsistent.length > 0 ? (
              filteredConsistent.map((item, idx) => (
                <Link
                  key={item.employeeId}
                  href={`/manager/team/${item.employeeId}/history?tab=submitted`}
                  className="flex items-center justify-between py-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs font-bold text-slate-900">#{idx + 1}</span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(
                        item.employeeName
                      )}`}
                    >
                      {getInitials(item.employeeName)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{item.employeeName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.employeeId} &bull; {item.department}</p>
                    </div>
                  </div>
                  <span className="rounded bg-green-50 px-2 py-1 text-[11px] font-bold text-green-700">
                    {item.complianceRate}% Compliance
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">No consistency records found.</div>
            )}
          </div>
          
          <Link href="/manager/team" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-2">
            View full leaderboard <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </section>

        {/* Frequent Missed Reports */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
                <ExclamationTriangleIcon className="h-5 w-5" />
              </div>
              Frequent Missed Reports
            </h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={missersSearch}
                onChange={(e) => setMissersSearch(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none bg-slate-50 focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {missersLoading ? (
              <div className="py-4 text-center text-xs text-slate-500">Loading roster...</div>
            ) : filteredMissers.length > 0 ? (
              filteredMissers.map((item, idx) => (
                <Link
                  key={item.employeeId}
                  href={`/manager/team/${item.employeeId}/history?tab=missed`}
                  className="flex items-center justify-between py-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs font-bold text-slate-900">#{idx + 1}</span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(
                        item.employeeName
                      )}`}
                    >
                      {getInitials(item.employeeName)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{item.employeeName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.employeeId} &bull; {item.department}</p>
                    </div>
                  </div>
                  <span className="rounded bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600">
                    {item.missCount} days missed
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">All employees are fully compliant!</div>
            )}
          </div>
          
          <Link href="/manager/missing" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-2">
            View all missed reports <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </section>
      </div>
    </div>
  );
}
