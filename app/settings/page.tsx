import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <AppShell activeSegment="settings">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-card-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enterprise preferences prepared for backend policy integration.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="font-semibold text-foreground">Role management</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Access is controlled by login role, Redux session state, and
              middleware cookies. Manager-only routes are protected.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="font-semibold text-foreground">Notifications</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Draft saved, report submitted, sync successful, offline, and
              back-online events are available in the notification center.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="font-semibold text-foreground">Email routing</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Report submission auto-selects the reporting manager and prepares
              the task-title subject with a complete report email body.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5">
            <p className="font-semibold text-foreground">PWA operations</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Install prompt, service worker, app manifest, icons, and offline
              draft recovery are configured.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
