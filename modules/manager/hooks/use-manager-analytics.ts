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

import type { DatePreset } from "../services/manager-service";

export function useMissingReports(
  filter: DatePreset,
  customRange?: { start: string; end: string }
) {
  return useQuery({
    queryKey: ["missingReports", filter, customRange],
    queryFn: () => fetchMissingReports(filter, customRange),
  });
}
