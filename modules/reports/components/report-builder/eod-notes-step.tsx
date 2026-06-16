"use client";

import { TextareaField } from "./report-fields";
import type { EndOfDayNotes } from "@/types/report";

interface EodNotesStepProps {
  notes: EndOfDayNotes;
  onChange: (notes: EndOfDayNotes) => void;
}

export function EodNotesStep({ notes, onChange }: EodNotesStepProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TextareaField
        label="Pending / Carry Forward"
        value={notes.pending}
        onChange={(value) => onChange({ ...notes, pending: value })}
      />
      <TextareaField
        label="Blockers / Challenges"
        value={notes.blockers}
        onChange={(value) => onChange({ ...notes, blockers: value })}
      />
      <TextareaField
        label="Plan For Tomorrow"
        value={notes.tomorrowPlan}
        onChange={(value) => onChange({ ...notes, tomorrowPlan: value })}
      />
    </div>
  );
}
