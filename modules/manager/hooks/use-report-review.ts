import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReportReview } from "../services/manager-service";
import { ReviewStatus } from "../types/manager";

export function useReportReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      reviewStatus,
      commentText,
    }: {
      reportId: string;
      reviewStatus: ReviewStatus;
      commentText?: string;
    }) => updateReportReview(reportId, reviewStatus, commentText),
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["teamReports"] });
      queryClient.invalidateQueries({ queryKey: ["reportDetails", variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ["teamStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentSubmissions"] });
    },
  });
}
