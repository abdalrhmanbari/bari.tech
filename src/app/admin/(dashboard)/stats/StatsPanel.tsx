"use client";

import { useCallback, useEffect, useState } from "react";
import type { VisitStats } from "@/lib/visits/schema";
import { Skeleton } from "@/components/ui/Skeleton";

const DAYS_SHOWN = 14;
const CHART_HEIGHT = 140;

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(day: string): string {
  const [, month, date] = day.split("-");
  return `${month}/${date}`;
}

export function StatsPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VisitStats | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load stats.");
      setStats(body.stats as VisitStats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const days = lastNDays(DAYS_SHOWN);
  const counts = days.map((day) => stats?.byDay[day] ?? 0);
  const max = Math.max(1, ...counts);
  const todayCount = counts[counts.length - 1] ?? 0;
  const weekCount = counts.slice(-7).reduce((sum, c) => sum + c, 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-ink-primary">Stats</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Visit counts tracked from the live site, one per browser session.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-ink-secondary transition hover:border-white/20 hover:text-ink-primary"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-card p-4">
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile label="Total visits" value={stats?.total ?? 0} />
            <StatTile label="Today" value={todayCount} />
            <StatTile label="Last 7 days" value={weekCount} />
          </div>

          <div className="rounded-lg border border-white/10 bg-card p-4">
            <p className="mb-4 text-xs text-ink-secondary">Last {DAYS_SHOWN} days</p>
            <div className="flex gap-1.5" style={{ height: CHART_HEIGHT }}>
              {days.map((day, i) => {
                const count = counts[i];
                const heightPct = Math.max(4, (count / max) * 100);
                return (
                  <div
                    key={day}
                    className="flex flex-1 flex-col items-center gap-2"
                    title={`${day}: ${count} visit${count === 1 ? "" : "s"}`}
                  >
                    <div className="flex w-full flex-1 items-end">
                      <div
                        aria-hidden="true"
                        className="w-full rounded-t bg-accent/70"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-ink-secondary">
                      {formatDayLabel(day)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-4">
      <p className="mb-1 text-xs text-ink-secondary">{label}</p>
      <p className="text-2xl font-medium text-ink-primary">{value.toLocaleString()}</p>
    </div>
  );
}
