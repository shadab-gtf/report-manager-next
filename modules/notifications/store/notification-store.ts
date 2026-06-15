"use client";

import { create } from "zustand";
import { createId } from "@/lib/utils/format";

export type NotificationTone = "success" | "warning" | "info" | "danger";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  tone: NotificationTone;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "createdAt">) => void;
  dismissNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "seed-draft",
      title: "Draft autosave ready",
      message: "Daily reports are saved locally while you work.",
      tone: "info",
      createdAt: new Date().toISOString(),
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: createId("notification"),
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ].slice(0, 8),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
}));
