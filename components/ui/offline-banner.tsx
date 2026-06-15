"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

export function OfflineBanner() {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (isOnline) {
    return null;
  }

  return (
    <div className="border-b border-warning/30 bg-warning-light px-4 py-2 text-center text-sm font-semibold text-warning">
      Offline mode active. Drafts are saved locally and submissions will queue.
    </div>
  );
}
