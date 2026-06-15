"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  meetingTypes,
  taskPriorities,
  taskStatuses,
} from "@/modules/reports/constants";
import { useReportDraft } from "@/modules/reports/hooks/use-report-draft";
import { useAppSelector } from "@/store/hooks";

const steps = ["Task Log", "Meetings & Calls", "EOD Notes", "Preview", "Submit"];

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
  const managerEmail =
    session?.reportingManagerEmail ?? "priya.menon@gtf.example";
  const managerName = session?.reportingManager ?? "Priya Menon";
  const emailSubject =
    draft.tasks.find((task) => task.description.trim().length > 0)?.description ??
    `Daily Report - ${draft.reportDate}`;
  const emailBody = buildEmailBody({
    managerName,
    employeeName: session?.name ?? "Aarav Sharma",
    reportDate: draft.reportDate,
    totalHours,
    tasks: draft.tasks,
    meetings: draft.meetings,
    pending: draft.notes.pending,
    blockers: draft.notes.blockers,
    tomorrowPlan: draft.notes.tomorrowPlan,
  });
  const mailToHref = `mailto:${managerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

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
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">
            Create Daily Report
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Autosave is active · {isOnline ? "Online" : "Offline queue mode"} ·{" "}
            {lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}` : "Preparing draft"}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={
                index === step
                  ? "min-h-10 rounded-md bg-primary px-3 text-xs font-semibold text-white"
                  : "min-h-10 rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
              }
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="mt-6"
        >
          {step === 0 ? (
            <div className="grid gap-4">
              {draft.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-semibold text-foreground">
                      Task {index + 1}
                    </h2>
                    <button
                      type="button"
                      title="Remove task"
                      onClick={() => removeTask(task.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-danger hover:bg-danger-light"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <TextField
                      label="Task description"
                      value={task.description}
                      onChange={(value) => updateTask(task.id, { description: value })}
                    />
                    <TextField
                      label="Category"
                      value={task.category}
                      onChange={(value) => updateTask(task.id, { category: value })}
                    />
                    <SelectField
                      label="Priority"
                      value={task.priority}
                      options={taskPriorities}
                      onChange={(value) => updateTask(task.id, { priority: value })}
                    />
                    <SelectField
                      label="Status"
                      value={task.status}
                      options={taskStatuses}
                      onChange={(value) => updateTask(task.id, { status: value })}
                    />
                    <NumberField
                      label="Time spent"
                      value={task.timeSpent}
                      onChange={(value) => updateTask(task.id, { timeSpent: value })}
                    />
                    <NumberField
                      label="Completion %"
                      value={task.completion}
                      onChange={(value) => updateTask(task.id, { completion: value })}
                    />
                    <TextField
                      label="Expected date"
                      type="date"
                      value={task.expectedCompletionDate}
                      onChange={(value) =>
                        updateTask(task.id, { expectedCompletionDate: value })
                      }
                    />
                    <TextField
                      label="Notes"
                      value={task.notes}
                      onChange={(value) => updateTask(task.id, { notes: value })}
                    />
                  </div>
                </div>
              ))}
              <AddButton onClick={addTask}>Add task row</AddButton>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4">
              {draft.meetings.map((meeting, index) => (
                <div
                  key={meeting.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-semibold text-foreground">
                      Meeting {index + 1}
                    </h2>
                    <button
                      type="button"
                      title="Remove meeting"
                      onClick={() => removeMeeting(meeting.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-danger hover:bg-danger-light"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <TextField
                      label="Subject"
                      value={meeting.subject}
                      onChange={(value) => updateMeeting(meeting.id, { subject: value })}
                    />
                    <TextField
                      label="With whom"
                      value={meeting.withWhom}
                      onChange={(value) => updateMeeting(meeting.id, { withWhom: value })}
                    />
                    <TextField
                      label="Time"
                      type="time"
                      value={meeting.time}
                      onChange={(value) => updateMeeting(meeting.id, { time: value })}
                    />
                    <NumberField
                      label="Duration"
                      value={meeting.duration}
                      onChange={(value) => updateMeeting(meeting.id, { duration: value })}
                    />
                    <SelectField
                      label="Type"
                      value={meeting.type}
                      options={meetingTypes}
                      onChange={(value) => updateMeeting(meeting.id, { type: value })}
                    />
                  </div>
                </div>
              ))}
              <AddButton onClick={addMeeting}>Add meeting entry</AddButton>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 md:grid-cols-3">
              <TextareaField
                label="Pending / Carry Forward"
                value={draft.notes.pending}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    notes: { ...current.notes, pending: value },
                  }))
                }
              />
              <TextareaField
                label="Blockers / Challenges"
                value={draft.notes.blockers}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    notes: { ...current.notes, blockers: value },
                  }))
                }
              />
              <TextareaField
                label="Plan For Tomorrow"
                value={draft.notes.tomorrowPlan}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    notes: { ...current.notes, tomorrowPlan: value },
                  }))
                }
              />
            </div>
          ) : null}

          {step === 3 ? (
            <ReportPreview totalHours={totalHours} draft={draft} />
          ) : null}

          {step === 4 ? (
            <div className="rounded-lg border border-border bg-background p-6">
              <h2 className="text-xl font-semibold text-foreground">
                Submit and email daily report
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This will mark the draft as {isOnline ? "submitted" : "queued for sync"}.
                The reporting manager is automatically selected and the first
                task title is used as the email subject.
              </p>
              <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <ReadOnlyField label="To" value={`${managerName} <${managerEmail}>`} />
                  <ReadOnlyField label="Subject" value={emailSubject} />
                </div>
                <label className="grid gap-2 text-sm font-semibold text-foreground">
                  Email body
                  <textarea
                    readOnly
                    value={emailBody}
                    className="min-h-72 rounded-xl border border-input bg-background px-3 py-3 font-mono text-xs font-normal leading-5 outline-none"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={submitReport}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  {isOnline ? "Submit report" : "Queue offline submission"}
                </button>
                <a
                  href={mailToHref}
                  onClick={submitReport}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  Submit and email manager
                </a>
              </div>
              <p className="mt-4 rounded-md bg-success-light px-3 py-2 text-sm font-semibold text-success">
                Current status: {draft.status}
              </p>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between border-t border-border pt-5">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="min-h-11 rounded-md border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          disabled={step === steps.length - 1}
          onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}
          className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

function ReportPreview({
  draft,
  totalHours,
}: {
  draft: ReturnType<typeof useReportDraft>["draft"];
  totalHours: number;
}) {
  return (
    <article className="rounded-lg border border-border bg-white p-6 text-slate-950 shadow-sm print:border-0 print:shadow-none">
      <header className="border-b border-slate-200 pb-4">
        <p className="text-sm font-semibold uppercase text-blue-700">
          Daily Productivity Report
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Employee GTF-1042</h2>
        <p className="mt-1 text-sm text-slate-600">
          Report Date: {draft.reportDate} · Total Hours: {totalHours}
        </p>
      </header>
      <section className="mt-6">
        <h3 className="font-semibold">Task Log</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100">
              <tr>
                {["Task", "Priority", "Hours", "Completion", "Status"].map((head) => (
                  <th key={head} className="border border-slate-200 px-3 py-2 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {draft.tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border border-slate-200 px-3 py-2">{task.description || "Untitled task"}</td>
                  <td className="border border-slate-200 px-3 py-2">{task.priority}</td>
                  <td className="border border-slate-200 px-3 py-2">{task.timeSpent}</td>
                  <td className="border border-slate-200 px-3 py-2">{task.completion}%</td>
                  <td className="border border-slate-200 px-3 py-2">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <PreviewNote title="Pending" value={draft.notes.pending} />
        <PreviewNote title="Blockers" value={draft.notes.blockers} />
        <PreviewNote title="Tomorrow" value={draft.notes.tomorrowPlan} />
      </section>
    </article>
  );
}

function PreviewNote({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{value || "Not provided"}</p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-input bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        type="number"
        value={value}
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 rounded-md border border-input bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}

function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: readonly TValue[];
  onChange: (value: TValue) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="h-11 rounded-md border border-input bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-44 rounded-md border border-input bg-card px-3 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-dashed border-primary/50 px-4 text-sm font-semibold text-primary hover:bg-primary-light/40"
    >
      <PlusIcon className="h-4 w-4" />
      {children}
    </button>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        readOnly
        value={value}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none"
      />
    </label>
  );
}

function buildEmailBody({
  managerName,
  employeeName,
  reportDate,
  totalHours,
  tasks,
  meetings,
  pending,
  blockers,
  tomorrowPlan,
}: {
  managerName: string;
  employeeName: string;
  reportDate: string;
  totalHours: number;
  tasks: ReturnType<typeof useReportDraft>["draft"]["tasks"];
  meetings: ReturnType<typeof useReportDraft>["draft"]["meetings"];
  pending: string;
  blockers: string;
  tomorrowPlan: string;
}) {
  const taskRows = tasks
    .map(
      (task, index) =>
        `${index + 1}. ${task.description || "Untitled task"}\n   Category: ${task.category}\n   Priority: ${task.priority}\n   Status: ${task.status}\n   Time Spent: ${task.timeSpent} hrs\n   Completion: ${task.completion}%\n   Expected Completion: ${task.expectedCompletionDate}\n   Notes: ${task.notes || "N/A"}`,
    )
    .join("\n\n");
  const meetingRows = meetings
    .map(
      (meeting, index) =>
        `${index + 1}. ${meeting.subject || "Untitled meeting"}\n   With: ${meeting.withWhom || "N/A"}\n   Time: ${meeting.time}\n   Duration: ${meeting.duration} mins\n   Type: ${meeting.type}`,
    )
    .join("\n\n");

  return `Dear ${managerName},

Please find my daily productivity report below.

Employee: ${employeeName}
Report Date: ${reportDate}
Total Hours Logged: ${totalHours}

TASK LOG
${taskRows || "No task entries added."}

MEETINGS AND CALLS
${meetingRows || "No meeting entries added."}

END OF DAY NOTES
Pending / Carry Forward:
${pending || "N/A"}

Blockers / Challenges:
${blockers || "N/A"}

Plan For Tomorrow:
${tomorrowPlan || "N/A"}

Regards,
${employeeName}`;
}
