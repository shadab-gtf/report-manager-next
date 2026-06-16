import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/security/cookie-signer";

const sendNudgeSchema = z.object({
  employeeEmail: z.string().email(),
  employeeName: z.string().min(1),
  date: z.string().min(1),
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
    const result = sendNudgeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload parameters", details: result.error.format() },
        { status: 400 }
      );
    }

    // 3. Mock Email Send latency (simulate email delivery)
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      message: "Email reminder processed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during email dispatch" },
      { status: 500 }
    );
  }
}
