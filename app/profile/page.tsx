import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppShell } from "@/components/sections/app-shell";
import { getEmployeeProfile } from "@/app/api/auth/login/route";
import { verifyToken } from "@/lib/security/cookie-signer";
import { BiometricToggle } from "@/modules/auth/components/biometric-toggle";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("rm_session")?.value;
  const employeeId = sessionToken ? await verifyToken(sessionToken) : "GTF-1042";

  const profile = getEmployeeProfile(employeeId || "GTF-1042");

  const profileData = [
    ["Employee ID", profile.employeeId],
    ["Name", profile.name],
    ["Designation", profile.designation],
    ["Department", profile.department],
    ["Reporting Manager", profile.reportingManager],
    ["Official Email", profile.email],
    ["Mobile Number", profile.mobileNumber],
  ];

  return (
    <AppShell activeSegment="profile">
      <div className="grid gap-6">
        {/* ── Profile Information ── */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Employee Profile
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {profileData.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security Settings ── */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-card-foreground">
            Security Settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your authentication preferences for this device.
          </p>
          <div className="mt-5">
            <BiometricToggle employeeId={profile.employeeId} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

