import { TeamReport, TeamStats, Comment, ReviewStatus } from "../types/manager";

const MOCK_REPORTS_KEY = "rm_manager_reports";

// Initial seed data
const initialReports: TeamReport[] = [
  {
    id: "rep-2210-1",
    employeeId: "GTF-2210",
    employeeName: "Neha Kapoor",
    department: "Operations",
    reportDate: new Date().toISOString().split("T")[0],
    submittedAt: "5:02 PM",
    status: "Submitted",
    reviewStatus: "pending",
    hoursLogged: 7.5,
    completion: 94,
    isLate: false,
    tasks: [
      {
        id: "task-1",
        description: "Operations queue reconciliation and vendor follow-ups.",
        category: "Operations",
        priority: "High",
        timeSpent: 4.5,
        completion: 100,
        status: "Completed",
      },
      {
        id: "task-2",
        description: "Reviewing daily dispatch log error rates.",
        category: "Operations",
        priority: "Medium",
        timeSpent: 3.0,
        completion: 80,
        status: "In Progress",
      }
    ],
    meetings: [
      {
        id: "meet-1",
        subject: "Daily Sync Meeting",
        withWhom: "Operations Team",
        time: "10:00 AM",
        duration: 30,
        type: "Standup",
      }
    ],
    notes: {
      pending: "Errors in logistics routing require clarification from vendor tomorrow.",
      blockers: "None",
      tomorrowPlan: "Resolve outstanding tickets and run weekly compliance check.",
    },
    comments: [],
  },
  {
    id: "rep-1980-1",
    employeeId: "GTF-1980",
    employeeName: "Fatima Khan",
    department: "Operations",
    reportDate: new Date().toISOString().split("T")[0],
    submittedAt: "5:48 PM",
    status: "Approved",
    reviewStatus: "reviewed",
    hoursLogged: 8.0,
    completion: 100,
    isLate: false,
    tasks: [
      {
        id: "task-3",
        description: "End of day invoice generation and dispatch.",
        category: "Finance",
        priority: "Critical",
        timeSpent: 5.0,
        completion: 100,
        status: "Completed",
      },
      {
        id: "task-4",
        description: "Training manual updates for new interns.",
        category: "Operations",
        priority: "Low",
        timeSpent: 3.0,
        completion: 100,
        status: "Completed",
      }
    ],
    meetings: [],
    notes: {
      pending: "None",
      blockers: "None",
      tomorrowPlan: "Start monthly audit preparations.",
    },
    comments: [
      {
        id: "c-1",
        reportId: "rep-1980-1",
        managerName: "Saurabh Yadav",
        text: "Excellent work on completing the invoice audit on time.",
        timestamp: "Today, 6:00 PM"
      }
    ],
  },
  {
    id: "rep-1042-1",
    employeeId: "GTF-1042",
    employeeName: "Kuldeep",
    department: "Operations",
    reportDate: new Date().toISOString().split("T")[0],
    submittedAt: "6:12 PM",
    status: "Submitted",
    reviewStatus: "pending",
    hoursLogged: 8.5,
    completion: 88,
    isLate: true, // Submitted after cut-off
    tasks: [
      {
        id: "task-5",
        description: "Operations queue reconciliation and vendor follow-ups.",
        category: "Operations",
        priority: "High",
        timeSpent: 5.5,
        completion: 90,
        status: "In Progress",
      },
      {
        id: "task-6",
        description: "Weekly backup confirmation.",
        category: "IT Support",
        priority: "Low",
        timeSpent: 3.0,
        completion: 100,
        status: "Completed",
      }
    ],
    meetings: [
      {
        id: "meet-2",
        subject: "Review with Manager",
        withWhom: "Saurabh Yadav",
        time: "4:00 PM",
        duration: 30,
        type: "Review",
      }
    ],
    notes: {
      pending: "Finalize queue reconciliation.",
      blockers: "Server down for 30 minutes in afternoon.",
      tomorrowPlan: "Deploy reconciliation script updates.",
    },
    comments: [],
  },
  // Yesterday's reports
  {
    id: "rep-2210-2",
    employeeId: "GTF-2210",
    employeeName: "Neha Kapoor",
    department: "Operations",
    reportDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    submittedAt: "Yesterday, 5:15 PM",
    status: "Approved",
    reviewStatus: "reviewed",
    hoursLogged: 8.0,
    completion: 100,
    tasks: [
      {
        id: "task-7",
        description: "Organizing client feedback survey files.",
        category: "Operations",
        priority: "Medium",
        timeSpent: 8.0,
        completion: 100,
        status: "Completed",
      }
    ],
    meetings: [],
    notes: {
      pending: "",
      blockers: "",
      tomorrowPlan: "Logistics queue check.",
    },
    comments: [],
  },
  {
    id: "rep-1844-2",
    employeeId: "GTF-1844",
    employeeName: "Rohan Iyer",
    department: "Support",
    reportDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    submittedAt: "Yesterday, 6:30 PM",
    status: "Submitted",
    reviewStatus: "follow_up",
    hoursLogged: 7.0,
    completion: 50,
    isLate: true,
    tasks: [
      {
        id: "task-8",
        description: "Customer complaint desk logs cleanup.",
        category: "Support",
        priority: "Medium",
        timeSpent: 7.0,
        completion: 50,
        status: "In Progress",
      }
    ],
    meetings: [],
    notes: {
      pending: "Clean remaining half of support tickets.",
      blockers: "High ticket volume.",
      tomorrowPlan: "Finish ticket cleanup.",
    },
    comments: [
      {
        id: "c-2",
        reportId: "rep-1844-2",
        managerName: "Saurabh Yadav",
        text: "Why is the completion rate so low? Please explain.",
        timestamp: "Yesterday, 7:00 PM"
      }
    ],
  }
];

