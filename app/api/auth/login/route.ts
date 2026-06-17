import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/security/cookie-signer";

export interface EmployeeProfile {
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  reportingManager: string;
  reportingManagerEmail: string;
  mobileNumber: string;
  role: "employee" | "manager";
}

export const mockEmployees: Record<string, EmployeeProfile> = {
  "GTF-1042": {
    employeeId: "GTF-1042",
    name: "Kuldeep",
    email: "kuldeep.choudhary@gtftechnologies.com",
    designation: "Operations Associate",
    department: "Operations",
    reportingManager: "Saurabh Yadav",
    reportingManagerEmail: "saurabh.yadav@gtftechnologies.com",
    mobileNumber: "9876543210",
    role: "employee",
  },
  "GTF-1005": {
    employeeId: "GTF-1005",
    name: "Kuldeep Choudhary",
    email: "kuldeep.c@gtftechnologies.com",
    designation: "Software Engineer",
    department: "Technology",
    reportingManager: "Saurabh Yadav",
    reportingManagerEmail: "saurabh.yadav@gtftechnologies.com",
    mobileNumber: "9876543211",
    role: "employee",
  },
  "MGR-1001": {
    employeeId: "MGR-1001",
    name: "Saurabh Yadav",
    email: "saurabh.yadav@gtftechnologies.com",
    designation: "Engineering Manager",
    department: "Technology",
    reportingManager: "VP of Engineering",
    reportingManagerEmail: "vp@gtftechnologies.com",
    mobileNumber: "9876543212",
    role: "manager",
  },
};

export function getEmployeeProfile(identifier: string): EmployeeProfile {
  const cleanId = identifier.includes("@")
    ? (identifier.toLowerCase().includes("saurabh.yadav") || identifier.toLowerCase().includes("manager")
      ? "MGR-1001"
      : (identifier.toLowerCase().includes("kuldeep.choudhary") ? "GTF-1042" : "GTF-1005"))
    : identifier;

  if (mockEmployees[cleanId]) {
    return mockEmployees[cleanId];
  }

  const isManager = cleanId.startsWith("MGR-") || cleanId.toLowerCase().includes("manager");

  // Dynamic profile fallback for new registrations
  return {
    employeeId: cleanId,
    name: cleanId.split("-")[1]
      ? `${isManager ? "Manager" : "User"} ${cleanId.split("-")[1]}`
      : (isManager ? "Manager User" : "Employee User"),
    email: `${cleanId.toLowerCase()}@gtftechnologies.com`,
    designation: isManager ? "Engineering Manager" : "Software Engineer",
    department: "Technology",
    reportingManager: isManager ? "VP of Engineering" : "Saurabh Yadav",
    reportingManagerEmail: isManager ? "vp@gtftechnologies.com" : "saurabh.yadav@gtftechnologies.com",
    mobileNumber: "9999999999",
    role: isManager ? "manager" : "employee",
  };
}

export async function POST(request: Request) {
  try {
    const { identifier, password, bypassPassword, rememberMe } = await request.json();

    if (!identifier) {
      return NextResponse.json({ error: "Employee ID or email is required" }, { status: 400 });
    }

    if (!bypassPassword) {
      if (!password) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      if (password !== "password123") {
        return NextResponse.json({ error: "Invalid password. Try 'password123'." }, { status: 401 });
      }
    }

    const profile = getEmployeeProfile(identifier);
    const signedSessionCookie = await signToken(profile.employeeId);

    const maxAge = rememberMe ? 2_592_000 : 86_400;
    const secure = process.env.NODE_ENV === "production";

    const cookieStore = await cookies();
    cookieStore.set("rm_session", signedSessionCookie, {
      path: "/",
      maxAge,
      sameSite: "strict",
      secure,
      httpOnly: false,
    });

    cookieStore.set("rm_role", profile.role, {
      path: "/",
      maxAge,
      sameSite: "strict",
      secure,
    });

    return NextResponse.json({
      employeeId: profile.employeeId,
      name: profile.name,
      email: profile.email,
      reportingManager: profile.reportingManager,
      reportingManagerEmail: profile.reportingManagerEmail,
      role: profile.role,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
