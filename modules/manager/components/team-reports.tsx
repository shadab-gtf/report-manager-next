"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardDocumentCheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  EnvelopeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useTeamReports } from "../hooks/use-team-reports";
import { TeamReport, ReviewStatus } from "../types/manager";
import { generateHtmlEmail } from "@/modules/reports/utils/email-template";

type ReportFilter = "All" | "Submitted" | "Late" | "Pending";

export function TeamReports() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Loading workspace...</div>}>
      <TeamReportsContent />
    </Suspense>
  );
}

function TeamReportsContent() {
  const searchParams = useSearchParams();
  const initialOpenId = searchParams.get("open");

  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialOpenId);
  const [sending, setSending] = useState(false);

  const { data: reports = [], isLoading } = useTeamReports();

  const selectedReport = reports.find((r) => r.id === selectedReportId) || (reports.length > 0 ? reports[0] : null);

  useEffect(() => {
    if (initialOpenId) {
      setSelectedReportId(initialOpenId);
    }
  }, [initialOpenId]);

  useEffect(() => {
    if (reports.length > 0 && !selectedReportId) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);

  const handleSendMail = async () => {
    if (!selectedReport) return;
    setSending(true);
    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail: "saurabh.yadav@gtftechnologies.com",
          employeeName: selectedReport.employeeName,
          department: selectedReport.department,
          designation: "Team Specialist",
          managerName: "Saurabh Yadav",
          reportDate: selectedReport.reportDate,
          totalHours: selectedReport.hoursLogged,
          tasks: selectedReport.tasks.map((t) => ({
            description: t.description,
            category: t.category,
            priority: t.priority,
            status: t.status,
            timeSpent: t.timeSpent,
            completion: t.completion,
          })),
          meetings: selectedReport.meetings.map((m) => ({
            subject: m.subject,
            withWhom: m.withWhom,
            time: m.time,
            duration: m.duration,
            type: m.type,
          })),
          pending: selectedReport.notes.pending,
          blockers: selectedReport.notes.blockers,
          tomorrowPlan: selectedReport.notes.tomorrowPlan,
        }),
      });

      if (response.ok) {
        toast.success(`Report email sent successfully to Saurabh Yadav (saurabh.yadav@gtftechnologies.com)!`);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      toast.error("Error sending email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const htmlContent = selectedReport
    ? generateHtmlEmail({
        managerEmail: "",
        employeeName: selectedReport.employeeName,
        department: selectedReport.department,
        designation: "Team Specialist",
        managerName: "Saurabh Yadav",
        reportDate: selectedReport.reportDate,
        totalHours: selectedReport.hoursLogged,
        tasks: selectedReport.tasks,
        meetings: selectedReport.meetings,
        pending: selectedReport.notes.pending,
        blockers: selectedReport.notes.blockers,
        tomorrowPlan: selectedReport.notes.tomorrowPlan,
      })
    : "";

  return (
    <div className="grid gap-6">
      {/* Title Header */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-card-foreground">Team Reports Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review, comment, and sign off on daily reports submitted by your operations team.
        </p>
      </div>

      {/* Grid Layout: Reports list on left, Details workspace on right */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left Side: List of reports */}
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm h-[680px] flex flex-col">
          <h2 className="text-sm font-semibold text-card-foreground pb-3 border-b border-border">
            Submissions ({reports.length})
          </h2>
          <div className="mt-4 flex-1 overflow-y-auto divide-y divide-border pr-1">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Loading reports list...</div>
            ) : reports.length > 0 ? (
              reports.map((report) => {
                const isActive = selectedReportId === report.id || (!selectedReportId && selectedReport?.id === report.id);
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`w-full flex items-center justify-between p-3.5 text-left rounded-lg transition-colors cursor-pointer ${
                      isActive ? "bg-primary-light/40 border-l-4 border-primary" : "hover:bg-muted"
                    }`}
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <p className="font-semibold text-sm text-foreground truncate">{report.employeeName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{report.employeeId}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <CalendarIcon className="h-3 w-3" /> {report.reportDate}
                        </span>
                        <span className="text-[10px] text-muted-foreground">&bull;</span>
                        <span className="text-[10px] text-muted-foreground">{report.submittedAt}</span>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/manager/team/${report.employeeId}/history`}
                        className="rounded border border-border bg-white px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary-light hover:border-primary/20 transition-colors cursor-pointer inline-block"
                      >
                        History
                      </Link>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">No submissions found.</div>
            )}
          </div>
        </section>

        {/* Right Side: Selected report details workspace */}
        <section className="rounded-lg border border-border bg-card shadow-sm h-[680px] flex flex-col overflow-hidden">
          {selectedReport ? (
            <div className="h-full flex flex-col">
              {/* Report Workspace Header */}
              <div className="p-5 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-card-foreground">{selectedReport.employeeName}</h2>
                    <span className="text-xs font-mono text-muted-foreground">({selectedReport.employeeId})</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedReport.department} &bull; Daily Report for {selectedReport.reportDate} (Logged: {selectedReport.hoursLogged} hrs, Completion: {selectedReport.completion}%)
                  </p>
                </div>

                {/* Send Email Action Button */}
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleSendMail}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {sending ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="h-4 w-4" />
                      Send to Mail
                    </>
                  )}
                </button>
              </div>

              {/* Workspace Contents */}
              <div className="flex-1 overflow-y-auto p-5 bg-background/30">
                <div className="flex justify-center h-full">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full h-full min-h-[500px] rounded border border-border bg-white shadow-sm"
                    title="Report Preview Frame"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <ClipboardDocumentCheckIcon className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold">Select a report to view review actions</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
