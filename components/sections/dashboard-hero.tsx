import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import type { DashboardOverview } from "@/types/dashboard";
import { StatusPill } from "@/components/ui/status-pill";
import { PlusIcon } from "lucide-react";

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
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-card shadow-md transition-all hover:shadow-lg">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl filter" />
      <div className="grid gap-0 md:grid-cols-2 relative z-10">
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={overview.reportingStatus}>
              {overview.statusLabel}
            </StatusPill>
            <span className="inline-flex items-center text-xs font-semibold text-muted-foreground/80">
              {overview.currentDate}
            </span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {greeting}, <span className="text-primary">{overview.user.name}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Welcome back to your {overview.user.department} workspace. Manage your daily reporting, track your performance, and collaborate with your team efficiently.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {overview.quickActions.map((action, idx) => (
              <Link
                key={action.href}
                href={idx === 1 ? "/reports" : action.href}
                className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold transition-all shadow-sm ${idx === 0
                    ? "bg-[#2563eb] text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
                    : "border border-border bg-white text-foreground hover:border-primary/30 hover:bg-muted hover:-translate-y-0.5"
                  }`}
              >
                {idx === 0 ? <PlusIcon className="h-5 w-5" /> : <DocumentTextIcon className="h-5 w-5 text-muted-foreground" />}
                {action.label}
                {idx === 0 && <ArrowRightIcon className="h-4 w-4 ml-1 opacity-80" />}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center p-8 sm:p-10">
          <div className="relative w-full max-w-[320px] aspect-square transition-transform hover:scale-105 duration-500 ease-out">
            <Image
              src="/task.png"
              alt="Dashboard Task Illustration"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
