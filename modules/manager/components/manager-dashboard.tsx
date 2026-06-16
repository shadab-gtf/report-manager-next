"use client";

import Link from "next/link";
import {
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useTeamStats, useRecentSubmissions } from "../hooks/use-team-reports";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function ManagerDashboard() {
  const greeting = getGreeting();
  const { data: stats, isLoading: statsLoading } = useTeamStats();
  const { data: submissions, isLoading: submissionsLoading } = useRecentSubmissions();

  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const metricCards = [
    {
      label: "Team Size",
      value: statsLoading ? "..." : `${stats?.teamSize || 0} Employees`,
      desc: "Direct reports assigned to you",
      icon: UsersIcon,
      color: "text-primary bg-primary-light/50",
      href: "/manager/team",
    },
    {
      label: "Today's Reports",
      value: statsLoading ? "..." : `${stats?.submittedToday || 0} Submitted`,
      desc: `${stats?.pendingToday || 0} pending review`,
      icon: ClipboardDocumentCheckIcon,
      color: "text-success bg-success-light",
      href: "/manager/reports",
    },
    {
      label: "Missing Reports",
      value: statsLoading ? "..." : `${stats?.missingToday || 0} Missing`,
      desc: "Required submissions missing today",
      icon: ExclamationTriangleIcon,
      color: "text-danger bg-danger-light",
      href: "/manager/missing-reports",
    },
  ];

  return (
    <div className="grid gap-6">
      {/* Hero Welcome */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">
            Overview
          </span>
          <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
            {currentDate}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-card-foreground">
          {greeting}, Saurabh Yadav
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your operations team reporting, view compliance statistics, and review daily submissions.
        </p>
      </section>

      {/* Metrics Grid */}
      <section aria-label="Team metrics" className="grid gap-4 md:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-semibold text-card-foreground">{card.value}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.desc}</p>
                <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Double Column Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Left Column: Recent Activity */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-card-foreground">Last Submission Activity</h2>
            <Link
              href="/manager/reports"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View all reports <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 divide-y divide-border">
            {submissionsLoading ? (
              <div className="py-4 text-sm text-muted-foreground text-center">Loading recent submissions...</div>
            ) : submissions && submissions.length > 0 ? (
              submissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground">{sub.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{sub.employeeId} &bull; {sub.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      sub.status === "Missing"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                      }`}>
                      {sub.status}
                    </span>
                    <Link
                      href={`/manager/reports?open=${sub.id}`}
                      className="rounded border border-border bg-white px-3 py-1 text-xs font-medium text-primary hover:bg-primary-light"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-sm text-muted-foreground text-center">No reports submitted today.</div>
            )}
          </div>
        </section>

        {/* Right Column: Quick Actions */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Quick Management</h2>
            <p className="text-xs text-muted-foreground mt-1">Shortcuts to operations workspace panels</p>

            <div className="mt-6 grid gap-3">
              <Link
                href="/manager/team"
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">My Team</p>
                  <p className="text-xs text-muted-foreground mt-0.5">8 active team members assigned</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>

              <Link
                href="/manager/reports"
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Reports Center</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Review, approve and comment</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>

              <Link
                href="/manager/missing-reports"
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Compliance Track</p>
                  <p className="text-xs text-muted-foreground mt-0.5">List of missing submissions</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>

              <Link
                href="/manager/analytics"
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Team Analytics</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Submission trends and stats</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">Report Manager &bull; Operations Portal</p>
          </div>
        </section>
      </div>
    </div>
  );
}
