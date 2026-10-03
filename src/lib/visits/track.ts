import { normalizeEventName, type TrackedEvent } from "./events";
import { isLiveView } from "./live-types";

/** How long events are held before being sent, so bursts (e.g. scrolling past sections) go in one request. */
const FLUSH_DELAY_MS = 4_000;

type Sender = (events: TrackedEvent[]) => void;

const queue: TrackedEvent[] = [];
/** Events already queued in this tab. The server dedupes per visit too; this just saves requests. */
const queued = new Set<string>();
let sender: Sender | null = null;
let flushTimer: number | undefined;

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

/** Mirrors the event into Google Analytics (if loaded) under a GA-safe name. */
function forwardToGa(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  const [kind, ...rest] = name.split(":");
  if (!gtag || kind === "vital") return;
  const gaName = kind === "section" ? "section_view" : kind === "not_found" ? "page_not_found" : kind;
  gtag("event", gaName, rest.length ? { label: rest.join(":") } : undefined);
}

function flush() {
  window.clearTimeout(flushTimer);
  flushTimer = undefined;
  if (sender && queue.length) sender(queue.splice(0));
}

function scheduleFlush() {
  if (sender && flushTimer === undefined) flushTimer = window.setTimeout(flush, FLUSH_DELAY_MS);
}

/**
 * Records an engagement event for the current visit — see `EVENT_KINDS` in
 * ./events for the accepted names. Best-effort and fire-and-forget: events
 * wait in memory until the visit session exists, then go out in batches.
 */
export function track(name: string, value?: number) {
  if (isLiveView()) return;
  const normalized = normalizeEventName(name);
  if (!normalized || queued.has(normalized)) return;
  queued.add(normalized);
  queue.push(value === undefined ? { name: normalized } : { name: normalized, value });
  forwardToGa(normalized);
  scheduleFlush();
}

/** Called by VisitTracker once the visit session exists (or with null when it ends). */
export function setEventSender(next: Sender | null) {
  sender = next;
  if (next && queue.length) scheduleFlush();
}

/** Hands over everything still queued, e.g. to piggyback on a heartbeat or the leave beacon. */
export function takeQueuedEvents(): TrackedEvent[] {
  window.clearTimeout(flushTimer);
  flushTimer = undefined;
  return queue.splice(0);
}
