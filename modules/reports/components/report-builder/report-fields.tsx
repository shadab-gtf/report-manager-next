"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

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
          className={`h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 ${icon ? "pl-9" : ""
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
          className={`h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 ${icon ? "pl-9" : ""
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

export function TimePickerField({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hours = Math.floor(value || 0);
  const minutes = Math.round(((value || 0) - hours) * 60);

  const displayValue = value ? `${hours}h ${minutes}m` : "0h 0m";

  const handleSave = (newHours: number, newMinutes: number) => {
    const totalHours = newHours + newMinutes / 60;
    onChange(Number(totalHours.toFixed(2)));
  };

  return (
    <label className="grid gap-2 text-xs font-bold text-foreground relative">
      {label}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <div
          onClick={() => setIsOpen(true)}
          className={`flex h-11 w-full items-center rounded-md border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 cursor-pointer ${icon ? "pl-9" : ""
            }`}
        >
          {displayValue}
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="relative z-[99999]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 rounded-[28px] bg-white p-8 shadow-2xl"
              >
                <h3 className="text-[22px] font-bold text-slate-800">Time spent</h3>
                <div className="flex items-center gap-4">
                  <WheelPicker
                    options={Array.from({ length: 24 }, (_, i) => i)}
                    value={hours}
                    onChange={(h) => handleSave(h, minutes)}
                    label="hours"
                  />
                  <div className="text-2xl font-bold text-slate-300">:</div>
                  <WheelPicker
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    value={minutes}
                    onChange={(m) => handleSave(hours, m)}
                    label="min"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 w-full rounded-xl bg-[#2563EB] px-4 py-3.5 text-[15px] font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Confirm
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </label>
  );
}

function WheelPicker({
  options,
  value,
  onChange,
  label,
}: {
  options: number[];
  value: number;
  onChange: (val: number) => void;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 44;
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isScrolling.current && containerRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        containerRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
  }, [value, options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrolling.current = true;
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    if (options[index] !== undefined && options[index] !== value) {
      onChange(options[index]);
    }

    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  };

  return (
    <div className="relative h-[220px] w-32 overflow-hidden rounded-2xl bg-slate-50/50 border border-slate-100">
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[44px] -translate-y-1/2 bg-slate-200/40 border-y border-slate-200" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ paddingBottom: '88px', paddingTop: '88px' }}
      >
        {options.map((opt) => (
          <div
            key={opt}
            className={`flex h-[44px] snap-center items-center justify-center text-xl transition-colors ${opt === value ? 'font-bold text-slate-900' : 'font-medium text-slate-400'
              }`}
          >
            {opt} <span className="ml-1.5 text-[15px] font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
