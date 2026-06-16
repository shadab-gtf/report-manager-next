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
      <div className="grid gap-0 xl:grid-cols-[1fr]">
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

      </div>
    </section>
  );
}
