import { useQuery } from "@tanstack/react-query";
import { fetchTeamMembers, fetchTeamMember, fetchMemberReportHistory } from "../services/team-service";

export function useTeam(filters?: { query?: string; statusToday?: "Submitted" | "Pending" | "All" }) {
  return useQuery({
    queryKey: ["teamMembers", filters],
    queryFn: () => fetchTeamMembers(filters),
  });
}

export function useTeamMember(employeeId: string) {
  return useQuery({
    queryKey: ["teamMember", employeeId],
    queryFn: () => fetchTeamMember(employeeId),
    enabled: !!employeeId,
  });
}

export function useMemberReportHistory(
  employeeId: string,
  daysFilter: "Today" | "7Days" | "10Days" | "15Days" | "30Days" | "Custom",
  customRange?: { start: string; end: string }
) {
  return useQuery({
    queryKey: ["memberReportHistory", employeeId, daysFilter, customRange],
    queryFn: () => fetchMemberReportHistory(employeeId, daysFilter, customRange),
    enabled: !!employeeId,
  });
}
