import { getStore } from "@netlify/blobs";
import type { EventStats, SiteLang, VisitStats, VisitorSession } from "./schema";
import { isVitalMetric, rateVital, type TrackedEvent } from "./events";

const STORE_NAME = "site-visits";
const STATS_KEY = "stats";
const EVENTS_KEY = "events";
/** Cap on the per-session action list, so a long visit can't grow its blob unbounded. */
const MAX_SESSION_ACTIONS = 60;
/** One blob per tab session, keyed by id — kept for SESSION_RETENTION_DAYS. */
const SESSION_PREFIX = "sessions/";
/** Presence markers for tabs that are open right now; stale ones are swept on read. */
const ACTIVE_PREFIX = "active/";
/** How many days of per-day history to keep before pruning. */
const RETENTION_DAYS = 120;
const SESSION_RETENTION_DAYS = 30;
/** A visitor counts as active if their tab sent a heartbeat within this window. */
export const ACTIVE_WINDOW_MS = 75_000;
const RECENT_LIMIT = 50;
/** Compare-and-swap retry cap for concurrent visit writes; see recordVisit. */
const MAX_WRITE_ATTEMPTS = 5;
const UNKNOWN_COUNTRY = "XX";

/** Session ids are `<13-digit ms timestamp>-<8 chars>`, so keys sort chronologically. */
const SESSION_ID_PATTERN = /^\d{13}-[a-z0-9]{8}$/;

/**
 * Netlify Blobs auto-configures from the deploy environment when this runs
 * as a Netlify Function. Outside that context — e.g. plain `next dev` — it
 * throws, so callers must handle the failure. Strong consistency is required
 * so the CAS loop in recordVisit reads the value its own retries just wrote,
 * and so presence heartbeats show up immediately in the dashboard.
 */
function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function pruneOldDays(byDay: Record<string, number>): Record<string, number> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  return Object.fromEntries(Object.entries(byDay).filter(([day]) => day >= cutoffKey));
}

export function isValidSessionId(id: unknown): id is string {
  return typeof id === "string" && SESSION_ID_PATTERN.test(id);
}

function generateSessionId(): string {
  const rand = Math.random().toString(36).slice(2, 10).padEnd(8, "0");
  return `${Date.now()}-${rand}`;
}

/**
 * Applies `update` to a counters blob (visit stats or event stats).
 *
 * Netlify Blobs has no atomic increment, so a plain read-modify-write would
 * lose updates when two visits land at the same time. Instead this retries a
 * compare-and-swap: write only succeeds if the blob's ETag still matches what
 * was just read (or the key is still absent), otherwise another writer won
 * the race and we re-read and try again. Failures (including exhausting
 * retries) are swallowed — a dropped update just skews a counter by one.
 *
 * The local Blobs sandbox (`netlify dev`) returns no ETags, so an existing
 * blob without one is written unconditionally — otherwise `onlyIfNew` would
 * reject every update there. Deployed Netlify always returns ETags.
 */
async function updateBlob<T>(key: string, empty: T, update: (current: T) => T): Promise<void> {
  try {
    for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt++) {
      const existing = await store().getWithMetadata(key, { type: "json" });
      const current = (existing?.data as T | null) ?? empty;
      const result = await store().setJSON(
        key,
        update(current),
        existing?.etag ? { onlyIfMatch: existing.etag } : existing ? {} : { onlyIfNew: true },
      );
      if (result.modified) return;
    }
  } catch {
    // Storage unavailable (e.g. plain `next dev`) — the visit just isn't counted.
  }
}

function updateStats(update: (current: VisitStats) => VisitStats): Promise<void> {
  return updateBlob<VisitStats>(STATS_KEY, { total: 0, byDay: {} }, update);
}

function bump(counts: Record<string, number> | undefined, key: string, delta: number): Record<string, number> {
  const next = { ...counts, [key]: Math.max(0, (counts?.[key] ?? 0) + delta) };
  if (next[key] === 0) delete next[key];
  return next;
}

