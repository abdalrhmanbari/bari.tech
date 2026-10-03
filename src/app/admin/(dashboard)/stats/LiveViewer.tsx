"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VisitorSession } from "@/lib/visits/schema";
import { LIVE_VIEW_PARAM, type LiveBatch, type LiveFrame } from "@/lib/visits/live-types";

const POLL_MS = 1_000;
/** Lease renewal; must stay well under the server's WATCH_LEASE_MS. */
const RENEW_MS = 15_000;
/** Frames are replayed this far behind real time, so batches arriving ~1s apart play smoothly. */
const PLAYBACK_DELAY_MS = 1_500;
/** If playback falls further behind than this (e.g. the tab was in the background), skip ahead. */
const RESYNC_MS = 4_000;
/** No batch for this long while watched means the visitor's tab is hidden or closed. */
const PAUSED_AFTER_MS = 5_000;
const MAX_LOG = 60;

type Status = "connecting" | "live" | "paused" | "left" | "error";
type View = Pick<LiveBatch, "path" | "lang" | "vw" | "vh">;
type LogEntry = { id: number; t: number; text: string };

const STATUS_TEXT: Record<Status, string> = {
  connecting: "Connecting… the visitor's browser checks in every few seconds.",
  live: "Live",
  paused: "Paused — the visitor's tab is in the background.",
  left: "The visitor left the site.",
  error: "Live view needs Netlify Blobs — deploy, or run `netlify dev`.",
};

function sameView(a: View | null, b: View): boolean {
  return !!a && a.path === b.path && a.lang === b.lang && a.vw === b.vw && a.vh === b.vh;
}

/**
 * Full-screen "Watch live" view of one visitor: renders the page they're on
 * at their viewport size, then replays their pointer, clicks and scrolling
 * over it, a second or two behind real time.
 */
