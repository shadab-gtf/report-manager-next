"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  icon,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-xs font-bold text-foreground">
      {label}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 ${
            icon ? "pl-9" : ""
          } ${suffix ? "pr-9" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  icon,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-xs font-bold text-foreground">
      {label}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type="number"
          value={value}
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 ${
            icon ? "pl-9" : ""
          } ${suffix ? "pr-9" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}

export function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: readonly TValue[];
  onChange: (value: TValue) => void;
}) {
  const isStatusOrPriority = options.includes("Completed" as any) || options.includes("Medium" as any);
  
  let colorClass = "bg-card border-input text-foreground";
  let dotColor = "bg-transparent";
  
  if (value === "Completed") { colorClass = "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]"; dotColor = "bg-[#22c55e]"; }
  else if (value === "Medium") { colorClass = "bg-[#fffbeb] border-[#fde68a] text-[#92400e]"; dotColor = "bg-[#f59e0b]"; }
  else if (value === "High" || value === "Critical") { colorClass = "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]"; dotColor = "bg-[#ef4444]"; }
  else if (value === "In Progress") { colorClass = "bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af]"; dotColor = "bg-[#3b82f6]"; }
  else if (value === "Pending") { colorClass = "bg-[#f8fafc] border-[#e2e8f0] text-[#475569]"; dotColor = "bg-[#94a3b8]"; }
  else if (value === "Abort") { colorClass = "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]"; dotColor = "bg-[#ef4444]"; }
  else if (value === "Low") { colorClass = "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]"; dotColor = "bg-[#22c55e]"; }

  return (
    <label className="grid gap-2 text-xs font-bold text-foreground">
      {label}
      <div className="relative">
        {isStatusOrPriority && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${dotColor}`} />
        )}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as TValue)}
          className={`h-11 w-full rounded-md border px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/20 appearance-none transition-colors ${colorClass} ${isStatusOrPriority ? "pl-8" : ""}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </label>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-xs font-bold text-foreground">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[72px] rounded-md border border-input bg-card px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}

export function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg border border-dashed border-[#2563eb]/30 bg-[#f8fafc] px-4 text-sm font-bold text-[#2563eb] hover:bg-blue-50 transition-colors"
    >
      <PlusIcon className="h-5 w-5" />
      {children}
    </button>
  );
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2 text-sm font-normal text-foreground">
      {label}
      <input
        readOnly
        value={value}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none"
      />
    </label>
  );
}
