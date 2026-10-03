"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { setEventSender, takeQueuedEvents } from "@/lib/visits/track";
import { enableLiveView } from "@/lib/visits/live-client";
import { isLiveView } from "@/lib/visits/live-types";

const SESSION_KEY = "visit-session";
/** Heartbeat cadence while the tab is visible; must stay well under the server's ACTIVE_WINDOW_MS. */
const PING_INTERVAL_MS = 30_000;
const HISTORY_KEY = "visit-history";
/** A new tab opened within this long of the last activity counts as the same visit, not a return. */
const RETURN_GAP_MS = 30 * 60_000;

type VisitHistory = { count: number; last: number };

function readHistory(): VisitHistory | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "null") as VisitHistory | null;
    return parsed && typeof parsed.count === "number" && typeof parsed.last === "number" ? parsed : null;
  } catch {
    return null;
  }
}

function writeHistory(history: VisitHistory) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // localStorage unavailable — every visit just looks like a first one.
  }
}

/** Which visit this is for the browser: 1 the first time, then +1 after each 30-minute gap. */
function nextVisitNumber(): number {
  const history = readHistory();
  const count = !history ? 1 : Date.now() - history.last > RETURN_GAP_MS ? history.count + 1 : history.count;
  writeHistory({ count, last: Date.now() });
  return count;
}

/** Keeps the "last activity" timestamp fresh, so the return gap is measured from the end of a visit. */
function touchHistory() {
  const history = readHistory();
  if (history) writeHistory({ ...history, last: Date.now() });
}

/** `?ref=linkedin` or the standard utm tags, for links shared in known places. */
function readCampaign(): { source: string | null; campaign: string | null } {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("ref") ?? params.get("utm_source"),
    campaign: params.get("utm_campaign"),
  };
}

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

/**
 * The language the site is shown in. Read from <html lang>, which the boot
 * script sets from the stored preference before paint — LanguageProvider's
 * state only catches up after mount, so it would report "en" at first.
 */
function currentSiteLang(): "en" | "ar" {
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function post(body: object) {
  return fetch("/api/visits", { method: "POST", body: JSON.stringify(body), keepalive: true });
}

/**
 * Opens one visit session per browser tab (sessionStorage is per-tab), then
 * sends a heartbeat while the tab is visible so the dashboard can show who's
 * on the site right now. Engagement events queued through `track()` ride along
 * on the heartbeats and on the leave beacon. Renders nothing.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const langMountedRef = useRef(false);
  const idRef = useRef<string | null>(null);
  const pathRef = useRef(pathname);
  const reportedPathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    // The admin's live viewer renders site pages in an iframe — never count those.
    if (isLiveView()) return;
    let cancelled = false;
    let disableLiveView: (() => void) | null = null;

    /** Binds this tab to a session: heartbeats, event batches and the admin's live view. */
    function attach(id: string) {
      idRef.current = id;
      setEventSender(() => ping());
      disableLiveView?.();
      disableLiveView = enableLiveView(id);
    }

    function detach() {
      idRef.current = null;
      setEventSender(null);
      disableLiveView?.();
      disableLiveView = null;
    }

    async function start() {
      try {
        const res = await post({
          action: "start",
          path: pathRef.current,
          referrer: document.referrer,
          language: navigator.language,
          siteLang: currentSiteLang(),
          visitNumber: nextVisitNumber(),
          ...readCampaign(),
        });
        const body = (await res.json()) as { id?: string | null };
        if (cancelled || !body.id) return;
        storeId(body.id);
        attach(body.id);
      } catch {
        // Tracking is best-effort.
      }
    }

    async function ping() {
      const id = idRef.current;
      if (!id) return;
      touchHistory();
      try {
        const res = await post({
          action: "ping",
          id,
          path: pathRef.current,
          siteLang: currentSiteLang(),
          events: takeQueuedEvents(),
        });
        // Session expired server-side (e.g. tab left open for weeks) — open a new one.
        if (res.status === 404 && !cancelled) {
          detach();
          await start();
        }
      } catch {
        // Tracking is best-effort.
      }
    }

    function leave() {
      const id = idRef.current;
      if (id) navigator.sendBeacon("/api/visits", JSON.stringify({ action: "leave", id, events: takeQueuedEvents() }));
    }

    const storedId = readStoredId();
    if (storedId) {
      // Same tab reloaded — resume the existing session instead of counting a new visit.
      attach(storedId);
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
      detach();
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
    if (id) post({ action: "ping", id, path: pathname, siteLang: currentSiteLang() }).catch(() => {});
  }, [pathname]);

  // Visitor flipped the EN/AR toggle: report it right away. Skips the mount
  // run, where the provider hasn't adopted the stored preference yet. Uses
  // `lang` rather than <html lang>, which the provider updates after this runs.
  useEffect(() => {
    if (!langMountedRef.current) {
      langMountedRef.current = true;
      return;
    }
    const id = idRef.current;
    if (id) post({ action: "ping", id, path: pathRef.current, siteLang: lang }).catch(() => {});
  }, [lang]);

  return null;
}
