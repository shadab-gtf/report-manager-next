import { describe, it, expect, beforeEach } from "vitest";
import {
  fetchTeamStats,
  fetchAllTeamReports,
  updateReportReview,
} from "@/modules/manager/services/manager-service";
import { fetchTeamMembers, fetchTeamMember } from "@/modules/manager/services/team-service";

describe("Manager Module Service Layers", () => {
  beforeEach(() => {
    // Clear localStorage mockup if defined
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("should fetch team statistics with correct types and keys", async () => {
    const stats = await fetchTeamStats();
    expect(stats).toHaveProperty("teamSize");
    expect(stats).toHaveProperty("submittedToday");
    expect(stats).toHaveProperty("pendingToday");
    expect(stats).toHaveProperty("missingToday");
    expect(stats).toHaveProperty("complianceRate");
    expect(typeof stats.complianceRate).toBe("number");
  });

  it("should fetch all team reports and filter them correctly", async () => {
    const reports = await fetchAllTeamReports();
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0]).toHaveProperty("tasks");
    expect(reports[0]).toHaveProperty("meetings");
  });

  it("should fetch team members and search by query", async () => {
    const members = await fetchTeamMembers({ query: "Neha" });
    expect(members).toHaveLength(1);
    expect(members[0].name).toBe("Neha Kapoor");

    const searchById = await fetchTeamMembers({ query: "GTF-1844" });
    expect(searchById).toHaveLength(1);
    expect(searchById[0].name).toBe("Rohan Iyer");
  });

  it("should update a report review status and append comments", async () => {
    const reports = await fetchAllTeamReports();
    const targetReport = reports[0];
    
    const updated = await updateReportReview(targetReport.id, "reviewed", "Approved work details");
    expect(updated.reviewStatus).toBe("reviewed");
    expect(updated.status).toBe("Approved");
    expect(updated.comments.length).toBeGreaterThan(0);
    expect(updated.comments[updated.comments.length - 1].text).toBe("Approved work details");
  });
});
