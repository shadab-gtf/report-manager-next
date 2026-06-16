"use client";

import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useTeamMember, useMemberReportHistory } from "../hooks/use-team";

interface EmployeeDetailProps {
  employeeId: string;
}

export function EmployeeDetail({ employeeId }: EmployeeDetailProps) {
  const { data: member, isLoading: memberLoading } = useTeamMember(employeeId);
  const { data: history = [], isLoading: historyLoading } = useMemberReportHistory(employeeId, "7Days");

  if (memberLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Loading employee information...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Employee details not found.
      </div>
    );
  }

  const profileFields = [
    { label: "Employee ID", value: member.employeeId },
    { label: "Name", value: member.name },
    { label: "Email Address", value: member.email },
    { label: "Department", value: member.department },
    { label: "Designation", value: member.designation },
    { label: "Joining Date", value: member.joiningDate },
    { label: "Reporting Manager", value: member.reportingManager },
  ];

  const statCards = [
    { label: "Total Reports Expected", value: member.totalReports, color: "text-foreground" },
    { label: "Submitted On Time", value: member.submittedOnTime, color: "text-success" },
    { label: "Late Submissions", value: member.lateReports, color: "text-warning" },
    { label: "Missed Reports", value: member.missedReports, color: "text-danger" },
  ];

  return (
    <div className="grid gap-6">
      {/* Header Back Link */}
      <div className="flex items-center gap-3">
        <Link
          href="/manager/team"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:bg-muted"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">Employee Profile Details</h1>
          <p className="text-xs text-muted-foreground">GTF Team Member Workspace</p>
        </div>
      </div>

      {/* Info & Stats Double Grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Profile Card */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-card-foreground border-b border-border pb-3">
            Employee Information
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.label} className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs font-semibold text-muted-foreground">{field.label}</p>
                <p className="mt-1.5 text-sm font-semibold text-foreground">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance Circle Chart */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full text-left">
            <h2 className="text-base font-semibold text-card-foreground">Compliance Rating</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Overall submission efficiency</p>
          </div>

          <div className="relative my-6 flex h-36 w-36 items-center justify-center rounded-full border-8 border-muted">
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{member.complianceRate}%</span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-0.5">Compliance</p>
            </div>
            <svg className="absolute -inset-2 h-40 w-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="transparent"
                stroke="#1a73e8"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 72}`}
                strokeDashoffset={`${2 * Math.PI * 72 * (1 - member.complianceRate / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>

          <div className="w-full border-t border-border pt-4 text-center">
            <span className={`text-xs font-semibold ${
              member.complianceRate >= 95 ? "text-success" : member.complianceRate >= 85 ? "text-primary" : "text-danger"
            }`}>
              {member.complianceRate >= 95 ? "High Compliance Standard" : member.complianceRate >= 85 ? "Good Compliance" : "Requires Support/Audit"}
            </span>
          </div>
        </section>
      </div>

      {/* Reporting Statistics */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-card-foreground">Submission Statistics</h2>
        <div className="mt-5 grid gap-4 grid-cols-2 md:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-background p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className={`mt-2 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent History Table */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-card-foreground">Recent Reports (Last 7 Days)</h2>
          <Link
            href={`/manager/team/${employeeId}/history`}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Full History <ClipboardDocumentListIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Hours Logged</th>
                  <th className="px-5 py-3">Completion</th>
                  <th className="px-5 py-3">Review Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-4 text-center text-xs text-muted-foreground">
                      Loading history...
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.slice(0, 5).map((rep) => (
                    <tr key={rep.id} className="hover:bg-muted/30">
                      <td className="px-5 py-3.5 font-medium">{rep.reportDate}</td>
                      <td className="px-5 py-3.5">{rep.hoursLogged} hrs</td>
                      <td className="px-5 py-3.5">{rep.completion}%</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          rep.reviewStatus === "reviewed"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : rep.reviewStatus === "follow_up"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {rep.reviewStatus === "reviewed" ? "Reviewed" : rep.reviewStatus === "follow_up" ? "Follow Up" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/manager/reports?open=${rep.id}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-4 text-center text-xs text-muted-foreground">
                      No reports found for the last 7 days.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
