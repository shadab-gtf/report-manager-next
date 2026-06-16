import { TeamMember, TeamReport } from "../types/manager";
import { fetchAllTeamReports } from "./manager-service";

const MOCK_TEAM_KEY = "rm_manager_team";

const initialTeam: TeamMember[] = [
  {
    employeeId: "GTF-2210",
    name: "Neha Kapoor",
    email: "neha.kapoor@gtftechnologies.com",
    department: "Operations",
    designation: "Operations Associate",
    joiningDate: "2025-02-15",
    reportingManager: "Saurabh Yadav",
    statusToday: "Submitted",
    complianceRate: 94,
    totalReports: 45,
    submittedOnTime: 42,
    lateReports: 2,
    missedReports: 1,
  },
  {
    employeeId: "GTF-1844",
    name: "Rohan Iyer",
    email: "rohan.iyer@gtftechnologies.com",
    department: "Support",
    designation: "Support Specialist",
    joiningDate: "2024-08-10",
    reportingManager: "Saurabh Yadav",
    statusToday: "Pending",
    complianceRate: 60,
    totalReports: 50,
    submittedOnTime: 25,
    lateReports: 15,
    missedReports: 10,
  },
  {
    employeeId: "GTF-1980",
    name: "Fatima Khan",
    email: "fatima.khan@gtftechnologies.com",
    department: "Operations",
    designation: "Operations Lead",
    joiningDate: "2024-11-01",
    reportingManager: "Saurabh Yadav",
    statusToday: "Submitted",
    complianceRate: 100,
    totalReports: 60,
    submittedOnTime: 58,
    lateReports: 2,
    missedReports: 0,
  },
  {
    employeeId: "GTF-1042",
    name: "Kuldeep",
    email: "kuldeep.choudhary@gtftechnologies.com",
    department: "Operations",
    designation: "Operations Associate",
    joiningDate: "2024-01-15",
    reportingManager: "Saurabh Yadav",
    statusToday: "Submitted",
    complianceRate: 88,
    totalReports: 80,
    submittedOnTime: 65,
    lateReports: 10,
    missedReports: 5,
  },
  {
    employeeId: "GTF-1005",
    name: "Kuldeep Choudhary",
    email: "kuldeep.c@gtftechnologies.com",
    department: "Technology",
    designation: "Software Engineer",
    joiningDate: "2024-01-20",
    reportingManager: "Saurabh Yadav",
    statusToday: "Pending",
    complianceRate: 92,
    totalReports: 82,
    submittedOnTime: 70,
    lateReports: 6,
    missedReports: 6,
  },
  {
    employeeId: "GTF-1200",
    name: "Amit Sharma",
    email: "amit.sharma@gtftechnologies.com",
    department: "Technology",
    designation: "Frontend Developer",
    joiningDate: "2024-04-12",
    reportingManager: "Saurabh Yadav",
    statusToday: "Submitted",
    complianceRate: 96,
    totalReports: 70,
    submittedOnTime: 65,
    lateReports: 2,
    missedReports: 3,
  },
  {
    employeeId: "GTF-1340",
    name: "Shweta Patel",
    email: "shweta.patel@gtftechnologies.com",
    department: "Tech/Design",
    designation: "UI/UX Designer",
    joiningDate: "2024-06-05",
    reportingManager: "Saurabh Yadav",
    statusToday: "Submitted",
    complianceRate: 85,
    totalReports: 65,
    submittedOnTime: 50,
    lateReports: 5,
    missedReports: 10,
  },
  {
    employeeId: "GTF-1450",
    name: "Rahul Verma",
    email: "rahul.verma@gtftechnologies.com",
    department: "Technology",
    designation: "QA Engineer",
    joiningDate: "2024-07-22",
    reportingManager: "Saurabh Yadav",
    statusToday: "Submitted",
    complianceRate: 90,
    totalReports: 68,
    submittedOnTime: 58,
    lateReports: 3,
    missedReports: 7,
  }
];

function getStoredTeam(): TeamMember[] {
  if (typeof window === "undefined") return initialTeam;
  const stored = window.localStorage.getItem(MOCK_TEAM_KEY);
  if (!stored) {
    window.localStorage.setItem(MOCK_TEAM_KEY, JSON.stringify(initialTeam));
    return initialTeam;
  }
  return JSON.parse(stored);
}

export async function fetchTeamMembers(filters?: {
  query?: string;
  statusToday?: "Submitted" | "Pending" | "All";
}): Promise<TeamMember[]> {
  let members = getStoredTeam();
  
  if (filters) {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      members = members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.employeeId.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q)
      );
    }
    if (filters.statusToday && filters.statusToday !== "All") {
      members = members.filter((m) => m.statusToday === filters.statusToday);
    }
  }
  return members;
}

export async function fetchTeamMember(employeeId: string): Promise<TeamMember | null> {
  const members = getStoredTeam();
  return members.find((m) => m.employeeId === employeeId) || null;
}

export async function fetchMemberReportHistory(
  employeeId: string,
  daysFilter: "Today" | "7Days" | "10Days" | "15Days" | "30Days" | "Custom",
  customRange?: { start: string; end: string }
): Promise<TeamReport[]> {
  const allReports = await fetchAllTeamReports();
  const memberReports = allReports.filter((r) => r.employeeId === employeeId);

  if (daysFilter === "Today") {
    const todayStr = new Date().toISOString().split("T")[0];
    return memberReports.filter((r) => r.reportDate === todayStr);
  }

  if (daysFilter === "Custom" && customRange) {
    const start = customRange.start ? new Date(customRange.start).getTime() : 0;
    // Set end date to end of day to include submissions on the end date
    const end = customRange.end ? new Date(customRange.end + "T23:59:59").getTime() : Infinity;

    return memberReports.filter((r) => {
      const reportTime = new Date(r.reportDate).getTime();
      return reportTime >= start && reportTime <= end;
    });
  }

  const now = Date.now();
  let limitDays = 30;
  if (daysFilter === "7Days") limitDays = 7;
  else if (daysFilter === "10Days") limitDays = 10;
  else if (daysFilter === "15Days") limitDays = 15;

  return memberReports.filter((r) => {
    const reportTime = new Date(r.reportDate).getTime();
    const diffDays = (now - reportTime) / (1000 * 3600 * 24);
    return diffDays <= limitDays;
  });
}
