import type { Metadata } from "next";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { SignupFlow } from "@/modules/auth/components/signup-flow";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Employee onboarding"
      description="Create an employee account with profile validation, password security, and email OTP verification."
    >
      <SignupFlow />
    </AuthShell>
  );
}
