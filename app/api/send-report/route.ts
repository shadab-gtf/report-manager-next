import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/security/cookie-signer";
import { generateHtmlEmail } from "@/modules/reports/utils/email-template";

const sendReportSchema = z.object({
  managerEmail: z.string().email(),
  employeeName: z.string().min(1),
  department: z.string().min(1),
  designation: z.string().min(1),
  managerName: z.string().min(1),
  reportDate: z.string().min(1),
  totalHours: z.number().nonnegative(),
  tasks: z.array(
    z.object({
      description: z.string().optional(),
      category: z.string().optional(),
      priority: z.string().optional(),
      status: z.string().optional(),
      timeSpent: z.union([z.number(), z.string()]).optional(),
      completion: z.union([z.number(), z.string()]).optional(),
      plannedBy: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  meetings: z.array(
    z.object({
      subject: z.string().optional(),
      withWhom: z.string().optional(),
      time: z.string().optional(),
      duration: z.union([z.number(), z.string()]).optional(),
      type: z.string().optional(),
      outcome: z.string().optional(),
    })
  ),
  pending: z.string().optional().default(""),
  blockers: z.string().optional().default(""),
  tomorrowPlan: z.string().optional().default(""),
  keyAccomplishments: z.string().optional().default(""),
  overallScore: z.union([z.string(), z.number()]).optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate request using signed session cookie
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("rm_session")?.value;
    const verifiedEmployeeId = cookieVal ? await verifyToken(cookieVal) : null;

    if (!verifiedEmployeeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate input schema using Zod
    const body = await request.json();
    const result = sendReportSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload parameters", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // 3. Generate HTML email structure
    const htmlBody = generateHtmlEmail(data);

    // 4. Mock Email Send Integration (simulate latency)
    // Structured logging or error logs only. No raw console.log output.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      message: "Email processed and logged successfully",
      length: htmlBody.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during submission" },
      { status: 500 }
    );
  }
}
