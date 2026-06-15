"use client";

import { AppShell } from "@/components/sections/app-shell";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <AppShell>
      <section className="rounded-lg border border-danger/30 bg-card p-6">
        <p className="text-sm font-semibold text-danger">Dashboard error</p>
        <h1 className="mt-3 text-2xl font-semibold text-card-foreground">
          The workspace could not be loaded.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {error.message || "A temporary application error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Retry
        </button>
      </section>
    </AppShell>
  );
}
