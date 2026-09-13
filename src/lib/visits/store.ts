import { getStore } from "@netlify/blobs";
import type { VisitStats } from "./schema";

const STORE_NAME = "site-visits";
const STATS_KEY = "stats";
/** How many days of per-day history to keep before pruning. */
const RETENTION_DAYS = 120;
/** Compare-and-swap retry cap for concurrent visit writes; see recordVisit. */
const MAX_WRITE_ATTEMPTS = 5;

/**
 * Netlify Blobs auto-configures from the deploy environment when this runs
 * as a Netlify Function. Outside that context — e.g. plain `next dev` — it
 * throws, so callers must handle the failure. Strong consistency is required
 * so the CAS loop in recordVisit reads the value its own retries just wrote.
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

/**
 * Increments today's visit counter.
 *
 * Netlify Blobs has no atomic increment, so a plain read-modify-write would
 * lose updates when two visits land at the same time. Instead this retries a
 * compare-and-swap: write only succeeds if the blob's ETag still matches what
 * was just read (or the key is still absent), otherwise another writer won
 * the race and we re-read and try again. Callers should treat failures (including
 * exhausting retries) as non-fatal — a dropped increment just undercounts by one.
 */
export async function recordVisit(): Promise<void> {
  const day = todayKey();
  try {
    for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt++) {
      const existing = await store().getWithMetadata(STATS_KEY, { type: "json" });
      const current = (existing?.data as VisitStats | null) ?? { total: 0, byDay: {} };
      const next: VisitStats = {
        total: current.total + 1,
        byDay: pruneOldDays({
          ...current.byDay,
          [day]: (current.byDay[day] ?? 0) + 1,
        }),
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

/** Returns visit stats, or all-zero stats when storage is unreachable. */
export async function getVisitStats(): Promise<VisitStats> {
  try {
    const data = (await store().get(STATS_KEY, { type: "json" })) as VisitStats | null;
    return data ?? { total: 0, byDay: {} };
  } catch {
    return { total: 0, byDay: {} };
  }
}
