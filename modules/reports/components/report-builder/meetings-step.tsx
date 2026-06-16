"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { TextField, NumberField, SelectField, AddButton } from "./report-fields";
import { meetingTypes } from "@/modules/reports/constants";
import type { MeetingLogItem } from "@/types/report";

interface MeetingsStepProps {
  meetings: MeetingLogItem[];
  updateMeeting: (meetingId: string, patch: Partial<MeetingLogItem>) => void;
  addMeeting: () => void;
  removeMeeting: (meetingId: string) => void;
}

export function MeetingsStep({
  meetings,
  updateMeeting,
  addMeeting,
  removeMeeting,
}: MeetingsStepProps) {
  return (
    <div className="grid gap-4">
      {meetings.map((meeting, index) => (
        <div key={meeting.id} className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-foreground">Meeting {index + 1}</h2>
            <button
              type="button"
              title="Remove meeting"
              onClick={() => removeMeeting(meeting.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-danger hover:bg-danger-light"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <TextField
              label="Subject"
              value={meeting.subject}
              onChange={(value) => updateMeeting(meeting.id, { subject: value })}
            />
            <TextField
              label="With whom"
              value={meeting.withWhom}
              onChange={(value) => updateMeeting(meeting.id, { withWhom: value })}
            />
            <TextField
              label="Time"
              type="time"
              value={meeting.time}
              onChange={(value) => updateMeeting(meeting.id, { time: value })}
            />
            <NumberField
              label="Duration"
              value={meeting.duration}
              onChange={(value) => updateMeeting(meeting.id, { duration: value })}
            />
            <SelectField
              label="Type"
              value={meeting.type}
              options={meetingTypes}
              onChange={(value) => updateMeeting(meeting.id, { type: value })}
            />
          </div>
        </div>
      ))}
      <AddButton onClick={addMeeting}>Add meeting entry</AddButton>
    </div>
  );
}
