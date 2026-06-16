import type { AuthSession, SignupEmployeeInfo } from "@/types/auth";

export async function loginWithMockApi(
  identifier: string,
  password?: string,
  rememberMe: boolean = true
): Promise<AuthSession> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, rememberMe }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Authentication failed. Try 'password123'.");
  }

  return response.json();
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
