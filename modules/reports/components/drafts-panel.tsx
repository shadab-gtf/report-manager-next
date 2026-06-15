"use client";

import { useEffect, useState } from "react";
import { reportDb } from "@/modules/reports/services/report-db";
import type { DailyReportDraft } from "@/types/report";

export function DraftsPanel() {
  const [drafts, setDrafts] = useState<DailyReportDraft[]>([]);

  useEffect(() => {
    reportDb.drafts.toArray().then(setDrafts);
  }, []);

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-card-foreground">Draft Recovery</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Drafts are stored in IndexedDB and can be recovered after refresh or offline sessions.
      </p>
      <div className="mt-6 grid gap-3">
        {drafts.map((draft) => (
          <article key={draft.id} className="rounded-lg border border-border bg-background p-4">
            <p className="font-semibold text-foreground">{draft.reportDate}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {draft.tasks.length} tasks · {draft.meetings.length} meetings · {draft.status}
            </p>
          </article>
        ))}
        {drafts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="font-semibold text-foreground">No local drafts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a report and autosave will populate this recovery list.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
