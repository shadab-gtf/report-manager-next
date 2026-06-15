import type { AuthSession, SignupEmployeeInfo } from "@/types/auth";

export async function loginWithMockApi(
  identifier: string,
  role: "Employee" | "Manager",
): Promise<AuthSession> {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  return {
    employeeId: identifier.includes("@") ? "GTF-1042" : identifier,
    name: role === "Manager" ? "Priya Menon" : "Aarav Sharma",
    role,
    email: identifier.includes("@") ? identifier : "aarav.sharma@gtf.example",
    reportingManager: "Priya Menon",
    reportingManagerEmail: "priya.menon@gtf.example",
  };
}

export async function sendSignupOtp(
  employee: SignupEmployeeInfo,
): Promise<{ sentTo: string }> {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  return { sentTo: employee.officialEmail };
}

export async function verifySignupOtp(otp: string): Promise<boolean> {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  return otp === "123456";
}
