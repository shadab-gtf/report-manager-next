"use client";

import Dexie, { type Table } from "dexie";
import type { DailyReportDraft } from "@/types/report";

class ReportManagerDb extends Dexie {
  drafts!: Table<DailyReportDraft, string>;
  queue!: Table<DailyReportDraft, string>;

  constructor() {
    super("report-manager-db");
    this.version(1).stores({
      drafts: "id, employeeId, reportDate, status, updatedAt",
      queue: "id, employeeId, reportDate, status, updatedAt",
    });
  }
}

export const reportDb = new ReportManagerDb();
