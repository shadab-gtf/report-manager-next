import { useQuery } from "@tanstack/react-query";
import {
  fetchComplianceTrend,
  fetchFrequentMissers,
  fetchMostConsistent,
  fetchMissingReports,
} from "../services/analytics-service";

export function useComplianceTrend(daysCount: number) {
  return useQuery({
    queryKey: ["complianceTrend", daysCount],
    queryFn: () => fetchComplianceTrend(daysCount),
  });
}

export function useFrequentMissers() {
  return useQuery({
    queryKey: ["frequentMissers"],
    queryFn: () => fetchFrequentMissers(),
  });
}

export function useMostConsistent() {
  return useQuery({
    queryKey: ["mostConsistent"],
    queryFn: () => fetchMostConsistent(),
  });
}

export function useMissingReports(filter: "Today" | "7Days" | "30Days") {
  return useQuery({
    queryKey: ["missingReports", filter],
    queryFn: () => fetchMissingReports(filter),
  });
}
