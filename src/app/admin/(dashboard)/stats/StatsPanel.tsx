"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventStats, VisitStats, VisitorSession } from "@/lib/visits/schema";
import { Skeleton } from "@/components/ui/Skeleton";
import { BarList, Card, Empty, StatTile } from "./ui";
import {
  ClicksCard,
  EngagementTiles,
  FormsCard,
  NotFoundCard,
  ProjectsCard,
  SectionFunnel,
  SourcesCard,
  VitalsCard,
  describeActions,
} from "./engagement";

const DAYS_SHOWN = 14;
const CHART_HEIGHT = 140;
const TOP_COUNTRIES = 10;
const TOP_BROWSER_LANGS = 8;
/** Background refresh cadence so "Active now" stays live without a manual reload. */
const AUTO_REFRESH_MS = 20_000;

type StatsResponse = {
  stats: VisitStats;
  events?: EventStats;
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

const languageNames =
  typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "language" }) : null;

/** "ar-SA" -> "Arabic"; regional variants are folded into their base language. */
function languageName(tag: string): string {
  try {
    return languageNames?.of(tag) ?? tag;
  } catch {
    return tag;
  }
}

function baseLanguage(tag: string | null): string {
  return tag ? tag.split("-")[0].toLowerCase() : "unknown";
}

const SITE_LANG_LABELS: Record<string, string> = { en: "English", ar: "Arabic" };

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
  const events = data?.events ?? {};
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

  const siteLangs = Object.entries(stats?.byLang ?? {}).sort((a, b) => b[1] - a[1]);
  const siteLangTotal = siteLangs.reduce((sum, [, c]) => sum + c, 0);

  const browserLangCounts: Record<string, number> = {};
  for (const v of recent) {
    const key = baseLanguage(v.language);
    browserLangCounts[key] = (browserLangCounts[key] ?? 0) + 1;
  }
  const browserLangs = Object.entries(browserLangCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_BROWSER_LANGS);

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
                    {/* Named target: clicking again for the same visitor reuses their tab. */}
                    <a
                      href={`/admin/live/${v.id}`}
                      target={`live-${v.id}`}
                      className="rounded border border-red-400/40 px-2 py-0.5 text-[11px] text-red-300 transition hover:border-red-400 hover:text-red-200"
                    >
                      ● Watch live ↗
                    </a>
                  </VisitorRow>
                ))}
              </ul>
            )}
          </Card>

          <h2 className="pt-4 text-sm font-medium text-ink-primary">What visitors do</h2>
          <EngagementTiles events={events} recent={recent} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionFunnel events={events} />
            <FormsCard events={events} />
          </div>
          <ProjectsCard events={events} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ClicksCard events={events} />
            {stats && <SourcesCard stats={stats} />}
          </div>
          <VitalsCard events={events} />
          <NotFoundCard events={events} />

          <h2 className="pt-4 text-sm font-medium text-ink-primary">Who visits</h2>
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Site language (all visits)">
              {siteLangTotal === 0 ? (
                <Empty>No language data yet.</Empty>
              ) : (
                <BarList
                  rows={siteLangs.map(([code, count]) => ({
                    key: code,
                    label: SITE_LANG_LABELS[code] ?? code,
                    badge: code.toUpperCase(),
                    value: `${Math.round((count / siteLangTotal) * 100)}% · ${count.toLocaleString()}`,
                    ratio: count / siteLangTotal,
                  }))}
                />
              )}
            </Card>

            <Card title={`Browser language (last ${recent.length} visitors)`}>
              {browserLangs.length === 0 ? (
                <Empty>No language data yet.</Empty>
              ) : (
                <BarList
                  rows={browserLangs.map(([code, count]) => ({
                    key: code,
                    label: code === "unknown" ? "Unknown" : languageName(code),
                    badge: code === "unknown" ? "??" : code.toUpperCase(),
                    value: count.toLocaleString(),
                    ratio: count / Math.max(1, browserLangs[0][1]),
                  }))}
                />
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
                    <span>{v.source ? `via ?ref=${v.source}` : v.referrer ? `from ${v.referrer}` : "Direct"}</span>
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

function CountryCode({ code }: { code: string | null }) {
  return (
    <span className="inline-flex w-7 shrink-0 justify-center rounded border border-white/10 py-0.5 text-[10px] font-medium text-ink-secondary">
      {code && code !== "XX" ? code : "??"}
    </span>
  );
}

function VisitorRow({ visitor, children }: { visitor: VisitorSession; children: React.ReactNode }) {
  const actions = describeActions(visitor.actions);
  return (
    <li className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <CountryCode code={visitor.countryCode} />
        <div className="min-w-0">
          <p className="truncate text-sm text-ink-primary">
            {location(visitor)}
            {(visitor.visitNumber ?? 1) > 1 && (
              <span className="ms-2 rounded border border-accent/40 px-1.5 py-px text-[10px] text-accent">
                returning · visit #{visitor.visitNumber}
              </span>
            )}
          </p>
          <p className="truncate text-xs text-ink-muted">
            {visitor.device} · {visitor.browser} · {visitor.os}
            {visitor.language && <> · {visitor.language}</>}
            {visitor.siteLang && <> · viewing in {SITE_LANG_LABELS[visitor.siteLang]}</>}
          </p>
          {actions.length > 0 && <p className="mt-0.5 text-xs text-ink-secondary">{actions.join(" · ")}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 ps-[38px] text-xs text-ink-secondary sm:shrink-0 sm:ps-0">
        {children}
      </div>
    </li>
  );
}
