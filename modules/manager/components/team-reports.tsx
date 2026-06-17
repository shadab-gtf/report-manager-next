"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
  useFilteredTeamReports,
  useUniqueEmployees,
} from "../hooks/use-team-reports";
import type { DatePreset } from "../services/manager-service";
import { generateHtmlEmail } from "@/modules/reports/utils/email-template";
import { PageTransition } from "@/components/motion/page-transition";
import { AnimatedTabs } from "@/components/motion/animated-tabs";

const PAGE_SIZE = 20;

const DATE_PRESETS: Array<{ key: DatePreset; label: string }> = [
  { key: "Today", label: "Today" },
  { key: "7Days", label: "7 Days" },
  { key: "10Days", label: "10 Days" },
  { key: "15Days", label: "15 Days" },
  { key: "30Days", label: "30 Days" },
  { key: "Custom", label: "Custom Date" },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-blue-100 text-blue-700",
    "bg-red-100 text-red-700",
    "bg-primary-light text-primary",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
};

export function TeamReports() {
  return (
    <Suspense
      fallback={
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading workspace...
        </div>
      }
    >
      <TeamReportsContent />
    </Suspense>
  );
}

interface EmployeeDropdownProps {
  employees: Array<{ employeeId: string; employeeName: string }>;
  value: string;
  onChange: (employeeId: string) => void;
}

