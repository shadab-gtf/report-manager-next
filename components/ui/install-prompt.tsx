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
      title="Install app"
      onClick={async () => {
        await installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
      }}
      className="hidden min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground hover:bg-muted sm:inline-flex"
    >
      <ArrowDownTrayIcon aria-hidden="true" className="h-4 w-4" />
      Install
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
