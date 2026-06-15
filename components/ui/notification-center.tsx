"use client";

import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNotificationStore } from "@/modules/notifications/store/notification-store";

const toneClassName = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  info: "bg-info-light text-info",
  danger: "bg-danger-light text-danger",
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, dismissNotification, addNotification } =
    useNotificationStore();

  useEffect(() => {
    const online = () =>
      addNotification({
        title: "Back online",
        message: "Queued submissions can now sync.",
        tone: "success",
      });
    const offline = () =>
      addNotification({
        title: "Offline mode",
        message: "Drafts are stored locally until connectivity returns.",
        tone: "warning",
      });

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, [addNotification]);

  return (
    <div className="relative">
      <button
        type="button"
        title="Notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <BellIcon aria-hidden="true" className="h-5 w-5" />
        {notifications.length > 0 ? (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        ) : null}
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-32px))] rounded-lg border border-border bg-card p-3 shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <p className="text-sm font-semibold text-card-foreground">
              Notifications
            </p>
            <button
              type="button"
              title="Close notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <XMarkIcon aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid max-h-96 gap-2 overflow-auto">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className="rounded-md border border-border bg-background p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${toneClassName[notification.tone]}`}
                  >
                    {notification.tone}
                  </span>
                  <button
                    type="button"
                    title="Dismiss notification"
                    onClick={() => dismissNotification(notification.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <XMarkIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {notification.message}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
