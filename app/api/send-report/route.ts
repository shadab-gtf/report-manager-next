import { NextResponse } from "next/server";
import { generateHtmlEmail } from "@/modules/reports/utils/email-template";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Generate the rich HTML template
    const htmlBody = generateHtmlEmail(data);

    // 2. Mock Email Service Integration
    // In production, use Resend, SendGrid, or Nodemailer here.
    // e.g., await resend.emails.send({ to: data.managerEmail, html: htmlBody, ... })

    console.log(`[Email Mock] Successfully sent HTML report to ${data.managerEmail}`);
    console.log(`[Email Mock] Subject: Daily Report - ${data.reportDate}`);
    console.log(`[Email Mock] HTML Body Length: ${htmlBody.length} characters`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