function getStoredReports(): TeamReport[] {
  if (typeof window === "undefined") return initialReports;
  const stored = window.localStorage.getItem(MOCK_REPORTS_KEY);
  if (!stored) {
    window.localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(initialReports));
    return initialReports;
  }
  return JSON.parse(stored);
}

function saveStoredReports(reports: TeamReport[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(reports));
  }
}

export async function fetchTeamStats(): Promise<TeamStats> {
  const reports = getStoredReports();
  const todayStr = new Date().toISOString().split("T")[0];
  const todayReports = reports.filter((r) => r.reportDate === todayStr);

  const submittedCount = todayReports.filter((r) => r.status === "Submitted" || r.status === "Approved").length;
  // Let's assume there are 12 employees in total reporting to this manager
  const teamSize = 12;
  const pendingCount = 2; // Fixed pending
  const missingCount = teamSize - submittedCount - pendingCount;

  // compliance calculation
  const complianceRate = Math.round((submittedCount / (submittedCount + missingCount)) * 100) || 94;

  return {
    teamSize,
    submittedToday: submittedCount,
    pendingToday: pendingCount,
    missingToday: Math.max(0, missingCount),
    complianceRate,
  };
}

export async function fetchRecentSubmissions(): Promise<Array<{ id: string; employeeName: string; employeeId: string; time: string; status: string }>> {
  const allReports = getStoredReports();
  const reports = allReports.filter((r) => r.status === "Submitted" || r.status === "Approved");
  // Sort by reportDate and submittedAt
  return reports
    .map((r) => ({
      id: r.id,
      employeeName: r.employeeName,
      employeeId: r.employeeId,
      time: `${r.reportDate === new Date().toISOString().split("T")[0] ? "Today" : "Yesterday"}, ${r.submittedAt.replace("Yesterday, ", "")}`,
      status: r.isLate ? "Submitted (Late)" : r.status,
    }))
    .slice(0, 5);
}

export async function fetchAllTeamReports(filters?: {
  status?: "Submitted" | "Pending" | "Late" | "All";
  reviewStatus?: ReviewStatus | "All";
}): Promise<TeamReport[]> {
  const allReports = getStoredReports();
  const reports = allReports.filter((r) => r.status === "Submitted" || r.status === "Approved");
  
  if (!filters) return reports;

  return reports.filter((r) => {
    if (filters.status && filters.status !== "All") {
      if (filters.status === "Late") return r.isLate;
      if (filters.status === "Submitted") return !r.isLate;
      if (filters.status === "Pending") return false; // Pending/draft reports are filtered out
    }
    if (filters.reviewStatus && filters.reviewStatus !== "All") {
      return r.reviewStatus === filters.reviewStatus;
    }
    return true;
  });
}

export async function updateReportReview(
  reportId: string,
  reviewStatus: ReviewStatus,
  commentText?: string
): Promise<TeamReport> {
  const reports = getStoredReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index === -1) throw new Error("Report not found");

  const report = reports[index];
  report.reviewStatus = reviewStatus;
  
  if (reviewStatus === "reviewed") {
    report.status = "Approved";
  } else {
    report.status = "Submitted";
  }

  if (commentText && commentText.trim() !== "") {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      reportId,
      managerName: "Saurabh Yadav",
      text: commentText,
      timestamp: "Just now",
    };
    report.comments.push(newComment);
  }

  reports[index] = report;
  saveStoredReports(reports);
  return report;
}

export async function getReportById(reportId: string): Promise<TeamReport | null> {
  const allReports = getStoredReports();
  const reports = allReports.filter((r) => r.status === "Submitted" || r.status === "Approved");
  return reports.find((r) => r.id === reportId) || null;
}
