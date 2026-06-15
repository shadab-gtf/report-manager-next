"use client";

import type { AuthSession } from "@/types/auth";

export function persistSession(session: AuthSession, rememberMe: boolean) {
  const maxAge = rememberMe ? 2_592_000 : 86_400;
  window.localStorage.setItem("report-manager-session", JSON.stringify(session));
  setCookie("rm_session", session.employeeId, maxAge);
  setCookie("rm_role", session.role, maxAge);
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}
