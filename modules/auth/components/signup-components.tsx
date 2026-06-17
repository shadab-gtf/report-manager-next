"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

export function StepHeading({ title }: { title: string }) {
  return (
    <div className="flex flex-col mb-1">
      <h2 className="text-[28px] font-bold leading-tight text-slate-900">{title}</h2>
      <p className="mt-2 text-[15px] font-medium leading-relaxed text-slate-500">
        Fields validate instantly and preserve progress during onboarding.
      </p>
    </div>
  );
}

export function Field({
  label,
  registration,
  error,
  type = "text",
}: {
  label: string;
  registration: UseFormRegisterReturn<string>;
  error?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-slate-800">{label}</span>
      <input
        type={type}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 focus:bg-white"
        {...registration}
      />
      {error ? <span className="text-sm font-medium text-red-500">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  registration,
  error,
  options,
}: {
  label: string;
  registration: UseFormRegisterReturn<string>;
  error?: string;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-slate-800">{label}</span>
      <select
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 focus:bg-white"
        {...registration}
      >
        <option value="" disabled hidden>Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-sm font-medium text-red-500">{error}</span> : null}
    </label>
  );
}

export function PrimaryButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
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
      className="flex h-[52px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-[15px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm"
    >
      {children}
    </button>
  );
}
