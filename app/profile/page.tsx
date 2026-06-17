import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppShell } from "@/components/sections/app-shell";
import { getEmployeeProfile } from "@/app/api/auth/login/route";
import { verifyToken } from "@/lib/security/cookie-signer";
import { BiometricToggle } from "@/modules/auth/components/biometric-toggle";
import { 
  UserIcon, 
  IdentificationIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  EnvelopeIcon, 
  DevicePhoneMobileIcon 
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("rm_session")?.value;
  const employeeId = sessionToken ? await verifyToken(sessionToken) : "GTF-1042";

  const profile = getEmployeeProfile(employeeId || "GTF-1042");

  const profileData = [
    { label: "Employee ID", value: profile.employeeId, icon: IdentificationIcon },
    { label: "Name", value: profile.name, icon: UserIcon },
    { label: "Designation", value: profile.designation, icon: BriefcaseIcon },
    { label: "Department", value: profile.department, icon: BuildingOfficeIcon },
    { label: "Reporting Manager", value: profile.reportingManager, icon: ShieldCheckIcon },
    { label: "Official Email", value: profile.email, icon: EnvelopeIcon },
    { label: "Mobile Number", value: profile.mobileNumber, icon: DevicePhoneMobileIcon },
  ];

  return (
    <AppShell activeSegment="profile">
      <div className="grid gap-6">
        {/* ── Profile Information ── */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Employee Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View and manage employee personal and professional information.
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {profileData.map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">{item.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security Settings ── */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Security Settings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your authentication preferences for this device.
              </p>
            </div>
          </div>
          <div>
            <BiometricToggle employeeId={profile.employeeId} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

