import type { Metadata } from "next";
import { AppShell } from "@/components/sections/app-shell";
import { DraftsPanel } from "@/modules/reports/components/drafts-panel";

export const metadata: Metadata = {
  title: "Drafts",
};

export default function DraftsPage() {
  return (
    <AppShell activeSegment="reports">
      <DraftsPanel />
    </AppShell>
  );
}
