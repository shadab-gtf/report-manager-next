import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/modules/auth/components/auth-shell";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recover access"
      description="Password recovery is prepared for future identity provider integration."
    >
      <form className="grid gap-4">
        <label className="grid gap-2 text-sm font-normal text-foreground">
          Employee ID or official email
          <input className="h-11 rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
        </label>
        <button
          type="button"
          className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Send recovery link
        </button>
        <Link href="/login" className="text-sm font-semibold text-primary">
          Return to login
        </Link>
      </form>
    </AuthShell>
  );
}
