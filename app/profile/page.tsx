import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <AppShell activeSegment="profile">
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Employee Profile
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Employee ID", "GTF-1005"],
            ["Name", "Kuldeep choudhary"],
            ["Designation", "Software Engineer"],
            ["Department", "Technology"],
            ["Reporting Manager", "Saurabh Yadav"],
            ["Official Email", "kuldeep.choudhary@gtftechnologies.com"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
