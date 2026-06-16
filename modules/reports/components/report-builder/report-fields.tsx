"use client";

import { PlusIcon } from "@heroicons/react/24/outline";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-input bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        type="number"
        value={value}
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 rounded-md border border-input bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      />
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
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="h-11 rounded-md border border-input bg-card px-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-44 rounded-md border border-input bg-card px-3 py-3 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
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
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-dashed border-primary/50 px-4 text-sm font-semibold text-primary hover:bg-primary-light/40"
    >
      <PlusIcon className="h-4 w-4" />
      {children}
    </button>
  );
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input
        readOnly
        value={value}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none"
      />
    </label>
  );
}