function EmployeeDropdown({ employees, value, onChange }: EmployeeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        e.employeeName.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const selectedLabel = useMemo(() => {
    if (!value) return "All Employees";
    const found = employees.find((e) => e.employeeId === value);
    return found ? found.employeeName : "All Employees";
  }, [employees, value]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[180px]"
        aria-haspopup="listbox"
        aria-expanded={open}
        id="employee-filter-dropdown"
      >
        <span className="flex-1 truncate text-left">{selectedLabel}</span>
        <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
              autoFocus
            />
          </div>
          {/* Options */}
          <ul
            role="listbox"
            className="max-h-56 overflow-y-auto py-1"
            aria-labelledby="employee-filter-dropdown"
          >
            {/* All option */}
            <li
              role="option"
              aria-selected={!value}
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${!value
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted"
                }`}
            >
              {!value && <CheckIcon className="h-3.5 w-3.5" />}
              <span className={!value ? "" : "pl-5.5"}>All Employees</span>
            </li>
            {filtered.map((emp) => {
              const isSelected = emp.employeeId === value;
              return (
                <li
                  key={emp.employeeId}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(emp.employeeId);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  {isSelected && <CheckIcon className="h-3.5 w-3.5" />}
                  <span className={isSelected ? "" : "pl-5.5"}>
                    {emp.employeeName}{" "}
                    <span className="text-muted-foreground   text-xs">
                      ({emp.employeeId})
                    </span>
                  </span>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                No employees found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

interface EmailDropdownProps {
  onSend: (email: string) => void;
  sending: boolean;
  onClose: () => void;
}

function EmailDropdown({ onSend, sending, onClose }: EmailDropdownProps) {
  const [email, setEmail] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidEmail && !sending) {
      onSend(email);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-full z-30 mt-2 w-80 rounded-lg border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <form onSubmit={handleSubmit} className="p-3">
        <label
          htmlFor="recipient-email"
          className="block text-xs font-semibold text-card-foreground mb-1.5"
        >
          Recipient Email
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="recipient-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="flex-1 rounded border border-border bg-background px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
            disabled={sending}
            aria-label="Recipient email address"
          />
          <button
            type="submit"
            disabled={!isValidEmail || sending}
            className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Send report email"
          >
            {sending ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-4 w-4" />
            )}
            {sending ? "Sending" : "Send"}
          </button>
        </div>
        {email.length > 0 && !isValidEmail && (
          <p className="mt-1 text-[11px] text-red-500">
            Enter a valid email address
          </p>
        )}
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// Custom Date Range Picker (inline)
// ─────────────────────────────────────────────
interface CustomDateRangeProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  onClose: () => void;
}

function CustomDateRange({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onClose,
}: CustomDateRangeProps) {
  return (
    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
        className="rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Start date"
      />
      <span className="text-xs text-muted-foreground">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
        className="rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="End date"
      />
      <button
        type="button"
        onClick={onClose}
        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        aria-label="Clear custom date"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Content
// ─────────────────────────────────────────────
function TeamReportsContent() {
  const searchParams = useSearchParams();
  const initialOpenId = searchParams.get("open");

  // ── Filter State ──
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("Today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // ── UI State ──
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    initialOpenId
  );
  const [sending, setSending] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  // ── Data ──
  const { data: employees = [] } = useUniqueEmployees();
  const filters = useMemo(
    () => ({
      employeeId: selectedEmployee || undefined,
      datePreset,
      customRange:
        datePreset === "Custom" && customStart && customEnd
          ? { start: customStart, end: customEnd }
          : undefined,
    }),
    [selectedEmployee, datePreset, customStart, customEnd]
  );

  const { data: reports = [], isLoading } = useFilteredTeamReports(filters);

  const showLoading = !hasMounted.current || isLoading;

  // Paginated subset
  const visibleReports = useMemo(
    () => reports.slice(0, visibleCount),
    [reports, visibleCount]
  );
  const hasMore = visibleCount < reports.length;

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) ||
    (reports.length > 0 ? reports[0] : null);

  // ── Effects ──
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (initialOpenId) {
      setSelectedReportId(initialOpenId);
    }
  }, [initialOpenId]);

  // Auto-select first report when filter changes
  useEffect(() => {
    if (reports.length > 0 && !reports.find((r) => r.id === selectedReportId)) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [selectedEmployee, datePreset, customStart, customEnd]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || !hasMore) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
    if (nearBottom) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  }, [hasMore]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Send Mail ──
  const handleSendMail = async (recipientEmail: string) => {
    if (!selectedReport) return;
    setSending(true);
    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerEmail: recipientEmail,
          employeeName: selectedReport.employeeName,
          department: selectedReport.department,
          designation: "Team Specialist",
          managerName: "Saurabh Yadav",
          reportDate: selectedReport.reportDate,
          totalHours: selectedReport.hoursLogged,
          tasks: selectedReport.tasks.map((t) => ({
            description: t.description,
            category: t.category,
            priority: t.priority,
            status: t.status,
            timeSpent: t.timeSpent,
            completion: t.completion,
          })),
          meetings: selectedReport.meetings.map((m) => ({
            subject: m.subject,
            withWhom: m.withWhom,
            time: m.time,
            duration: m.duration,
            type: m.type,
          })),
          pending: selectedReport.notes.pending,
          blockers: selectedReport.notes.blockers,
          tomorrowPlan: selectedReport.notes.tomorrowPlan,
        }),
      });

      if (response.ok) {
        toast.success(`Report email sent to ${recipientEmail}!`);
        setEmailDropdownOpen(false);
      } else {
        throw new Error("Failed to send email");
      }
    } catch {
      toast.error("Error sending email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Generate preview ──
  const htmlContent = selectedReport
    ? generateHtmlEmail({
      managerEmail: "",
      employeeName: selectedReport.employeeName,
      department: selectedReport.department,
      designation: "Team Specialist",
      managerName: "Saurabh Yadav",
      reportDate: selectedReport.reportDate,
      totalHours: selectedReport.hoursLogged,
      tasks: selectedReport.tasks,
      meetings: selectedReport.meetings,
      pending: selectedReport.notes.pending,
      blockers: selectedReport.notes.blockers,
      tomorrowPlan: selectedReport.notes.tomorrowPlan,
    })
    : "";

  return (
    <PageTransition className="grid gap-6" suppressHydrationWarning>
      {/* ── Header + Date Filter Row ── */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light/50 text-primary">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Team Reports Center
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, comment, and sign off on daily reports submitted by your
              operations team.
            </p>
          </div>
        </div>

        {/* Date filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <AnimatedTabs
            tabs={DATE_PRESETS.map((preset) => ({
              id: preset.key,
              label: (
                <div className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="h-3.5 w-3.5" />
                  {preset.label}
                </div>
              ),
            }))}
            activeTab={datePreset}
            onTabChange={(tab) => setDatePreset(tab as DatePreset)}
            layoutId="team-reports-date-filter"
            className="flex flex-wrap items-center gap-2"
            tabClassName="relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border border-slate-200 bg-white hover:border-primary/30 focus:outline-none"
            activeTabClassName="text-white border-transparent bg-transparent"
            indicatorClassName="absolute inset-0 rounded-lg bg-primary shadow-sm"
          />

          {/* Custom Date Range Inputs */}
          {datePreset === "Custom" && (
            <CustomDateRange
              startDate={customStart}
              endDate={customEnd}
              onStartChange={setCustomStart}
              onEndChange={setCustomEnd}
              onClose={() => setDatePreset("Today")}
            />
          )}
        </div>
      </div>

      {/* ── Grid Layout ── */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* ── Left Side: Submissions list ── */}
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm h-[680px] flex flex-col">
          {/* Header with employee filter */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
            <h2 className="text-sm font-semibold text-card-foreground shrink-0">
              Submissions ({reports.length})
            </h2>
            <EmployeeDropdown
              employees={employees}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
            />
          </div>

          {/* Report list with scroll pagination */}
          <div
            ref={scrollContainerRef}
            className="mt-3 flex-1 overflow-y-auto divide-y divide-border pr-1"
          >
            {showLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading reports list...
              </div>
            ) : visibleReports.length > 0 ? (
              <>
                {visibleReports.map((report) => {
                  const isActive =
                    selectedReportId === report.id ||
                    (!selectedReportId &&
                      selectedReport?.id === report.id);
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`w-full flex items-center justify-between p-3.5 text-left rounded-lg transition-colors cursor-pointer ${isActive
                        ? "bg-primary-light/40 border-l-4 border-primary"
                        : "hover:bg-muted"
                        }`}
                    >
                      <div className="flex items-center gap-3 pr-2 flex-1 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-normal ${getAvatarColor(
                            report.employeeName
                          )}`}
                        >
                          {getInitials(report.employeeName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-slate-900 truncate">
                            {report.employeeName}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5  ">
                            {report.employeeId}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3 opacity-70" />
                              {report.reportDate}
                            </span>
                            <span className="text-[11px] text-slate-400">&bull;</span>
                            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                              <ClockIcon className="h-3 w-3 opacity-70" />
                              {report.submittedAt || "5:12 PM"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className="shrink-0 pl-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/manager/team/${report.employeeId}/history`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <ClockIcon className="h-3.5 w-3.5" />
                          History
                        </Link>
                      </div>
                    </button>
                  );
                })}
                {/* Scroll pagination sentinel */}
                {hasMore && (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    <ArrowPathIcon className="inline h-3.5 w-3.5 animate-spin mr-1" />
                    Loading more...
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No submissions found for the selected filters.
              </div>
            )}
          </div>
        </section>

        {/* ── Right Side: Report preview ── */}
        <section className="rounded-lg border border-border bg-card shadow-sm h-[680px] flex flex-col overflow-hidden">
          {selectedReport ? (
            <div className="h-full flex flex-col">
              {/* Report Workspace Header */}
              <div className="p-5 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-card-foreground">
                      {selectedReport.employeeName}
                    </h2>
                    <span className="text-xs   text-muted-foreground">
                      ({selectedReport.employeeId})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedReport.department} &bull; Daily Report for{" "}
                    {selectedReport.reportDate}
                    {/*  (Logged:{" "}
                    {selectedReport.hoursLogged} hrs, Completion:{" "}
                    {selectedReport.completion}%) */}
                  </p>
                </div>

                {/* Send Email with dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setEmailDropdownOpen((prev) => !prev)}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-hover transition-colors cursor-pointer"
                    aria-expanded={emailDropdownOpen}
                    id="send-mail-button"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    Send to Mail
                  </button>
                  {emailDropdownOpen && (
                    <EmailDropdown
                      onSend={handleSendMail}
                      sending={sending}
                      onClose={() => setEmailDropdownOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Workspace Contents */}
              <div className="flex-1 overflow-y-auto p-5 bg-background/30">
                <div className="flex justify-center h-full">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full h-full min-h-[500px] rounded border border-border bg-white shadow-sm"
                    title="Report Preview Frame"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <ClipboardDocumentCheckIcon className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold">
                Select a report to view review actions
              </p>
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
