"use client";

import { useEffect } from "react";
import type { AuthSession } from "@/types/auth";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/store";

export function SessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const rawSession = window.localStorage.getItem("report-manager-session");
    if (!rawSession) {
      return;
    }

    try {
      dispatch(setSession(JSON.parse(rawSession) as AuthSession));
    } catch {
      window.localStorage.removeItem("report-manager-session");
    }
  }, [dispatch]);

  return null;
}
