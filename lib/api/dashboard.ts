import type {
  DashboardOverview,
  RecentReportsData,
  ReportPipelineData,
} from "@/types/dashboard";

const networkDelay = 120;

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  await wait(networkDelay);

  return {
    user: {
      name: "Kuldeep",
      department: "Operations",
      reportingManager: "Saurabh Yadav",
    },
    currentDate: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date()),
    reportingStatus: "draft",
    statusLabel: "Draft auto-saved 2 minutes ago",
    metrics: [
      {
        label: "Reports Submitted",
        value: "18",
        change: "+12% this month",
        tone: "primary",
      },
      {
        label: "Hours Logged",
        value: "142.5",
        change: "96% target pace",
        tone: "info",
      },
      {
        label: "Tasks Completed",
        value: "64",
        change: "+9 this week",
        tone: "success",
      },
      {
        label: "Pending Tasks",
        value: "7",
        change: "3 due today",
        tone: "warning",
      },
    ],
    quickActions: [
      {
        label: "Create Report",
        href: "/reports/create",
        description: "Start today's daily reporting workflow.",
      },
      {
        label: "Continue Draft",
        href: "/reports/drafts",
        description: "Resume the latest offline-safe draft.",
      },
      {
        label: "View History",
        href: "/reports/history",
        description: "Search submitted reports and approvals.",
      },
    ],
  };
}

export async function fetchRecentReports(): Promise<RecentReportsData> {
  await wait(networkDelay + 80);

  return {
    activities: [
      {
        id: "rep-1042",
        title: "Daily report submitted",
        detail: "Operations queue reconciliation and vendor follow-ups.",
        timestamp: "Today, 6:12 PM",
        status: "submitted",
      },
      {
        id: "rep-1041",
        title: "Draft recovered",
        detail: "3 task rows and 2 meeting notes restored from IndexedDB.",
        timestamp: "Today, 9:08 AM",
        status: "draft",
      },
      {
        id: "rep-1040",
        title: "Queued for sync",
        detail: "Offline report will submit when connectivity is restored.",
        timestamp: "Yesterday, 7:44 PM",
        status: "pending-sync",
      },
    ],
  };
}

export async function fetchReportPipeline(): Promise<ReportPipelineData> {
  await wait(networkDelay + 160);

  return {
    items: [
      { label: "Task log", value: 100, target: 100 },
      { label: "Meetings", value: 70, target: 100 },
      { label: "EOD notes", value: 45, target: 100 },
      { label: "Preview", value: 0, target: 100 },
    ],
  };
}
