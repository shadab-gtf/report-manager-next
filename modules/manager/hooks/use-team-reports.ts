import { useQuery } from "@tanstack/react-query";
import { fetchAllTeamReports, getReportById, fetchTeamStats, fetchRecentSubmissions } from "../services/manager-service";
import { ReviewStatus } from "../types/manager";

export function useTeamReports(filters?: {
  status?: "Submitted" | "Pending" | "Late" | "All";
  reviewStatus?: ReviewStatus | "All";
}) {
  return useQuery({
    queryKey: ["teamReports", filters],
    queryFn: () => fetchAllTeamReports(filters),
  });
}

export function useReportDetails(reportId: string) {
  return useQuery({
    queryKey: ["reportDetails", reportId],
    queryFn: () => getReportById(reportId),
    enabled: !!reportId,
  });
}

export function useTeamStats() {
  return useQuery({
    queryKey: ["teamStats"],
    queryFn: () => fetchTeamStats(),
  });
}

export function useRecentSubmissions() {
  return useQuery({
    queryKey: ["recentSubmissions"],
    queryFn: () => fetchRecentSubmissions(),
  });
}
