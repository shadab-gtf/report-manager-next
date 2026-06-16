"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { reportDb } from "@/modules/reports/services/report-db";
import type { DailyReportDraft, MeetingLogItem, TaskLogItem } from "@/types/report";
import { createId } from "@/lib/utils/format";
import { getLocalDateString } from "@/modules/reports/services/report-repository";

function createEmptyDraft(): DailyReportDraft {
  const today = getLocalDateString();

  return {
    id: "current-draft",
    employeeId: "GTF-1042",
    reportDate: today,
    status: "Draft",
    updatedAt: new Date().toISOString(),
    tasks: [
      {
        id: createId("task"),
        description: "",
        category: "Other",
        priority: "Medium",
        timeSpent: 0,
        completion: 0,
        status: "In Progress",
        expectedCompletionDate: today,
        notes: "",
      },
    ],
    meetings: [
      {
        id: createId("meeting"),
        subject: "",
        withWhom: "",
        time: "10:00",
        duration: 30,
        type: "Meeting",
      },
    ],
    notes: {
      pending: "",
      blockers: "",
      tomorrowPlan: "",
    },
  };
}

function subscribeOnlineStatus(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot(): boolean {
  return navigator.onLine;
}

function getServerOnlineSnapshot(): boolean {
  return true;
}

export function useReportDraft() {
  const [draft, setDraft] = useState<DailyReportDraft>(() => createEmptyDraft());
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getServerOnlineSnapshot,
  );

  useEffect(() => {
    let isMounted = true;

    reportDb.drafts.get("current-draft").then((savedDraft) => {
      if (!isMounted) {
        return;
      }
      const todayStr = getLocalDateString();
      if (savedDraft) {
        if (savedDraft.reportDate !== todayStr) {
          const freshDraft = createEmptyDraft();
          setDraft(freshDraft);
          reportDb.drafts.put(freshDraft);
        } else {
          setDraft(savedDraft);
          setLastSavedAt(savedDraft.updatedAt);
        }
      } else {
        const freshDraft = createEmptyDraft();
        setDraft(freshDraft);
        reportDb.drafts.put(freshDraft);
      }
      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveDraft = useCallback(async (nextDraft: DailyReportDraft) => {
    const updatedDraft = {
      ...nextDraft,
      updatedAt: new Date().toISOString(),
    };
    await reportDb.drafts.put(updatedDraft);
    setLastSavedAt(updatedDraft.updatedAt);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      saveDraft(draft);
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [draft, isLoaded, saveDraft]);

  const updateTask = useCallback(
    (taskId: string, patch: Partial<TaskLogItem>) => {
      setDraft((current) => ({
        ...current,
        tasks: current.tasks.map((task) =>
          task.id === taskId ? { ...task, ...patch } : task,
        ),
      }));
    },
    [],
  );

  const addTask = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDraft((current) => ({
      ...current,
      tasks: [
        ...current.tasks,
        {
          id: createId("task"),
          description: "",
          category: "Other",
          priority: "Medium",
          timeSpent: 0,
          completion: 0,
          status: "In Progress",
          expectedCompletionDate: today,
          notes: "",
        },
      ],
    }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setDraft((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }));
  }, []);

  const updateMeeting = useCallback(
    (meetingId: string, patch: Partial<MeetingLogItem>) => {
      setDraft((current) => ({
        ...current,
        meetings: current.meetings.map((meeting) =>
          meeting.id === meetingId ? { ...meeting, ...patch } : meeting,
        ),
      }));
    },
    [],
  );

  const addMeeting = useCallback(() => {
    setDraft((current) => ({
      ...current,
      meetings: [
        ...current.meetings,
        {
          id: createId("meeting"),
          subject: "",
          withWhom: "",
          time: "10:00",
          duration: 30,
          type: "Meeting",
        },
      ],
    }));
  }, []);

  const removeMeeting = useCallback((meetingId: string) => {
    setDraft((current) => ({
      ...current,
      meetings: current.meetings.filter((meeting) => meeting.id !== meetingId),
    }));
  }, []);

  const submitReport = useCallback(async () => {
    const reportId = `report-${draft.reportDate}`;
    const submittedDraft: DailyReportDraft = {
      ...draft,
      id: reportId,
      status: isOnline ? "Submitted" : "Queued",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isOnline) {
      await reportDb.drafts.put(submittedDraft);
    } else {
      await reportDb.queue.put(submittedDraft);
      await reportDb.drafts.put(submittedDraft);
    }

    const updatedCurrentDraft: DailyReportDraft = {
      ...draft,
      status: isOnline ? "Submitted" : "Queued",
      submittedAt: submittedDraft.submittedAt,
      updatedAt: submittedDraft.updatedAt,
    };
    await reportDb.drafts.put(updatedCurrentDraft);

    setDraft(updatedCurrentDraft);
    setLastSavedAt(updatedCurrentDraft.updatedAt);

  }, [draft, isOnline]);

  const totalHours = useMemo(
    () => draft.tasks.reduce((total, task) => total + Number(task.timeSpent || 0), 0),
    [draft.tasks],
  );

  return {
    draft,
    setDraft,
    isLoaded,
    isOnline,
    lastSavedAt,
    totalHours,
    saveDraft,
    updateTask,
    addTask,
    removeTask,
    updateMeeting,
    addMeeting,
    removeMeeting,
    submitReport,
  };
}
