"use client";

import type { AuthSession } from "@/types/auth";

export function persistSession(session: AuthSession, rememberMe: boolean) {
  window.localStorage.setItem("report-manager-session", JSON.stringify(session));
}
