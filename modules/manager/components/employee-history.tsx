"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, BellAlertIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTeamMember, useMemberReportHistory } from "../hooks/use-team";
import { toast } from "sonner";
import { PageTransition } from "@/components/motion/page-transition";
import { AnimatedTabs } from "@/components/motion/animated-tabs";
import { FadeIn } from "@/components/motion/fade-in";

interface EmployeeHistoryProps {
  employeeId: string;
  initialTab?: "submitted" | "missed";
}

type DaysFilter = "Today" | "7Days" | "10Days" | "15Days" | "30Days" | "Custom";

export function EmployeeHistory({ employeeId, initialTab = "submitted" }: EmployeeHistoryProps) {
  const [filter, setFilter] = useState<DaysFilter>("30Days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState<"submitted" | "missed">(initialTab);
  const [nudgingDate, setNudgingDate] = useState<string | null>(null);

  const { data: member, isLoading: memberLoading } = useTeamMember(employeeId);
  const { data: history = [], isLoading: historyLoading } = useMemberReportHistory(
    employeeId,
    filter,
    filter === "Custom" ? { start: startDate, end: endDate } : undefined
  );

  if (memberLoading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading member info...</div>;
  }

  if (!member) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Member not found.</div>;
  }

  // Helper to check if a date is a weekday (Mon-Fri)
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // Helper to format date as YYYY-MM-DD in local time
  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getRangeDates = () => {
    const dates: string[] = [];
    const now = new Date();

    if (filter === "Today") {
      dates.push(formatDateLocal(now));
      return dates;
    }

    if (filter === "Custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const temp = new Date(start);
      while (temp <= end) {
        dates.push(formatDateLocal(temp));
        temp.setDate(temp.getDate() + 1);
      }
      return dates;
    }

    let limit = 30;
    if (filter === "7Days") limit = 7;
    else if (filter === "10Days") limit = 10;
    else if (filter === "15Days") limit = 15;

    for (let i = 0; i < limit; i++) {
      const temp = new Date();
      temp.setDate(now.getDate() - i);
      dates.push(formatDateLocal(temp));
    }
    return dates;
  };

  const missedDates = getRangeDates()
    .filter((dateStr) => {
      const d = new Date(dateStr);
      if (!isWeekday(d)) return false;

      const todayStr = formatDateLocal(new Date());
      if (dateStr > todayStr) return false;

      const hasReport = history.some((r) => r.reportDate === dateStr);
      return !hasReport;
    })
    .sort((a, b) => b.localeCompare(a));

  const handleNudge = async (date: string) => {
    setNudgingDate(date);
    try {
      const response = await fetch("/api/send-nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeEmail: member.email,
          employeeName: member.name,
          date,
        }),
      });

      if (response.ok) {
        toast.success(`Email reminder sent to ${member.name} (${member.email}) for missing report on ${date}!`);
      } else {
        throw new Error("Failed to send email nudge");
      }
    } catch (err) {
      toast.error("Error sending email nudge. Please try again.");
    } finally {
      setNudgingDate(null);
    }
  };

  return (
    <PageTransition className="grid gap-6">
      {/* Back Link */}
      <div className="flex items-center gap-3">
        <Link
          href={`/manager/team/${employeeId}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:bg-muted"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">{member.name}'s Report History</h1>
          <p className="text-xs text-muted-foreground">Browse submitted reports for Today, the past 30 days, or a custom range</p>
        </div>
      </div>

      {/* Time Filters & Custom Range Selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2 rounded-md border border-border bg-card p-1 shadow-sm w-fit">
          {(["Today", "7Days", "10Days", "15Days", "30Days", "Custom"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`rounded px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${filter === opt
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              {opt === "Today"
                ? "Today"
                : opt === "7Days"
                  ? "7 Days"
                  : opt === "10Days"
                    ? "10 Days"
                    : opt === "15Days"
                      ? "15 Days"
                      : opt === "30Days"
                        ? "30 Days"
                        : "Custom Date"}
            </button>
          ))}
        </div>

        {filter === "Custom" && (
          <div className="flex items-center gap-3 bg-card border border-border rounded-md px-3 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <label htmlFor="start-date" className="text-xs font-semibold text-muted-foreground">Start:</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs border border-input rounded px-2 py-1 outline-none bg-background focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="end-date" className="text-xs font-semibold text-muted-foreground">End:</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs border border-input rounded px-2 py-1 outline-none bg-background focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="w-full -mb-6 relative z-10">
        <AnimatedTabs
          tabs={[
            { id: "submitted", label: `Submitted Reports (${historyLoading ? "..." : history.length})` },
            { id: "missed", label: `Missed Days (${historyLoading ? "..." : missedDates.length})` },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          layoutId="history-tabs"
          className="flex border-b border-border bg-card rounded-t-lg px-4 pt-2 shadow-sm"
          tabClassName="px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer relative"
          activeTabClassName="text-primary font-bold"
          indicatorClassName="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-none shadow-none"
        />
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          {activeTab === "submitted" ? (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Submission Status</th>
                  <th className="px-5 py-3.5">Hours Logged</th>
                  <th className="px-5 py-3.5">Completion</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      Loading report logs...
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.map((rep) => (
                    <tr key={rep.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-foreground">{rep.reportDate}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          Submitted
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium">{rep.hoursLogged} hrs</td>
                      <td className="px-5 py-4">{rep.completion}%</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/manager/reports?open=${rep.id}`}
                          className="rounded border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
                        >
                          Open Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                      No reports submitted in the selected range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-5 py-3.5">Missed Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyLoading ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      Analyzing submission dates...
                    </td>
                  </tr>
                ) : missedDates.length > 0 ? (
                  missedDates.map((date) => (
                    <tr key={date} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-foreground">{date}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          Missed Report
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleNudge(date)}
                          disabled={nudgingDate !== null}
                          className="rounded border border-red-200 bg-red-50 hover:bg-red-100/60 disabled:opacity-50 px-3 py-1.5 text-xs font-semibold text-red-700 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                        >
                          {nudgingDate === date ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5 text-red-700" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <EnvelopeIcon className="h-3.5 w-3.5" /> Send Email Reminder
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                      All report dates in the selected range are fully compliant!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
