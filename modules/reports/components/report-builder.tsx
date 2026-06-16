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
import { useNotificationStore } from "@/modules/notifications/store/notification-store";
import { EnvelopeIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const steps = ["Task Log", "Meetings & Calls", "EOD Notes", "Preview"];

export function ReportBuilder() {
  const [step, setStep] = useState(0);
  const session = useAppSelector((state) => state.auth.session);
  const addNotification = useNotificationStore((state) => state.addNotification);
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

        addNotification({
          title: "Report Submitted Successfully",
          message: `Your report has been logged and sent to ${managerName}.`,
          tone: "success",
        });
        await submitReport();
      } catch (error) {
        addNotification({
          title: "Submission Failed",
          message: "Failed to send the HTML email template. Please try again.",
          tone: "danger",
        });
      } finally {
        setIsEmailing(false);
      }
    } else {
      try {
        await submitReport();
        addNotification({
          title: "Report Saved Offline",
          message: "Your report has been queued and will sync when online.",
          tone: "warning",
        });
      } catch (error) {
        addNotification({
          title: "Offline Save Failed",
          message: "Failed to queue the report offline. Please try again.",
          tone: "danger",
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
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      {/* Wizard Header / Step Indicators */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Create Daily Report
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Autosave active · {isOnline ? "Online" : "Offline queue mode"} ·{" "}
            {lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}` : "Preparing draft"}
          </p>
        </div>
        <div className="flex overflow-x-auto pb-2 gap-2 sm:grid sm:grid-cols-4 sm:pb-0 scrollbar-hide">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={
                index === step
                  ? "min-h-10 whitespace-nowrap rounded-md bg-primary px-3 text-xs font-semibold text-white shrink-0"
                  : "min-h-10 whitespace-nowrap rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted shrink-0"
              }
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

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
      <div className="mt-6 flex justify-between border-t border-border pt-5">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="min-h-11 rounded-md border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}
            className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover cursor-pointer"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isEmailing}
            className="min-h-11 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isOnline ? <EnvelopeIcon className="h-4 w-4" /> : <PaperAirplaneIcon className="h-4 w-4" />}
            {isEmailing ? "Submitting..." : isOnline ? "Submit Daily Report" : "Queue Offline Submission"}
          </button>
        )}
      </div>
    </section>
  );
}
