"use client";

import { generateHtmlEmail } from "@/modules/reports/utils/email-template";
import type { DailyReportDraft } from "@/types/report";

interface PreviewAndSubmitStepProps {
  draft: DailyReportDraft;
  totalHours: number;
  employeeName: string;
  managerName: string;
}

export function PreviewAndSubmitStep({
  draft,
  totalHours,
  employeeName,
  managerName,
}: PreviewAndSubmitStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-wrap items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-foreground">
          Email Report Preview
        </h2>
      </div>
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-muted/20 p-4 flex justify-center">
        <ReportPreview
          draft={draft}
          totalHours={totalHours}
          employeeName={employeeName}
          managerName={managerName}
        />
      </div>
    </div>
  );
}

function ReportPreview({
  draft,
  totalHours,
  employeeName,
  department = "Technology",
  designation = "Software Engineer",
  managerName,
}: {
  draft: DailyReportDraft;
  totalHours: number;
  employeeName: string;
  department?: string;
  designation?: string;
  managerName: string;
}) {
  const htmlContent = generateHtmlEmail({
    managerEmail: "",
    employeeName,
    department,
    designation,
    managerName,
    reportDate: draft.reportDate,
    totalHours,
    tasks: draft.tasks,
    meetings: draft.meetings,
    pending: draft.notes.pending,
    blockers: draft.notes.blockers,
    tomorrowPlan: draft.notes.tomorrowPlan,
  });

  return (
    <div className="w-full max-w-[700px] overflow-hidden rounded-lg border border-border shadow-sm bg-white">
      <iframe
        srcDoc={htmlContent}
        className="w-full min-w-[320px] max-w-[700px] h-[700px] border-none"
        title="Email Preview"
      />
    </div>
  );
}
