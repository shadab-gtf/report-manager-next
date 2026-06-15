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

export function DashboardHero({ overview }: DashboardHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={overview.reportingStatus}>
              {overview.statusLabel}
            </StatusPill>
            <span className="inline-flex min-h-8 items-center rounded-full bg-muted px-3 text-xs font-semibold text-muted-foreground">
              {overview.currentDate}
            </span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-normal text-card-foreground md:text-5xl">
            Good morning, {overview.user.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
            {overview.user.department} workspace with daily reporting, offline
            draft recovery, manager escalation, and email-ready summaries.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {overview.quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-light/35 hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                  {action.label}
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">
                  {action.description}
                </span>
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
