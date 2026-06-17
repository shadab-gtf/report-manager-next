"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ClockIcon,
  ChevronUpDownIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useTeam } from "../hooks/use-team";
import { TeamMember } from "../types/manager";
import { PageTransition } from "@/components/motion/page-transition";

const columnHelper = createColumnHelper<TeamMember>();

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-blue-100 text-blue-700",
    "bg-red-100 text-red-700",
    "bg-primary-light text-primary",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
};

export function TeamTable() {
  const [query, setQuery] = useState("");

  const { data: team = [], isLoading } = useTeam({
    query,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("employeeId", {
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            EMPLOYEE ID
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => <span className="  text-xs font-bold text-slate-700">{info.getValue()}</span>,
      }),
      columnHelper.accessor("name", {
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            EMPLOYEE NAME
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => {
          const name = info.getValue();
          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(
                  name
                )}`}
              >
                {getInitials(name)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">{info.row.original.email}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("department", {
        header: () => (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            DEPARTMENT
            <ChevronUpDownIcon className="h-3 w-3" />
          </div>
        ),
        cell: (info) => (
          <div>
            <p className="text-sm font-bold text-slate-900">{info.getValue()}</p>
            <p className="text-xs text-slate-500">{info.row.original.designation}</p>
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => (
          <div className="text-[11px] font-bold text-slate-500">ACTIONS</div>
        ),
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/manager/team/${info.row.original.employeeId}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-slate-50 transition-colors"
            >
              <EyeIcon className="h-3.5 w-3.5" />
              View Detail
            </Link>
            <Link
              href={`/manager/team/${info.row.original.employeeId}/history`}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ClockIcon className="h-3.5 w-3.5" />
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
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light/50 text-primary">
          <UsersIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Team Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            View assigned employees, check today's submission compliance, and browse historical logs.
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex items-center">
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, ID, department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
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
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
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
                  <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
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
