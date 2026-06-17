"use client";

import { motion } from "framer-motion";
import React from "react";

interface TabItem {
  id: string;
  label: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: (string | TabItem)[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  layoutId?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  indicatorClassName?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onTabChange,
  layoutId = "active-tab-indicator",
  className = "flex space-x-1 rounded-xl bg-muted p-1",
  tabClassName = "relative w-full rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  activeTabClassName = "text-foreground",
  indicatorClassName = "absolute inset-0 rounded-lg bg-background shadow-sm",
}: AnimatedTabsProps) {
  return (
    <div className={className}>
      {tabs.map((tab) => {
        const id = typeof tab === "string" ? tab : tab.id;
        const label = typeof tab === "string" ? tab : tab.label;
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`${tabClassName} ${isActive ? activeTabClassName : "text-muted-foreground hover:text-foreground"}`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={indicatorClassName}
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
