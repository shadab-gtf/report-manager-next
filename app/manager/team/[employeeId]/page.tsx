import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { EmployeeDetail } from "@/modules/manager/components/employee-detail";

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Team Member - ${resolvedParams.employeeId}`,
    description: "Employee productivity overview and workspace status.",
  };
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <AppShell activeSegment="manager/team">
      <EmployeeDetail employeeId={resolvedParams.employeeId} />
    </AppShell>
  );
}
