import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/sections/app-shell";

export const metadata: Metadata = {
  title: "Reports",
};

const reportLinks = [
  {
    href: "/reports/create",
    title: "Create daily report",
    description: "Multi-step task, meeting, notes, preview, and submit flow.",
  },
  {
    href: "/reports/drafts",
    title: "Recover drafts",
    description: "IndexedDB-backed autosaved drafts and queued submissions.",
  },
  {
    href: "/reports/history",
    title: "Report history",
    description: "Search, filter, sort, and review submitted reports.",
  },
];

export default function ReportsPage() {
  return (
    <AppShell activeSegment="reports">
      <section className="grid gap-4 md:grid-cols-3">
        {reportLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:bg-primary-light/20"
          >
            <h1 className="text-xl font-semibold text-card-foreground">
              {item.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