/** Where a visit came from: an explicit `?ref=`/utm tag wins over the referrer host. */
export function sourceKey(session: Pick<VisitorSession, "source" | "referrer">): string {
  return session.source || session.referrer?.replace(/^www\./, "") || "direct";
}

type NewSession = Omit<VisitorSession, "id" | "startedAt" | "lastSeen">;

/** Increments today's visit counter plus the country, site-language, source and returning counters. */
function recordVisit(info: NewSession): Promise<void> {
  const day = todayKey();
  return updateStats((current) => ({
    ...current,
    total: current.total + 1,
    byDay: pruneOldDays(bump(current.byDay, day, 1)),
    byCountry: bump(current.byCountry, info.countryCode ?? UNKNOWN_COUNTRY, 1),
    byLang: info.siteLang ? bump(current.byLang, info.siteLang, 1) : current.byLang,
    bySource: bump(current.bySource, sourceKey(info), 1),
    returning: (current.returning ?? 0) + ((info.visitNumber ?? 1) > 1 ? 1 : 0),
  }));
}

/** Moves one visit from `from` to `to` in the site-language counter (visitor flipped the EN/AR toggle). */
function recordLangSwitch(from: SiteLang | null | undefined, to: SiteLang): Promise<void> {
  return updateStats((current) => ({
    ...current,
    byLang: bump(from ? bump(current.byLang, from, -1) : current.byLang, to, 1),
  }));
}

/**
 * Counts a new visit and opens a session for it. Returns the session id the
 * browser tab uses for its heartbeats, or null when storage is unreachable.
 */
export async function startSession(info: NewSession): Promise<string | null> {
  await recordVisit(info);
  const now = new Date().toISOString();
  const session: VisitorSession = { id: generateSessionId(), startedAt: now, lastSeen: now, ...info };
  try {
    await Promise.all([
      store().setJSON(SESSION_PREFIX + session.id, session),
      store().setJSON(ACTIVE_PREFIX + session.id, session),
    ]);
    return session.id;
  } catch {
    return null;
  }
}

/** Turns a batch of not-yet-counted events into counter deltas. */
function eventDeltas(session: VisitorSession, events: TrackedEvent[]): Record<string, number> {
  const deltas: Record<string, number> = {};
  const add = (key: string, delta: number) => {
    deltas[key] = (deltas[key] ?? 0) + delta;
  };
  for (const event of events) {
    const [kind, metric] = event.name.split(":");
    if (kind === "vital") {
      if (!metric || !isVitalMetric(metric) || typeof event.value !== "number" || !(event.value >= 0)) continue;
      add(`vital:${metric}:${session.device}:${rateVital(metric, event.value)}`, 1);
      add(`vitalsum:${metric}:${session.device}`, event.value);
    } else {
      add(event.name, 1);
    }
  }
  return deltas;
}

type SessionUpdate = { path?: string; siteLang?: SiteLang; events?: TrackedEvent[] };

/**
 * Refreshes a session's heartbeat, current path / site language, and records
 * any engagement events the tab batched up — all in one read-modify-write of
 * the session blob, so concurrent requests from the tab can't clobber each
 * other's changes. Each event counts once per visit: names already in the
 * session's `actions` are skipped, so reloads, repeat clicks or a replayed
 * request can't inflate the counters.
 *
 * `markActive: false` (used when the tab is leaving) skips refreshing the
 * presence marker. Returns false when the session no longer exists, so the
 * tab knows to start a fresh one.
 */
