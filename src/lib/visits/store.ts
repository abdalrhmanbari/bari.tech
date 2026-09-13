import { getStore } from "@netlify/blobs";
import type { VisitStats } from "./schema";

const STORE_NAME = "site-visits";
const STATS_KEY = "stats";
/** How many days of per-day history to keep before pruning. */
const RETENTION_DAYS = 120;

/**
 * Netlify Blobs auto-configures from the deploy environment when this runs
 * as a Netlify Function. Outside that context — e.g. plain `next dev` — it
 * throws, so callers must handle the failure.
 */
function store() {
  return getStore(STORE_NAME);
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

/** Increments today's visit counter. Callers should treat failures as non-fatal. */
export async function recordVisit(): Promise<void> {
  try {
    const current =
      ((await store().get(STATS_KEY, { type: "json" })) as VisitStats | null) ?? {
        total: 0,
        byDay: {},
      };
    const day = todayKey();
    const byDay = pruneOldDays({
      ...current.byDay,
      [day]: (current.byDay[day] ?? 0) + 1,
    });
    await store().setJSON(STATS_KEY, { total: current.total + 1, byDay });
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
