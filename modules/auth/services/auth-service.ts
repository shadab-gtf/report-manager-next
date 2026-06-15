import type { AuthSession, SignupEmployeeInfo } from "@/types/auth";

export async function loginWithMockApi(
  identifier: string,
): Promise<AuthSession> {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  return {
    employeeId: identifier.includes("@") ? "GTF-1042" : identifier,
    name: "Kuldeep",
    email: identifier.includes("@") ? identifier : "kuldeep.choudhary@gtftechnologies.com",
    reportingManager: "Saurabh Yadav",
    reportingManagerEmail: "saurabh.yadav@gtftechnologies.com",
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
