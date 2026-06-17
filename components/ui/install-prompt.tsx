"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const isStandalone = useSyncExternalStore(
    subscribeDisplayMode,
    getDisplayModeSnapshot,
    getServerDisplayModeSnapshot,
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  if (isStandalone || !installEvent) {
    return null;
  }

  return (
    <button
      type="button"
      title="Install the app"
      onClick={async () => {
        await installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
      }}
      className="hidden cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-1.5 pr-4 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 shadow-sm sm:inline-flex"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
        <ArrowDownTrayIcon aria-hidden="true" className="h-4 w-4 stroke-2" />
      </div>
      Install the App
    </button>
  );
}

function subscribeDisplayMode(callback: () => void): () => void {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

function getDisplayModeSnapshot(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}

function getServerDisplayModeSnapshot(): boolean {
  return false;
}
