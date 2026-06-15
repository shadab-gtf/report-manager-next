import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { listTeamReports } from "@/modules/team/services/team-repository";

export const metadata: Metadata = {
  title: "Team",
};

export default async function TeamPage() {
  const reports = await listTeamReports();
  const submitted = reports.filter((report) => report.status !== "Missing").length;

  return (
    <AppShell activeSegment="team">
      <section className="grid gap-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Team Reporting
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manager-ready compliance overview for reporting hierarchies.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Metric label="Submitted" value={`${submitted}/${reports.length}`} />
            <Metric label="Average completion" value="65%" />
            <Metric label="Escalations" value="1" />
          </div>
        </div>
        <TeamReportsTable />
      </section>
    </AppShell>
  );
}

async function TeamReportsTable() {
  const reports = await listTeamReports();
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Hours</th>
            <th className="px-4 py-3">Completion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-muted/70">
              <td className="px-4 py-4">
                <p className="font-semibold text-foreground">{report.employeeName}</p>
                <p className="text-xs text-muted-foreground">{report.employeeId}</p>
              </td>
              <td className="px-4 py-4">{report.department}</td>
              <td className="px-4 py-4">{report.status}</td>
              <td className="px-4 py-4">{report.hoursLogged}</td>
              <td className="px-4 py-4">{report.completion}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
