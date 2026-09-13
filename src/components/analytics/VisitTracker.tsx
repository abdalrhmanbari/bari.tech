"use client";

import { useEffect } from "react";

const SESSION_KEY = "visit-tracked";

/** Fires one visit ping per browser tab (sessionStorage is per-tab, not per-window/browser). Renders nothing. */
export function VisitTracker() {
  useEffect(() => {
    let alreadyTracked = false;
    try {
      alreadyTracked = sessionStorage.getItem(SESSION_KEY) === "1";
      if (!alreadyTracked) sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (private mode, etc.) — fall through and count this mount.
    }
    if (alreadyTracked) return;

    fetch("/api/visits", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
