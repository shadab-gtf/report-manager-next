export type TeamReportStatus = "Submitted" | "Missing" | "Draft" | "Approved";

export interface TeamMemberReport {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  submittedAt: string;
  status: TeamReportStatus;
  hoursLogged: number;
  completion: number;
}
