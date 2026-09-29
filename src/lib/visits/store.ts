import { getStore } from "@netlify/blobs";
import type { VisitStats, VisitorSession } from "./schema";

const STORE_NAME = "site-visits";
const STATS_KEY = "stats";
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
 * Increments today's visit counter and the visitor's country counter.
 *
 * Netlify Blobs has no atomic increment, so a plain read-modify-write would
 * lose updates when two visits land at the same time. Instead this retries a
 * compare-and-swap: write only succeeds if the blob's ETag still matches what
 * was just read (or the key is still absent), otherwise another writer won
 * the race and we re-read and try again. Callers should treat failures (including
 * exhausting retries) as non-fatal — a dropped increment just undercounts by one.
 */
async function recordVisit(countryCode: string | null): Promise<void> {
  const day = todayKey();
  const country = countryCode ?? UNKNOWN_COUNTRY;
  try {
    for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt++) {
      const existing = await store().getWithMetadata(STATS_KEY, { type: "json" });
      const current = (existing?.data as VisitStats | null) ?? { total: 0, byDay: {} };
      const byCountry = current.byCountry ?? {};
      const next: VisitStats = {
        total: current.total + 1,
        byDay: pruneOldDays({
          ...current.byDay,
          [day]: (current.byDay[day] ?? 0) + 1,
        }),
        byCountry: { ...byCountry, [country]: (byCountry[country] ?? 0) + 1 },
      };
      const result = await store().setJSON(
        STATS_KEY,
        next,
        existing?.etag ? { onlyIfMatch: existing.etag } : { onlyIfNew: true },
      );
      if (result.modified) return;
    }
  } catch {
    // Storage unavailable (e.g. plain `next dev`) — the visit just isn't counted.
  }
}

/**
 * Counts a new visit and opens a session for it. Returns the session id the
 * browser tab uses for its heartbeats, or null when storage is unreachable.
 */
export async function startSession(
  info: Omit<VisitorSession, "id" | "startedAt" | "lastSeen">,
): Promise<string | null> {
  await recordVisit(info.countryCode);
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

/**
 * Refreshes a session's heartbeat (and current path). Returns false when the
 * session no longer exists, so the tab knows to start a fresh one.
 */
export async function touchSession(id: string, path?: string): Promise<boolean> {
  try {
    const current = (await store().get(SESSION_PREFIX + id, { type: "json" })) as VisitorSession | null;
    if (!current) return false;
    const next: VisitorSession = {
      ...current,
      lastSeen: new Date().toISOString(),
      path: path ?? current.path,
    };
    await Promise.all([
      store().setJSON(SESSION_PREFIX + id, next),
      store().setJSON(ACTIVE_PREFIX + id, next),
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
