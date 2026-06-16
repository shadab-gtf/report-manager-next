import { describe, it, expect } from "vitest";
import { escapeHtml, escapeHtmlMultiline, generateHtmlEmail } from "@/modules/reports/utils/email-template";

describe("Email Template XSS Sanitizer", () => {
  it("should escape basic HTML special characters", () => {
    const dangerousText = "<div>Hello & Welcome</div>";
    const escaped = escapeHtml(dangerousText);
    expect(escaped).toBe("&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;");
  });

  it("should escape quotes and single quotes", () => {
    const dangerousText = 'Click "here" or \'there\'';
    const escaped = escapeHtml(dangerousText);
    expect(escaped).toBe("Click &quot;here&quot; or &#039;there&#039;");
  });

  it("should format multi-line textareas and insert HTML line breaks", () => {
    const multiLine = "Line 1\nLine 2\nLine 3";
    const formatted = escapeHtmlMultiline(multiLine);
    expect(formatted).toBe("Line 1<br/>Line 2<br/>Line 3");
  });

  it("should escape text field inputs inside the email builder output", () => {
    const testReport = {
      employeeName: "<script>alert('xss')</script>",
      reportDate: "2026-06-16",
      department: "Technology",
      designation: "Software Engineer",
      managerName: "Saurabh Yadav",
      totalHours: 8,
      tasks: [
        {
          id: "task-1",
          description: "<img> onerror=alert(1)>",
          category: "Coding",
          priority: "High" as const,
          status: "Completed" as const,
          timeSpent: 8,
          completion: 100,
          notes: "<iframe src=javascript:alert(1)></iframe>",
        },
      ],
      meetings: [],
      pending: "None",
      blockers: "None",
      tomorrowPlan: "More coding",
    };

    const renderedHtml = generateHtmlEmail(testReport);
    
    // Ensure dangerous tags are fully escaped in the output HTML string
    expect(renderedHtml).not.toContain("<script>");
    expect(renderedHtml).toContain("&lt;script&gt;");
    expect(renderedHtml).not.toContain("<img>");
    expect(renderedHtml).toContain("&lt;img&gt;");
    expect(renderedHtml).not.toContain("<iframe>");
    expect(renderedHtml).toContain("&lt;iframe");
  });
});