export async function touchSession(id: string, update: SessionUpdate, markActive = true): Promise<boolean> {
  try {
    const current = (await store().get(SESSION_PREFIX + id, { type: "json" })) as VisitorSession | null;
    if (!current) return false;

    const seen = new Set(current.actions ?? []);
    const fresh = (update.events ?? []).filter((event) => {
      if (seen.has(event.name)) return false;
      seen.add(event.name);
      return true;
    });
    const deltas = eventDeltas(current, fresh);

    const next: VisitorSession = {
      ...current,
      lastSeen: new Date().toISOString(),
      path: update.path ?? current.path,
      siteLang: update.siteLang ?? current.siteLang,
      actions: fresh.length
        ? [...(current.actions ?? []), ...fresh.map((e) => e.name)].slice(0, MAX_SESSION_ACTIONS)
        : current.actions,
    };
    await Promise.all([
      store().setJSON(SESSION_PREFIX + id, next),
      markActive ? store().setJSON(ACTIVE_PREFIX + id, next) : undefined,
      update.siteLang && update.siteLang !== current.siteLang
        ? recordLangSwitch(current.siteLang, update.siteLang)
        : undefined,
      Object.keys(deltas).length
        ? updateBlob<EventStats>(EVENTS_KEY, {}, (counts) => {
            const updated = { ...counts };
            for (const [key, delta] of Object.entries(deltas)) updated[key] = (updated[key] ?? 0) + delta;
            return updated;
          })
        : undefined,
    ]);
    return true;
  } catch {
    return true; // Storage hiccup — don't make the tab start over.
  }
}

/** Called when a tab is hidden or closed: the visitor stops counting as active right away. */
export async function endSession(id: string): Promise<void> {
  try {
    await store().delete(ACTIVE_PREFIX + id);
  } catch {
    // Non-fatal — the presence marker expires on its own after ACTIVE_WINDOW_MS.
  }
}

/** The session if its tab is open right now (recent heartbeat), else null. */
export async function getActiveSession(id: string): Promise<VisitorSession | null> {
  try {
    const session = (await store().get(ACTIVE_PREFIX + id, { type: "json" })) as VisitorSession | null;
    return session && Date.parse(session.lastSeen) >= Date.now() - ACTIVE_WINDOW_MS ? session : null;
  } catch {
    return null;
  }
}

/** Returns visitors with a recent heartbeat, newest session first, sweeping out stale markers. */
export async function getActiveVisitors(): Promise<VisitorSession[]> {
  try {
    const { blobs } = await store().list({ prefix: ACTIVE_PREFIX });
    const sessions = await Promise.all(
      blobs.map((blob) => store().get(blob.key, { type: "json" }) as Promise<VisitorSession | null>),
    );
    const cutoff = Date.now() - ACTIVE_WINDOW_MS;
    const active: VisitorSession[] = [];
    const stale: string[] = [];
    sessions.forEach((session, i) => {
      if (session && Date.parse(session.lastSeen) >= cutoff) active.push(session);
      else stale.push(blobs[i].key);
    });
    await Promise.allSettled(stale.map((key) => store().delete(key)));
    return active.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  } catch {
    return [];
  }
}

/** Returns the most recent sessions (newest first) and prunes ones past retention. */
export async function getRecentVisitors(): Promise<VisitorSession[]> {
  try {
    const { blobs } = await store().list({ prefix: SESSION_PREFIX });
    const cutoff = Date.now() - SESSION_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const keys = blobs.map((blob) => blob.key).sort().reverse();
    const expired = keys.filter((key) => Number(key.slice(SESSION_PREFIX.length, SESSION_PREFIX.length + 13)) < cutoff);
    await Promise.allSettled(expired.map((key) => store().delete(key)));

    const recentKeys = keys.filter((key) => !expired.includes(key)).slice(0, RECENT_LIMIT);
    const sessions = await Promise.all(
      recentKeys.map((key) => store().get(key, { type: "json" }) as Promise<VisitorSession | null>),
    );
    return sessions.filter((s): s is VisitorSession => s !== null);
  } catch {
    return [];
  }
}

/** Returns visit stats, or all-zero stats when storage is unreachable. */
export async function getVisitStats(): Promise<VisitStats> {
  try {
    const data = (await store().get(STATS_KEY, { type: "json" })) as VisitStats | null;
    return data ?? { total: 0, byDay: {} };
  } catch {
    return { total: 0, byDay: {} };
  }
}

/** Returns the engagement counters, or none when storage is unreachable. */
export async function getEventStats(): Promise<EventStats> {
  try {
    return ((await store().get(EVENTS_KEY, { type: "json" })) as EventStats | null) ?? {};
  } catch {
    return {};
  }
}
