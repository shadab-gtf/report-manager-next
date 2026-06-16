export type ReviewStatus = "pending" | "reviewed" | "follow_up";

export interface TeamMember {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  reportingManager: string;
  statusToday: "Submitted" | "Pending" | "Missing";
  complianceRate: number;
  totalReports: number;
  submittedOnTime: number;
  lateReports: number;
  missedReports: number;
}

export interface TeamStats {
  teamSize: number;
  submittedToday: number;
  pendingToday: number;
  missingToday: number;
  complianceRate: number;
}

export interface Comment {
  id: string;
  reportId: string;
  managerName: string;
  text: string;
  timestamp: string;
}

export interface TeamReport {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reportDate: string;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Approved";
  reviewStatus: ReviewStatus;
  hoursLogged: number;
  completion: number;
  tasks: Array<{
    id: string;
    description: string;
    category: string;
    priority: string;
    timeSpent: number;
    completion: number;
    status: string;
  }>;
  meetings: Array<{
    id: string;
    subject: string;
    withWhom: string;
    time: string;
    duration: number;
    type: string;
  }>;
  notes: {
    pending: string;
    blockers: string;
    tomorrowPlan: string;
  };
  comments: Comment[];
  isLate?: boolean;
}

export interface MissingReport {
  employeeId: string;
  employeeName: string;
  department: string;
  daysMissed: number;
  lastSubmission: string;
}

export interface ComplianceTrend {
  date: string;
  compliance: number;
  submitted: number;
  expected: number;
}
