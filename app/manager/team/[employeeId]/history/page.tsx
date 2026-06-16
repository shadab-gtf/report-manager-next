import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { EmployeeHistory } from "@/modules/manager/components/employee-history";

interface PageProps {
  params: Promise<{ employeeId: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Report History - ${resolvedParams.employeeId}`,
    description: "Employee report submission logs history.",
  };
}

export default async function EmployeeHistoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams || {};
  const initialTab = resolvedSearchParams.tab === "missed" ? "missed" : "submitted";
  return (
    <AppShell activeSegment="manager/team">
      <EmployeeHistory employeeId={resolvedParams.employeeId} initialTab={initialTab} />
    </AppShell>
  );
}
