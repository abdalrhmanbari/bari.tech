"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "visit-session";
/** Heartbeat cadence while the tab is visible; must stay well under the server's ACTIVE_WINDOW_MS. */
const PING_INTERVAL_MS = 30_000;

function readStoredId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function storeId(id: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    // sessionStorage unavailable (private mode, etc.) — a reload just counts as a new visit.
  }
}

function post(body: object) {
  return fetch("/api/visits", { method: "POST", body: JSON.stringify(body), keepalive: true });
}

/**
 * Opens one visit session per browser tab (sessionStorage is per-tab), then
 * sends a heartbeat while the tab is visible so the dashboard can show who's
 * on the site right now. Renders nothing.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const idRef = useRef<string | null>(null);
  const pathRef = useRef(pathname);
  const reportedPathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const res = await post({
          action: "start",
          path: pathRef.current,
          referrer: document.referrer,
          language: navigator.language,
        });
        const body = (await res.json()) as { id?: string | null };
        if (cancelled || !body.id) return;
        idRef.current = body.id;
        storeId(body.id);
      } catch {
        // Tracking is best-effort.
      }
    }

    async function ping() {
      const id = idRef.current;
      if (!id) return;
      try {
        const res = await post({ action: "ping", id, path: pathRef.current });
        // Session expired server-side (e.g. tab left open for weeks) — open a new one.
        if (res.status === 404 && !cancelled) {
          idRef.current = null;
          await start();
        }
      } catch {
        // Tracking is best-effort.
      }
    }

    function leave() {
      const id = idRef.current;
      if (id) navigator.sendBeacon("/api/visits", JSON.stringify({ action: "leave", id }));
    }

    const storedId = readStoredId();
    if (storedId) {
      // Same tab reloaded — resume the existing session instead of counting a new visit.
      idRef.current = storedId;
      ping();
    } else {
      start();
    }

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") ping();
    }, PING_INTERVAL_MS);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") ping();
      else leave();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", leave);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", leave);
    };
  }, []);

  // Client-side navigation: report the new page right away.
  useEffect(() => {
    if (pathname === reportedPathRef.current) return;
    reportedPathRef.current = pathname;
    const id = idRef.current;
    if (id) post({ action: "ping", id, path: pathname }).catch(() => {});
  }, [pathname]);

  return null;
}
