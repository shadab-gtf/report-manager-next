"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useReportDraft } from "@/modules/reports/hooks/use-report-draft";
import { useAppSelector } from "@/store/hooks";
import { TaskLogStep } from "./report-builder/task-log-step";
import { MeetingsStep } from "./report-builder/meetings-step";
import { EodNotesStep } from "./report-builder/eod-notes-step";
import { PreviewAndSubmitStep } from "./report-builder/preview-and-submit-step";
import type { EndOfDayNotes } from "@/types/report";
import { toast } from "sonner";
import { EnvelopeIcon, PaperAirplaneIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

const steps = [
  { label: "Task Log", subtitle: "What you worked on" },
  { label: "Meetings & Calls", subtitle: "Meetings & discussions" },
  { label: "End of Day Notes", subtitle: "Summary & plan" },
  { label: "Preview", subtitle: "Review & submit" },
];

export function ReportBuilder() {
  const [step, setStep] = useState(0);
  const session = useAppSelector((state) => state.auth.session);
  const {
    draft,
    setDraft,
    isLoaded,
    isOnline,
    lastSavedAt,
    totalHours,
    updateTask,
    addTask,
    removeTask,
    updateMeeting,
    addMeeting,
    removeMeeting,
    submitReport,
  } = useReportDraft();

  const managerEmail = "saurabh.yadav@gtftechnologies.com";
  const managerName = "Saurabh Yadav";
  
  const emailSubject = `Daily Report - ${draft.reportDate}`;
    
  const employeeName = session?.name || "Kuldeep";

  const [isEmailing, setIsEmailing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  async function handleSubmit() {
    setIsEmailing(true);
    setEmailStatus(null);
    if (isOnline) {
      try {
        const response = await fetch("/api/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            managerEmail,
            employeeName,
            department: "Technology",
            designation: "Software Engineer",
            managerName,
            reportDate: draft.reportDate,
            totalHours,
            tasks: draft.tasks,
            meetings: draft.meetings,
            pending: draft.notes.pending,
            blockers: draft.notes.blockers,
            tomorrowPlan: draft.notes.tomorrowPlan,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send");
        }

        toast.success("Report Submitted Successfully", {
          description: `Your report has been logged and sent to ${managerName}.`,
        });
        await submitReport();
      } catch (error) {
        toast.error("Submission Failed", {
          description: "Failed to send the HTML email template. Please try again.",
        });
      } finally {
        setIsEmailing(false);
      }
    } else {
      try {
        await submitReport();
        toast.warning("Report Saved Offline", {
          description: "Your report has been queued and will sync when online.",
        });
      } catch (error) {
        toast.error("Offline Save Failed", {
          description: "Failed to queue the report offline. Please try again.",
        });
      } finally {
        setIsEmailing(false);
      }
    }
  }

  if (!isLoaded) {
    return (
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="h-8 w-64 animate-pulse rounded-md bg-skeleton" />
        <div className="mt-6 h-64 animate-pulse rounded-md bg-skeleton" />
      </section>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Daily Report
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircleIcon className="h-4 w-4" />
              <span className="font-medium">Autosave active</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              <span>{lastSavedAt ? `Saved just now` : "Preparing draft"}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={step !== 3 || isEmailing}
          className="min-h-11 rounded-md bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-sm"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
          {isEmailing ? "Submitting..." : "Preview & Submit"}
        </button>
      </div>

      <section className="rounded-xl border border-border bg-card shadow-sm mb-6 overflow-hidden">
        <div className="flex overflow-x-auto items-center px-2 py-3 scrollbar-hide">
          {steps.map((s, index) => (
            <div key={s.label} className="flex items-center shrink-0 min-w-max">
              <button
                type="button"
                onClick={() => setStep(index)}
                className={`relative flex items-center gap-3 text-left focus:outline-none px-4 py-3 transition-colors ${
                  index === step ? "" : "opacity-60 hover:opacity-100"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    index === step
                      ? "bg-blue-50 text-[#2563eb]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="flex flex-col">
                  <span
                    className={`text-sm font-bold ${
                      index === step ? "text-[#2563eb]" : "text-card-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className={`text-xs font-medium ${index === step ? "text-[#2563eb]/70" : "text-muted-foreground"}`}>
                    {s.subtitle}
                  </span>
                </span>
                {index === step && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]" />
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className="px-6 flex items-center justify-center">
                  <div className="h-px bg-border w-8" />
                  <ChevronRightIcon className="h-4 w-4 text-border -ml-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">

      {/* Step Renderers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="mt-6"
        >
          {step === 0 && (
            <TaskLogStep
              tasks={draft.tasks}
              updateTask={updateTask}
              addTask={addTask}
              removeTask={removeTask}
            />
          )}

          {step === 1 && (
            <MeetingsStep
              meetings={draft.meetings}
              updateMeeting={updateMeeting}
              addMeeting={addMeeting}
              removeMeeting={removeMeeting}
            />
          )}

          {step === 2 && (
            <EodNotesStep
              notes={draft.notes}
              onChange={(updatedNotes: EndOfDayNotes) =>
                setDraft((current) => ({
                  ...current,
                  notes: updatedNotes,
                }))
              }
            />
          )}

          {step === 3 && (
            <PreviewAndSubmitStep
              draft={draft}
              totalHours={totalHours}
              employeeName={employeeName}
              managerName={managerName}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Wizard Footer Nav */}
      <div className="mt-8 flex justify-between border-t border-border pt-6">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer shadow-sm transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}
            className="flex min-h-11 items-center gap-2 rounded-md bg-[#2563eb] px-5 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
          >
            Next: {steps[step + 1].label}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isEmailing}
            className="min-h-11 rounded-md bg-[#2563eb] px-6 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-sm transition-colors"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {isEmailing ? "Submitting..." : "Submit Daily Report"}
          </button>
        )}
      </div>
      </section>
    </>
  );
}
