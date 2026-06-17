"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// Tick Sound Synthesizer
let audioCtx: AudioContext | null = null;
const playTick = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sine";
    // A quick, sharp click sound mimicking native scroll wheels
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) { }
};

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
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const openPopover = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setIsOpen(true);
  };

  const hours = Math.floor(value || 0);
  const minutes = Math.round(((value || 0) - hours) * 60);

  const displayValue = value ? `${hours}h ${minutes}m` : "0h 0m";

  const handleSave = (newHours: number, newMinutes: number) => {
    const totalHours = newHours + newMinutes / 60;
    onChange(Number(totalHours.toFixed(2)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPopover();
    }
  };

  return (
    <label className="grid gap-2 text-xs font-bold text-foreground relative">
      {label}
      <div className="relative" ref={triggerRef}>
        {icon && (
          <div className="absolute left-3 top-0 bottom-0 md:bottom-3 flex items-center justify-center text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <div
          tabIndex={0}
          onClick={openPopover}
          onKeyDown={handleKeyDown}
          className={`flex h-11 w-full items-center rounded-md border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 cursor-pointer transition-colors hover:bg-slate-50 ${icon ? "pl-9" : ""
            }`}
        >
          {displayValue}
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="relative z-[99999]">
              {/* Invisible backdrop to catch outside clicks and block scrolling lightly */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-transparent"
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ top: coords.top, left: coords.left }}
                className="fixed flex flex-col items-center gap-4 rounded-[20px] bg-white p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100"
              >
                <div className="flex items-center gap-1">
                  <WheelPicker
                    options={Array.from({ length: 24 }, (_, i) => i)}
                    value={hours}
                    onChange={(h) => handleSave(h, minutes)}
                    label="h"
                  />
                  <div className="text-xl font-bold text-slate-300 pb-1">:</div>
                  <WheelPicker
                    options={Array.from({ length: 60 }, (_, i) => i)}
                    value={minutes}
                    onChange={(m) => handleSave(hours, m)}
                    label="m"
                  />
                </div>
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
  const ITEM_HEIGHT = 40;
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = options.indexOf(value);
      if (currentIndex > 0) onChange(options[currentIndex - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = options.indexOf(value);
      if (currentIndex < options.length - 1) onChange(options[currentIndex + 1]);
    }
  };

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
    const newValue = options[index];

    if (newValue !== undefined && newValue !== value) {
      playTick();
      onChange(newValue);
    }

    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  };

  return (
    <div
      className="relative h-[160px] w-16 overflow-hidden rounded-xl bg-slate-50/50 border border-slate-100 focus:ring-2 focus:ring-primary/20 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[40px] -translate-y-1/2 bg-slate-200/40 border-y border-slate-200" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ paddingBottom: '60px', paddingTop: '60px' }}
      >
        {options.map((opt) => (
          <div
            key={opt}
            className={`flex h-[40px] snap-center items-center justify-center text-lg transition-colors cursor-pointer select-none ${opt === value ? 'font-bold text-slate-900' : 'font-medium text-slate-400'
              }`}
            onClick={() => onChange(opt)}
          >
            {opt} <span className="ml-1 text-[13px] font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
