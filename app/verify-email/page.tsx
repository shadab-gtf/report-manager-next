import type { Metadata } from "next";
import { AuthShell } from "@/modules/auth/components/auth-shell";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify official email"
      description="Enter the OTP sent to your registered work email."
    >
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-foreground">
          OTP
          <input
            defaultValue="123456"
            className="h-11 rounded-md border border-input bg-background px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </label>
        <button className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover">
          Verify email
        </button>
      </div>
    </AuthShell>
  );
}
