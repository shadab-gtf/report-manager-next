export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Blocked";
export type MeetingType = "Meeting" | "Call" | "Review" | "Standup";
export type ReportStatus = "Draft" | "Submitted" | "Queued" | "Approved";

export interface TaskLogItem {
  id: string;
  description: string;
  category: string;
  priority: TaskPriority;
  timeSpent: number;
  completion: number;
  status: TaskStatus;
  expectedCompletionDate: string;
  notes: string;
}

export interface MeetingLogItem {
  id: string;
  subject: string;
  withWhom: string;
  time: string;
  duration: number;
  type: MeetingType;
}

export interface EndOfDayNotes {
  pending: string;
  blockers: string;
  tomorrowPlan: string;
}

export interface DailyReportDraft {
  id: string;
  employeeId: string;
  reportDate: string;
  tasks: TaskLogItem[];
  meetings: MeetingLogItem[];
  notes: EndOfDayNotes;
  status: ReportStatus;
  updatedAt: string;
  submittedAt?: string;
}

export interface ReportHistoryFilters {
  query: string;
  status: "All" | ReportStatus;
  page: number;
}

export interface ReportHistoryResult {
  reports: DailyReportDraft[];
  total: number;
  pageSize: number;
}