export function LiveViewer({ visitor, onClose }: { visitor: VisitorSession; onClose: () => void }) {
  const [status, setStatus] = useState<Status>("connecting");
  const [view, setView] = useState<View | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<LiveFrame[]>([]);
  const offsetRef = useRef<number | null>(null);
  const scaleRef = useRef(1);
  const scrollRef = useRef(0);
  const logIdRef = useRef(0);

  /** Adds an activity line (newest first), skipping exact repeats of the latest one. */
  const addLog = useCallback((text: string) => {
    setLog((prev) =>
      prev[0]?.text === text ? prev : [{ id: ++logIdRef.current, t: Date.now(), text }, ...prev].slice(0, MAX_LOG),
    );
  }, []);

  const scale = view && box.w && box.h ? Math.min(box.w / view.vw, box.h / view.vh, 1) : 1;
  scaleRef.current = scale;

  // Watch lease: tells the visitor's tab to start streaming, renewed while this view is open.
  useEffect(() => {
    const url = `/api/admin/live?id=${encodeURIComponent(visitor.id)}`;
    const renew = () =>
      fetch(url, { method: "POST" })
        .then((res) => {
          if (!res.ok) setStatus("error");
        })
        .catch(() => setStatus("error"));
    renew();
    const timer = window.setInterval(renew, RENEW_MS);
    return () => {
      window.clearInterval(timer);
      fetch(url, { method: "DELETE", keepalive: true }).catch(() => {});
    };
  }, [visitor.id]);

  // Poll for new batches.
  useEffect(() => {
    let since = 0;
    let lastBatchAt = 0;
    let busy = false;
    const timer = window.setInterval(async () => {
      if (busy) return;
      busy = true;
      try {
        const res = await fetch(`/api/admin/live?id=${encodeURIComponent(visitor.id)}&since=${since}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const body = (await res.json()) as { batches: LiveBatch[]; active: boolean };
        for (const batch of body.batches) {
          since = Math.max(since, batch.seq);
          lastBatchAt = Date.now();
          const next: View = { path: batch.path, lang: batch.lang, vw: batch.vw, vh: batch.vh };
          setView((prev) => (sameView(prev, next) ? prev : next));
          queueRef.current.push(...batch.frames);
        }
        setStatus((prev) => {
          if (prev === "error") return prev;
          if (!body.active) return "left";
          if (lastBatchAt === 0) return "connecting";
          return Date.now() - lastBatchAt > PAUSED_AFTER_MS ? "paused" : "live";
        });
      } catch {
        // Try again next tick.
      } finally {
        busy = false;
      }
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [visitor.id]);

  // Fit the visitor's viewport into the available space.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Playback loop: applies queued frames at their (delayed) original timing.
  useEffect(() => {
    function moveCursor(x: number, y: number) {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const s = scaleRef.current;
      cursor.style.opacity = "1";
      cursor.style.transform = `translate(${x * s}px, ${y * s}px)`;
    }

    function ripple(x: number, y: number) {
      const layer = ripplesRef.current;
      if (!layer) return;
      const s = scaleRef.current;
      const dot = document.createElement("span");
      dot.className = "absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-red-400/70";
      dot.style.left = `${x * s}px`;
      dot.style.top = `${y * s}px`;
      layer.appendChild(dot);
      window.setTimeout(() => dot.remove(), 700);
    }

    function apply(frame: LiveFrame) {
      const { k, x = 0, y = 0, label } = frame;
      if (k === "m") moveCursor(x, y);
      else if (k === "c") {
        moveCursor(x, y);
        ripple(x, y);
        addLog(label ? `Clicked “${label}”` : "Clicked");
      } else if (k === "s") {
        scrollRef.current = y;
        try {
          iframeRef.current?.contentWindow?.scrollTo({ top: y, behavior: "instant" });
        } catch {
          // Frame not ready yet — re-applied on load.
        }
      } else if (k === "f") addLog(`Focused the “${label}” field`);
      else if (k === "i") addLog(`Typing in “${label}”…`);
    }

    let raf = 0;
    const tick = () => {
      const now = Date.now();
      const queue = queueRef.current;
      while (queue.length) {
        const frame = queue[0];
        if (offsetRef.current === null || frame.t + offsetRef.current < now - RESYNC_MS) {
          offsetRef.current = now - frame.t + PLAYBACK_DELAY_MS;
        }
        if (frame.t + offsetRef.current > now) break;
        queue.shift();
        apply(frame);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [addLog]);

  // A new page (or language) in the visitor's tab reloads the iframe; note it in the log.
  const viewPath = view?.path;
  const viewLang = view?.lang;
  useEffect(() => {
    if (viewPath) addLog(`Viewing ${viewPath} (${viewLang === "ar" ? "Arabic" : "English"})`);
  }, [viewPath, viewLang, addLog]);

  const src = view ? `${view.path}?${LIVE_VIEW_PARAM}=1&lang=${view.lang}` : null;
  const dot =
    status === "live" ? "bg-emerald-400" : status === "left" || status === "error" ? "bg-red-400" : "bg-amber-400";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live view"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm text-ink-primary">
            <span className={`h-2 w-2 shrink-0 rounded-full ${dot} ${status === "live" ? "animate-pulse" : ""}`} />
            {STATUS_TEXT[status]}
          </p>
          <p className="truncate text-xs text-ink-muted">
            {[visitor.city, visitor.countryCode].filter(Boolean).join(", ")} · {visitor.device} · {visitor.browser}
            {view && ` · ${view.vw}×${view.vh}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-xs text-ink-secondary transition hover:border-white/20 hover:text-ink-primary"
        >
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <div ref={stageRef} className="flex min-h-0 flex-1 items-start justify-center overflow-hidden">
          {view && src ? (
            <div
              className="relative overflow-hidden rounded-md border border-white/10 bg-bg-primary"
              style={{ width: view.vw * scale, height: view.vh * scale }}
            >
              <iframe
                ref={iframeRef}
                src={src}
                title="Visitor's page"
                tabIndex={-1}
                className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                style={{ width: view.vw, height: view.vh, transform: `scale(${scale})` }}
                onLoad={() => {
                  try {
                    iframeRef.current?.contentWindow?.scrollTo({ top: scrollRef.current, behavior: "instant" });
                  } catch {
                    // ignore
                  }
                }}
              />
              <div ref={ripplesRef} className="pointer-events-none absolute inset-0" />
              <div
                ref={cursorRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 opacity-0 transition-transform duration-75 ease-linear"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  <path d="M1 1 L1 15 L5 11 L8 17 L10.5 16 L7.5 10 L13 10 Z" fill="#f87171" stroke="#fff" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          ) : (
            <p className="self-center text-sm text-ink-muted">Waiting for the visitor&apos;s screen…</p>
          )}
        </div>

        <aside className="flex max-h-48 shrink-0 flex-col rounded-lg border border-white/10 bg-card p-3 lg:max-h-none lg:w-72">
          <h2 className="mb-2 text-xs text-ink-secondary">Activity</h2>
          {log.length === 0 ? (
            <p className="text-xs text-ink-muted">Nothing yet.</p>
          ) : (
            <ul className="min-h-0 space-y-1.5 overflow-y-auto text-xs">
              {log.map((entry) => (
                <li key={entry.id} className="flex gap-2">
                  <span className="shrink-0 tabular-nums text-ink-muted">
                    {new Date(entry.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                  <span className="text-ink-primary">{entry.text}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-auto pt-3 text-[11px] text-ink-muted">
            What visitors type is never sent — only which field they&apos;re in.
          </p>
        </aside>
      </div>
    </div>
  );
}
