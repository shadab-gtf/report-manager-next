import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { DashboardOverview } from "@/types/dashboard";
import { StatusPill } from "@/components/ui/status-pill";

interface DashboardHeroProps {
  overview: DashboardOverview;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero({ overview }: DashboardHeroProps) {
  const greeting = getGreeting();
  return (
    <section className="rounded border border-border bg-card">
      <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={overview.reportingStatus}>
              {overview.statusLabel}
            </StatusPill>
            <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
              {overview.currentDate}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-normal tracking-tight text-card-foreground">
            {greeting}, {overview.user.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {overview.user.department} workspace with daily reporting, offline
            draft recovery, manager escalation, and email-ready summaries.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {overview.quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded border border-border bg-white px-4 text-sm font-medium text-primary transition-colors hover:bg-primary-light"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-border bg-slate-50 p-6 xl:border-l xl:border-t-0">
          <p className="text-sm font-semibold text-foreground">Today&apos;s command center</p>
          <div className="mt-5 grid gap-3">
            {[
              ["Draft health", "Autosave active every few seconds", CheckCircleIcon],
              ["Manager routing", `Reports route to ${overview.user.reportingManager}`, EnvelopeIcon],
              ["Time capture", "Task hours roll into daily totals", ClockIcon],
            ].map(([title, body, Icon]) => (
              <div key={title as string} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title as string}</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">{body as string}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
