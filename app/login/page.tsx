import type { Metadata } from "next";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Access daily reporting, drafts, offline submissions, and manager workflows from one secure workspace."
    >
      <LoginForm />
    </AuthShell>
  );
}
