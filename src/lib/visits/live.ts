import { getStore } from "@netlify/blobs";
import { LIVE_FRAME_KINDS, type LiveBatch, type LiveFrame } from "./live-types";

/** Shares the visits store; these prefixes don't collide with sessions/ or active/. */
const STORE_NAME = "site-visits";
/** `watch/<sessionId>` -> { until } while an admin has the live view open. */
const WATCH_PREFIX = "watch/";
/** `live/<sessionId>` -> the most recent LiveBatches from that visitor. */
const LIVE_PREFIX = "live/";
/** The dashboard renews its lease well inside this, so a closed tab stops the stream soon after. */
export const WATCH_LEASE_MS = 45_000;
/** Batches kept per visitor, so a dashboard poll that runs a little late misses nothing. */
const KEEP_BATCHES = 6;
const MAX_FRAMES = 300;

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

type Watch = { until: number };
type LiveRecord = { batches: LiveBatch[] };

export async function startWatching(id: string): Promise<void> {
  await store().setJSON(WATCH_PREFIX + id, { until: Date.now() + WATCH_LEASE_MS } satisfies Watch);
}

export async function stopWatching(id: string): Promise<void> {
  await Promise.allSettled([store().delete(WATCH_PREFIX + id), store().delete(LIVE_PREFIX + id)]);
}

export async function isWatched(id: string): Promise<boolean> {
  try {
    const watch = (await store().get(WATCH_PREFIX + id, { type: "json" })) as Watch | null;
    return !!watch && watch.until > Date.now();
  } catch {
    return false;
  }
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : undefined;
}

/** Validates a batch from the (untrusted) visitor tab, dropping anything malformed. */
export function parseLiveBatch(value: unknown): LiveBatch | null {
  const raw = value as Partial<LiveBatch> | null;
  if (!raw || typeof raw !== "object") return null;
  const seq = num(raw.seq);
  const vw = num(raw.vw);
  const vh = num(raw.vh);
  if (seq === undefined || !vw || !vh || typeof raw.path !== "string" || !raw.path.startsWith("/")) return null;

  const frames: LiveFrame[] = [];
  for (const f of Array.isArray(raw.frames) ? raw.frames.slice(0, MAX_FRAMES) : []) {
    const t = num(f?.t);
    if (t === undefined || !(LIVE_FRAME_KINDS as readonly string[]).includes(f?.k)) continue;
    const frame: LiveFrame = { t, k: f.k };
    const x = num(f.x);
    const y = num(f.y);
    if (x !== undefined) frame.x = x;
    if (y !== undefined) frame.y = y;
    if (typeof f.label === "string" && f.label) frame.label = f.label.slice(0, 60);
    frames.push(frame);
  }

  return {
    seq,
    path: raw.path.slice(0, 200),
    lang: raw.lang === "ar" ? "ar" : "en",
    vw: Math.min(vw, 4000),
    vh: Math.min(vh, 4000),
    frames,
  };
}

/**
 * Stores a visitor's batch if an admin is watching them. Returns whether
 * they're still being watched, so the tab knows to stop streaming.
 */
export async function pushLiveBatch(id: string, batch: LiveBatch): Promise<boolean> {
  if (!(await isWatched(id))) return false;
  try {
    const current = (await store().get(LIVE_PREFIX + id, { type: "json" })) as LiveRecord | null;
    const batches = [...(current?.batches ?? []).filter((b) => b.seq < batch.seq), batch].slice(-KEEP_BATCHES);
    await store().setJSON(LIVE_PREFIX + id, { batches } satisfies LiveRecord);
  } catch {
    // Storage hiccup — the dashboard just skips this second.
  }
  return true;
}

/** Batches newer than `since` (by seq). */
export async function getLiveBatches(id: string, since: number): Promise<LiveBatch[]> {
  try {
    const current = (await store().get(LIVE_PREFIX + id, { type: "json" })) as LiveRecord | null;
    return (current?.batches ?? []).filter((b) => b.seq > since);
  } catch {
    return [];
  }
}
