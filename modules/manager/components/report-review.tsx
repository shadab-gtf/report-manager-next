"use client";

import { useState } from "react";
import { CheckIcon, ArrowPathIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useReportReview } from "../hooks/use-report-review";
import { TeamReport } from "../types/manager";

interface ReportReviewProps {
  report: TeamReport;
}

export function ReportReview({ report }: ReportReviewProps) {
  const [commentText, setCommentText] = useState("");
  const reviewMutation = useReportReview();

  const handleReview = (status: "reviewed" | "follow_up") => {
    reviewMutation.mutate(
      {
        reportId: report.id,
        reviewStatus: status,
        commentText: commentText.trim() !== "" ? commentText : undefined,
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Decision Panel */}
      <div className="rounded-lg border border-border bg-background p-4">
        <h3 className="text-sm font-semibold text-foreground">Review Action</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Determine submission correctness status</p>
        
        {/* Optional Review Comment Input */}
        <div className="mt-4">
          <label htmlFor="review-comment" className="text-xs font-semibold text-foreground">
            Review Comment (Optional)
          </label>
          <textarea
            id="review-comment"
            rows={3}
            placeholder="Add comments regarding API migration, hours mismatch, blockers..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mt-1.5 w-full rounded border border-input bg-card p-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={reviewMutation.isPending}
            onClick={() => handleReview("reviewed")}
            className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-success px-4 text-xs font-semibold text-white hover:bg-success/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <CheckIcon className="h-4 w-4" />
            {reviewMutation.isPending ? "Processing..." : "Mark Reviewed"}
          </button>
          
          <button
            type="button"
            disabled={reviewMutation.isPending}
            onClick={() => handleReview("follow_up")}
            className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-warning px-4 text-xs font-semibold text-white hover:bg-warning/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="h-4 w-4" />
            {reviewMutation.isPending ? "Processing..." : "Request Follow-Up"}
          </button>
        </div>
      </div>

      {/* Discussion & Comments Feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Comments & Discussion ({report.comments.length})</h3>
        </div>

        <div className="flex flex-col gap-3">
          {report.comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{comment.managerName}</span>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="mt-2 text-muted-foreground leading-relaxed">{comment.text}</p>
            </div>
          ))}

          {report.comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              No comments posted on this report yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
