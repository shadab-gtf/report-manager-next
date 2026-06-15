import type { TeamMemberReport } from "@/types/team";

export async function listTeamReports(): Promise<TeamMemberReport[]> {
  return [
    {
      id: "team-1",
      employeeName: "Neha Kapoor",
      employeeId: "GTF-2210",
      department: "Operations",
      submittedAt: "Today, 6:02 PM",
      status: "Submitted",
      hoursLogged: 7.5,
      completion: 94,
    },
    {
      id: "team-2",
      employeeName: "Rohan Iyer",
      employeeId: "GTF-1844",
      department: "Support",
      submittedAt: "Not submitted",
      status: "Missing",
      hoursLogged: 0,
      completion: 0,
    },
    {
      id: "team-3",
      employeeName: "Fatima Khan",
      employeeId: "GTF-1980",
      department: "Operations",
      submittedAt: "Today, 5:48 PM",
      status: "Approved",
      hoursLogged: 8,
      completion: 100,
    },
  ];
}
