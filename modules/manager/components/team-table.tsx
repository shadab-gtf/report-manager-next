"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTeam } from "../hooks/use-team";
import { TeamMember } from "../types/manager";
import { AnimatedTabs } from "@/components/motion/animated-tabs";
import { PageTransition } from "@/components/motion/page-transition";

const columnHelper = createColumnHelper<TeamMember>();

export function TeamTable() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Submitted" | "Missing">("All");

  const { data: team = [], isLoading } = useTeam({
    query,
    statusToday: statusFilter,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("employeeId", {
        header: "Employee ID",
        cell: (info) => <span className="font-mono text-xs font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor("name", {
        header: "Employee Name",
        cell: (info) => (
          <div>
            <p className="font-semibold text-foreground">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground">{info.row.original.email}</p>
          </div>
        ),
      }),
      columnHelper.accessor("department", {
        header: "Department",
        cell: (info) => (
          <div>
            <p className="text-sm font-medium">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground">{info.row.original.designation}</p>
          </div>
        ),
      }),
      columnHelper.accessor("complianceRate", {
        header: "Compliance",
        cell: (info) => {
          const rate = info.getValue();
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 overflow-hidden rounded-full bg-muted-foreground/10">
                <div
                  className={`h-full rounded-full ${
                    rate >= 95 ? "bg-success" : rate >= 85 ? "bg-primary" : "bg-danger"
                  }`}
                  style={{ width: `${rate}%` }}
                />
              </div>
              <span className="text-xs font-semibold">{rate}%</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("statusToday", {
        header: "Today's Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                status === "Submitted"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/manager/team/${info.row.original.employeeId}`}
              className="rounded border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light"
            >
              View Detail
            </Link>
            <Link
              href={`/manager/team/${info.row.original.employeeId}/history`}
              className="rounded border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              History
            </Link>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: team,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageTransition className="grid gap-6">
      {/* Header Info */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-card-foreground">My Team Directory</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View assigned employees, check today's submission compliance, and browse historical logs.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="w-full max-w-[400px]">
          <AnimatedTabs
            tabs={["All", "Submitted", "Missing"]}
            activeTab={statusFilter}
            onTabChange={(tab) => setStatusFilter(tab as "All" | "Submitted" | "Missing")}
            layoutId="team-table-tabs"
          />
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, ID, department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 shadow-sm"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground font-semibold border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-3.5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Loading team directory...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No team members found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
