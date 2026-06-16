import { ComplianceTrend, MissingReport, TeamMember } from "../types/manager";
import { fetchTeamMembers } from "./team-service";

export async function fetchComplianceTrend(daysCount: number): Promise<ComplianceTrend[]> {
  const trend: ComplianceTrend[] = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // Create random but realistic compliance progression
    // Weekends have lower submissions (e.g. 0-2), weekdays have higher (e.g. 9-11)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const expected = isWeekend ? 0 : 12;
    const submitted = isWeekend ? 0 : Math.round(10 + Math.random() * 2);
    const compliance = expected === 0 ? 100 : Math.round((submitted / expected) * 100);

    trend.push({
      date: dateStr,
      compliance,
      submitted,
      expected,
    });
  }

  return trend;
}

export async function fetchFrequentMissers(): Promise<Array<{ employeeName: string; employeeId: string; department: string; missCount: number }>> {
  const members = await fetchTeamMembers();
  return members
    .map((m) => ({
      employeeName: m.name,
      employeeId: m.employeeId,
      department: m.department,
      missCount: m.missedReports,
    }))
    .filter((m) => m.missCount > 3)
    .sort((a, b) => b.missCount - a.missCount);
}

export async function fetchMostConsistent(): Promise<Array<{ employeeName: string; employeeId: string; department: string; complianceRate: number }>> {
  const members = await fetchTeamMembers();
  return members
    .map((m) => ({
      employeeName: m.name,
      employeeId: m.employeeId,
      department: m.department,
      complianceRate: m.complianceRate,
    }))
    .filter((m) => m.complianceRate >= 90)
    .sort((a, b) => b.complianceRate - a.complianceRate);
}

import type { DatePreset } from "./manager-service";

export async function fetchMissingReports(
  filter: DatePreset,
  customRange?: { start: string; end: string }
): Promise<MissingReport[]> {
  const members = await fetchTeamMembers();
  
  if (filter === "Today") {
    return members
      .filter((m) => m.statusToday === "Missing" || m.employeeId === "GTF-1844") // Rohan Iyer is mock missing
      .map((m) => ({
        employeeId: m.employeeId,
        employeeName: m.name,
        department: m.department,
        daysMissed: m.employeeId === "GTF-1844" ? 2 : 1,
        lastSubmission: "Yesterday, 6:30 PM",
      }));
  }

  // Handle other filters
  return members
    .filter((m) => m.missedReports > 0)
    .map((m) => {
      let daysMissed = m.missedReports;
      if (filter === "7Days") daysMissed = Math.min(m.missedReports, 3);
      else if (filter === "10Days") daysMissed = Math.min(m.missedReports, 4);
      else if (filter === "15Days") daysMissed = Math.min(m.missedReports, 5);
      // else it keeps m.missedReports for 30Days or Custom

      return {
        employeeId: m.employeeId,
        employeeName: m.name,
        department: m.department,
        daysMissed,
        lastSubmission: m.employeeId === "GTF-1844" ? "Yesterday, 6:30 PM" : "3 days ago",
      };
    })
    .sort((a, b) => b.daysMissed - a.daysMissed);
}
