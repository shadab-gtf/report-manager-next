export type ReportingStatus = "submitted" | "draft" | "pending-sync";

export interface UserProfile {
  name: string;
  role: "Employee" | "Manager";
  department: string;
  reportingManager: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  tone: "primary" | "success" | "warning" | "info";
}

export interface QuickAction {
  label: string;
  href: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  status: ReportingStatus;
}

export interface PipelineItem {
  label: string;
  value: number;
  target: number;
}

export interface DashboardOverview {
  user: UserProfile;
  currentDate: string;
  reportingStatus: ReportingStatus;
  statusLabel: string;
  metrics: DashboardMetric[];
  quickActions: QuickAction[];
}

export interface RecentReportsData {
  activities: ActivityItem[];
}

export interface ReportPipelineData {
  items: PipelineItem[];
}
