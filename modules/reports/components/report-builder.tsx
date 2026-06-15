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
const taskCategories = ["Figma", "Coding", "Development", "Research", "Meeting", "Other"];

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
  const emailSubject =
    draft.tasks.find((task) => task.description.trim().length > 0)?.description ??
    `Daily Report - ${draft.reportDate}`;
  const employeeName = "Kuldeep";
  const emailBody = buildEmailBody({
    managerName,
    employeeName,
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
                    <SelectField
                      label="Category"
                      value={task.category}
                      options={taskCategories}
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
              <p className="mt-4 rounded-md bg-success-light w-fit px-3 py-2 text-sm font-semibold text-success">
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
  employeeName = "Kuldeep",
  department = "Technology",
  designation = "Software Engineer",
  managerName = "Saurabh Yadav",
}: {
  draft: ReturnType<typeof useReportDraft>["draft"];
  totalHours: number;
  employeeName?: string;
  department?: string;
  designation?: string;
  managerName?: string;
}) {
  return (
    <article className="rounded-none border-0 bg-white text-slate-900 shadow-sm print:m-0 print:p-0 print:shadow-none w-full max-w-4xl mx-auto font-sans text-[13px] leading-relaxed">
      
      {/* Top Header */}
      <header className="bg-[#212E4A] text-white p-4 pb-2 border-b-2 border-[#D8A036]">
        <div className="flex justify-center items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h1 className="text-xl font-bold tracking-wide uppercase">Employee Daily Work Report</h1>
        </div>
        <div className="mt-3 mb-1 text-center text-[11px] text-[#D8A036] font-medium italic">
          Office: 9:30 AM – 7:00 PM &nbsp;|&nbsp; Lunch: 2:00 PM – 2:30 PM &nbsp;|&nbsp; Net Working Hours: 9 Hrs / Day
        </div>
      </header>

      {/* Info Block */}
      <div className="mt-6 mb-6">
        <table className="w-[80%] mx-auto border-collapse text-[12px]">
          <tbody>
            <tr>
              <td className="border border-slate-300 bg-[#f8f9fa] px-4 py-2 font-semibold w-1/4 text-center">Employee Name</td>
              <td className="border border-slate-300 bg-[#e4eff6] px-4 py-2 w-1/4 text-center text-[#0056b3]">{employeeName}</td>
              <td className="border border-slate-300 bg-[#f8f9fa] px-4 py-2 font-semibold w-1/4 text-center">Date</td>
              <td className="border border-slate-300 bg-[#e4eff6] px-4 py-2 w-1/4 text-center text-[#0056b3]">{draft.reportDate}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 bg-[#f8f9fa] px-4 py-2 font-semibold text-center">Department</td>
              <td className="border border-slate-300 bg-[#e4eff6] px-4 py-2 text-center text-[#0056b3]">{department}</td>
              <td className="border border-slate-300 bg-[#f8f9fa] px-4 py-2 font-semibold text-center">Designation</td>
              <td className="border border-slate-300 bg-[#e4eff6] px-4 py-2 text-center text-[#0056b3]">{designation}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Task Log */}
      <section className="mb-6">
        <div className="bg-[#212E4A] text-white px-3 py-2 flex items-center text-[13px] font-semibold uppercase">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Task Log
        </div>
        <table className="w-full border-collapse border border-[#212E4A] text-center text-[12px]">
          <thead className="bg-[#1A8377] text-white font-semibold">
            <tr>
              <th className="border border-[#1A8377] border-r-slate-300 px-2 py-2 w-10">#</th>
              <th className="border border-[#1A8377] border-r-slate-300 px-2 py-2">Task / Activity<br/>Description</th>
              <th className="border border-[#1A8377] border-r-slate-300 px-2 py-2">Category</th>
              <th className="border border-[#1A8377] border-r-slate-300 px-2 py-2">Priority</th>
              <th className="border border-[#1A8377] border-r-slate-300 px-2 py-2">Status</th>
              <th className="border border-[#1A8377] border-r-slate-300 px-2 py-2">Time<br/>Spent (hrs)</th>
              <th className="border border-[#1A8377] px-2 py-2">% Done</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.max(6, draft.tasks.length))].map((_, i) => {
              const task = draft.tasks[i];
              return (
                <tr key={task?.id || i} className={i % 2 === 0 ? "bg-[#e4eff6]" : "bg-white"}>
                  <td className="border border-slate-300 px-2 py-2 font-semibold text-slate-800">{i + 1}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3] text-left">{task?.description || ""}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3]">{task?.category || ""}</td>
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {task?.priority ? (
                      <span className="flex items-center justify-center gap-1">
                        {task.priority === "High" || task.priority === "Critical" ? (
                          <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                        ) : null}
                        {task.priority}
                      </span>
                    ) : ""}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {task?.status === "Completed" ? `✓ ${task.status}` : task?.status || ""}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3] font-medium">{task?.timeSpent !== undefined ? Number(task.timeSpent).toFixed(1) : "0.0"}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3] font-medium">{task?.completion !== undefined ? `${task.completion}%` : "0%"}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#212E4A] text-white font-bold text-[13px]">
              <td colSpan={5} className="border border-[#212E4A] px-4 py-2.5 text-center tracking-wider">TOTALS</td>
              <td className="border border-[#212E4A] px-2 py-2.5">{totalHours.toFixed(1)}</td>
              <td className="border border-[#212E4A] px-2 py-2.5">—</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Meetings & Calls Log */}
      <section className="mb-6">
        <div className="bg-[#7A298F] text-white px-3 py-2 flex items-center text-[13px] font-semibold uppercase">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Meetings & Calls Log
        </div>
        <table className="w-full border-collapse border border-[#7A298F] text-center text-[12px]">
          <thead className="bg-[#7A298F] text-white font-semibold">
            <tr>
              <th className="border border-[#7A298F] border-r-slate-300 px-2 py-2 w-10">#</th>
              <th className="border border-[#7A298F] border-r-slate-300 px-2 py-2">Subject / Meeting<br/>Name</th>
              <th className="border border-[#7A298F] border-r-slate-300 px-2 py-2">With Whom</th>
              <th className="border border-[#7A298F] border-r-slate-300 px-2 py-2">Time</th>
              <th className="border border-[#7A298F] border-r-slate-300 px-2 py-2">Duration<br/>(min)</th>
              <th className="border border-[#7A298F] px-2 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.max(6, draft.meetings.length))].map((_, i) => {
              const meeting = draft.meetings[i];
              return (
                <tr key={meeting?.id || i} className={i % 2 === 0 ? "bg-[#e4eff6]" : "bg-white"}>
                  <td className="border border-slate-300 px-2 py-2 font-semibold text-slate-800">{i + 1}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3] text-left">{meeting?.subject || ""}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3]">{meeting?.withWhom || ""}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3]">{meeting?.time || ""}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3] font-medium">{meeting?.duration !== undefined ? meeting.duration : "0"}</td>
                  <td className="border border-slate-300 px-2 py-2 text-[#0056b3]">{meeting?.type || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* End of Day Notes */}
      <section className="mb-10">
        <div className="bg-[#E27A23] text-white px-3 py-2 flex items-center text-[13px] font-semibold uppercase mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          End of Day Notes
        </div>
        
        <PreviewNote title="Pending / Carry Forward:" value={draft.notes.pending} />
        <PreviewNote title="Blockers / Challenges Faced:" value={draft.notes.blockers} />
        <PreviewNote title="Plan for Tomorrow:" value={draft.notes.tomorrowPlan} />
      </section>

      {/* Footer Signatures */}
      <footer className="mt-8 mb-2 bg-[#e4eff6] p-4 text-[13px] text-slate-700 flex justify-between items-end border-y border-[#212E4A]">
        <div className="flex-1 text-center flex flex-col items-center">
          <span className="font-semibold text-slate-800 mb-2">Employee Signature:</span>
          <div className="border-b border-red-500 w-32 xl:w-48 flex items-end justify-center h-10 pb-1">
            <span className="text-2xl text-[#212E4A] font-[family-name:var(--font-give-you-glory)] leading-none">{employeeName}</span>
          </div>
        </div>
        <div className="flex-1 text-center flex flex-col items-center">
          <span className="font-semibold text-slate-800 mb-2">Date:</span>
          <div className="border-b border-red-500 w-24 xl:w-40 flex items-end justify-center h-10 pb-1">
            <span className="text-sm font-bold text-[#212E4A] leading-none mb-1">{draft.reportDate}</span>
          </div>
        </div>
        <div className="flex-1 text-center flex flex-col items-center">
          <span className="font-semibold text-slate-800 mb-2">Manager Sign:</span>
          <div className="border-b border-red-500 w-32 xl:w-48 flex items-end justify-center h-10 pb-1">
            <span className="text-2xl text-[#212E4A] font-[family-name:var(--font-give-you-glory)] leading-none">{managerName}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}

function PreviewNote({ title, value }: { title: string; value: string }) {
  return (
    <div className="mb-4">
      <div className="bg-[#E27A23] text-white px-3 py-1.5 text-[12px] font-semibold border border-[#E27A23]">
        {title}
      </div>
      <div className="border border-[#212E4A] border-t-0 bg-[#e4eff6] px-3 py-3 min-h-[60px] text-[#0056b3]">
        {value || ""}
      </div>
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
