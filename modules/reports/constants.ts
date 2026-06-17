import type { MeetingType, TaskPriority, TaskStatus } from "@/types/report";

export const taskPriorities: TaskPriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const taskStatuses: TaskStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Aborted",
];

export const meetingTypes: MeetingType[] = [
  "Meeting",
  "Call",
  "Review",
  "Standup",
];
