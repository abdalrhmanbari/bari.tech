"use client";

import { useCallback, useEffect, useState } from "react";
import type { VisitStats, VisitorSession } from "@/lib/visits/schema";
import { Skeleton } from "@/components/ui/Skeleton";

const DAYS_SHOWN = 14;
const CHART_HEIGHT = 140;
const TOP_COUNTRIES = 10;
/** Background refresh cadence so "Active now" stays live without a manual reload. */
const AUTO_REFRESH_MS = 20_000;

type StatsResponse = {
  stats: VisitStats;
  active: VisitorSession[];
  recent: VisitorSession[];
};

const regionNames =
  typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

function countryName(code: string | null): string {
  if (!code || code === "XX") return "Unknown";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

function location(v: VisitorSession): string {
  return [v.city, countryName(v.countryCode)].filter(Boolean).join(", ");
}

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

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "< 1m";
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function sessionLength(v: VisitorSession): number {
  return Date.parse(v.lastSeen) - Date.parse(v.startedAt);
}

export function StatsPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StatsResponse | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load stats.");
      setData(body as StatsResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") load(true);
    }, AUTO_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  const stats = data?.stats;
  const active = data?.active ?? [];
  const recent = data?.recent ?? [];

  const days = lastNDays(DAYS_SHOWN);
  const counts = days.map((day) => stats?.byDay[day] ?? 0);
  const max = Math.max(1, ...counts);
  const todayCount = counts[counts.length - 1] ?? 0;
  const weekCount = counts.slice(-7).reduce((sum, c) => sum + c, 0);

  const countries = Object.entries(stats?.byCountry ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_COUNTRIES);
  const countryMax = Math.max(1, ...countries.map(([, c]) => c));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink-primary">Stats</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Visits from the live site, one per browser tab. Updates every {AUTO_REFRESH_MS / 1000}s.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-xs text-ink-secondary transition hover:border-white/20 hover:text-ink-primary"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-card p-4">
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Active now" value={active.length} live />
            <StatTile label="Today" value={todayCount} />
            <StatTile label="Last 7 days" value={weekCount} />
            <StatTile label="Total visits" value={stats?.total ?? 0} />
          </div>

          <Card title="Active now">
            {active.length === 0 ? (
              <Empty>No one is on the site right now.</Empty>
            ) : (
              <ul className="divide-y divide-white/5">
                {active.map((v) => (
                  <VisitorRow key={v.id} visitor={v}>
                    <span>on {v.path}</span>
                    <span>{formatDuration(Date.now() - Date.parse(v.startedAt))} on site</span>
                  </VisitorRow>
                ))}
              </ul>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title={`Last ${DAYS_SHOWN} days`}>
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
                      <span className="text-[10px] text-ink-secondary">{formatDayLabel(day)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Top countries">
              {countries.length === 0 ? (
                <Empty>No country data yet.</Empty>
              ) : (
                <ul className="space-y-2.5">
                  {countries.map(([code, count]) => (
                    <li key={code} className="text-sm">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-ink-primary">
                          <CountryCode code={code} />
                          {countryName(code)}
                        </span>
                        <span className="tabular-nums text-ink-secondary">{count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div
                          aria-hidden="true"
                          className="h-full rounded-full bg-accent/70"
                          style={{ width: `${Math.max(2, (count / countryMax) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card title={`Recent visitors (last ${recent.length})`}>
            {recent.length === 0 ? (
              <Empty>No visits recorded yet.</Empty>
            ) : (
              <ul className="divide-y divide-white/5">
                {recent.map((v) => (
                  <VisitorRow key={v.id} visitor={v}>
                    <span>{formatTime(v.startedAt)}</span>
                    <span>{v.referrer ? `from ${v.referrer}` : "Direct"}</span>
                    <span>stayed {formatDuration(sessionLength(v))}</span>
                  </VisitorRow>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, live = false }: { label: string; value: number; live?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-4">
      <p className="mb-1 flex items-center gap-2 text-xs text-ink-secondary">
        {live && (
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {value > 0 && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${value > 0 ? "bg-emerald-400" : "bg-ink-muted"}`}
            />
          </span>
        )}
        {label}
      </p>
      <p className="text-2xl font-medium text-ink-primary">{value.toLocaleString()}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-card p-4">
      <h2 className="mb-4 text-xs text-ink-secondary">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-ink-muted">{children}</p>;
}

function CountryCode({ code }: { code: string | null }) {
  return (
    <span className="inline-flex w-7 shrink-0 justify-center rounded border border-white/10 py-0.5 text-[10px] font-medium text-ink-secondary">
      {code && code !== "XX" ? code : "??"}
    </span>
  );
}

function VisitorRow({ visitor, children }: { visitor: VisitorSession; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <CountryCode code={visitor.countryCode} />
        <div className="min-w-0">
          <p className="truncate text-sm text-ink-primary">{location(visitor)}</p>
          <p className="truncate text-xs text-ink-muted">
            {visitor.device} · {visitor.browser} · {visitor.os}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 ps-[38px] text-xs text-ink-secondary sm:shrink-0 sm:ps-0">
        {children}
      </div>
    </li>
  );
}
