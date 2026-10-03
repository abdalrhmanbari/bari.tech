"use client";

import type { EventStats, VisitStats, VisitorSession } from "@/lib/visits/schema";
import { VITAL_METRICS, type VitalMetric } from "@/lib/visits/events";
import { BarList, Card, Empty, StatTile } from "./ui";

/** Home page sections in page order, with the names used in the dashboard. */
const HOME_SECTIONS: [id: string, label: string][] = [
  ["hero", "Top (hero)"],
  ["about", "About"],
  ["services", "Services"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["techstack", "Skills"],
  ["faq", "FAQ"],
  ["testimonials", "Reviews"],
  ["contact", "Contact"],
];

const FORMS: [id: string, label: string][] = [
  ["contact", "Contact form"],
  ["quote", "Quote request"],
  ["review", "Review"],
];

const DEVICES = ["mobile", "tablet", "desktop"] as const;
const TOP_CLICKS = 12;
const TOP_SOURCES = 10;

const LINK_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  github: "GitHub",
  quote: "Get a quote page",
  review: "Review page",
  home: "Home page",
};

function percent(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "–";
}

/** Counters of one kind (`kind:detail`), as detail -> count, largest first. */
function byDetail(events: EventStats, kind: string): [string, number][] {
  const prefix = `${kind}:`;
  return Object.entries(events)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, count]): [string, number] => [key.slice(prefix.length), count])
    .sort((a, b) => b[1] - a[1]);
}

function linkLabel(target: string): string {
  if (target.startsWith("nav:")) return `Jump to #${target.slice(4)}`;
  if (target.startsWith("download:")) return `Download ${target.slice(9)}`;
  return LINK_LABELS[target] ?? target;
}

/** `whatsapp@contact` -> "WhatsApp" + "contact". */
function splitClick(detail: string): { label: string; area: string } {
  const at = detail.lastIndexOf("@");
  return at < 0
    ? { label: linkLabel(detail), area: "" }
    : { label: linkLabel(detail.slice(0, at)), area: detail.slice(at + 1) };
}

/** Plain-language summary of one visitor's actions, for the visitor lists. */
export function describeActions(actions: string[] | undefined): string[] {
  if (!actions?.length) return [];
  const sections = new Set(actions.filter((a) => a.startsWith("section:")).map((a) => a.slice(8)));
  const deepest = [...HOME_SECTIONS].reverse().find(([id]) => sections.has(id));
  const out: string[] = [];
  if (deepest && deepest[0] !== "hero") out.push(`scrolled to ${deepest[1]}`);
  for (const action of actions) {
    const [kind, ...rest] = action.split(":");
    const detail = rest.join(":");
    if (kind === "project_link") out.push(`opened ${detail} link`);
    else if (kind === "video_complete") out.push(`watched ${detail} demo`);
    else if (kind === "click") out.push(`clicked ${splitClick(detail).label}`);
    else if (kind === "form_submit") out.push(`sent ${detail} form`);
    else if (kind === "form_start" && !actions.includes(`form_submit:${detail}`)) out.push(`started ${detail} form`);
    else if (kind === "not_found") out.push(`hit 404 ${detail}`);
  }
  return out;
}

export function EngagementTiles({ events, recent }: { events: EventStats; recent: VisitorSession[] }) {
  const home = events["section:hero"] ?? 0;
  const tracked = recent.filter((v) => v.visitNumber !== undefined);
  const returning = tracked.filter((v) => (v.visitNumber ?? 1) > 1).length;
  const sent = FORMS.reduce((sum, [id]) => sum + (events[`form_submit:${id}`] ?? 0), 0);
  const started = FORMS.reduce((sum, [id]) => sum + (events[`form_start:${id}`] ?? 0), 0);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatTile label="Returning visitors" value={percent(returning, tracked.length)} hint={`of last ${tracked.length} visits`} />
      <StatTile label="Reached Projects" value={percent(events["section:projects"] ?? 0, home)} hint="of home page visits" />
      <StatTile label="Reached Contact" value={percent(events["section:contact"] ?? 0, home)} hint="of home page visits" />
      <StatTile label="Forms sent" value={sent} hint={`${percent(sent, started)} of forms started`} />
    </div>
  );
}

export function SectionFunnel({ events }: { events: EventStats }) {
  const base = events["section:hero"] ?? 0;
  return (
    <Card title="How far visitors scroll" note="Share of home page visits that reached each section.">
      {base === 0 ? (
        <Empty>No scroll data yet.</Empty>
      ) : (
        <BarList
          rows={HOME_SECTIONS.map(([id, label], i) => {
            const count = events[`section:${id}`] ?? 0;
            return {
              key: id,
              label,
              badge: String(i + 1).padStart(2, "0"),
              value: `${percent(count, base)} · ${count.toLocaleString()}`,
              ratio: count / base,
            };
          })}
        />
      )}
    </Card>
  );
}

export function ProjectsCard({ events }: { events: EventStats }) {
  const views = byDetail(events, "project_view");
  const titles = new Set([
    ...views.map(([t]) => t),
    ...byDetail(events, "video_complete").map(([t]) => t),
    ...byDetail(events, "project_link").map(([t]) => t),
  ]);
  const rows = [...titles]
    .map((title) => ({
      title,
      views: events[`project_view:${title}`] ?? 0,
      watched: events[`video_complete:${title}`] ?? 0,
      opened: events[`project_link:${title}`] ?? 0,
    }))
    .sort((a, b) => b.views - a.views || b.opened - a.opened);

  return (
    <Card title="Projects" note="Visits that looked at each project, watched its whole demo, or opened its link.">
      {rows.length === 0 ? (
        <Empty>No project data yet.</Empty>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-ink-muted">
              <th className="pb-2 font-normal">Project</th>
              <th className="pb-2 text-right font-normal">Viewed</th>
              <th className="pb-2 text-right font-normal">Watched demo</th>
              <th className="pb-2 text-right font-normal">Opened link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.title}>
                <td className="py-2 text-ink-primary">{row.title}</td>
                <td className="py-2 text-right tabular-nums text-ink-secondary">{row.views}</td>
                <td className="py-2 text-right tabular-nums text-ink-secondary">
                  {row.watched} <span className="text-ink-muted">({percent(row.watched, row.views)})</span>
                </td>
                <td className="py-2 text-right tabular-nums text-ink-secondary">
                  {row.opened} <span className="text-ink-muted">({percent(row.opened, row.views)})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export function FormsCard({ events }: { events: EventStats }) {
  const rows = FORMS.map(([id, label]) => ({
    id,
    label,
    started: events[`form_start:${id}`] ?? 0,
    sent: events[`form_submit:${id}`] ?? 0,
    errors: events[`form_error:${id}`] ?? 0,
  }));

  return (
    <Card title="Forms" note="Visits that started filling a form vs. sent it. A big gap means the form scares people off.">
      {rows.every((r) => r.started === 0) ? (
        <Empty>No form activity yet.</Empty>
      ) : (
        <ul className="divide-y divide-white/5">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
              <span className="text-ink-primary">{row.label}</span>
              <span className="flex gap-3 text-xs tabular-nums text-ink-secondary">
                <span>{row.started} started</span>
                <span className="text-ink-primary">
                  {row.sent} sent ({percent(row.sent, row.started)})
                </span>
                {row.errors > 0 && <span className="text-amber-400">{row.errors} hit an error</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function ClicksCard({ events }: { events: EventStats }) {
  const clicks = byDetail(events, "click").slice(0, TOP_CLICKS);
  const max = Math.max(1, ...clicks.map(([, c]) => c));
  return (
    <Card title="Buttons & links used" note="Visits that clicked each link, and where on the page it was.">
      {clicks.length === 0 ? (
        <Empty>No clicks recorded yet.</Empty>
      ) : (
        <BarList
          rows={clicks.map(([detail, count]) => {
            const { label, area } = splitClick(detail);
            return {
              key: detail,
              label: area ? `${label} · ${area}` : label,
              badge: label.slice(0, 2).toUpperCase(),
              value: count.toLocaleString(),
              ratio: count / max,
            };
          })}
        />
      )}
    </Card>
  );
}

export function SourcesCard({ stats }: { stats: VisitStats }) {
  const sources = Object.entries(stats.bySource ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_SOURCES);
  const max = Math.max(1, ...sources.map(([, c]) => c));
  return (
    <Card
      title="Where visitors come from"
      note={
        <>
          Add <code className="text-ink-secondary">?ref=name</code> to links you share (e.g.{" "}
          <code className="text-ink-secondary">?ref=cv</code>) to see them here by name.
        </>
      }
    >
      {sources.length === 0 ? (
        <Empty>No source data yet.</Empty>
      ) : (
        <BarList
          rows={sources.map(([source, count]) => ({
            key: source,
            label: source === "direct" ? "Direct / unknown" : source,
            badge: source.slice(0, 2).toUpperCase(),
            value: count.toLocaleString(),
            ratio: count / max,
          }))}
        />
      )}
    </Card>
  );
}

function formatVital(metric: VitalMetric, value: number): string {
  if (metric === "CLS") return value.toFixed(2);
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`;
}

export function VitalsCard({ events }: { events: EventStats }) {
  const cell = (metric: VitalMetric, device: string) => {
    const good = events[`vital:${metric}:${device}:good`] ?? 0;
    const mid = events[`vital:${metric}:${device}:needs-improvement`] ?? 0;
    const poor = events[`vital:${metric}:${device}:poor`] ?? 0;
    const count = good + mid + poor;
    if (count === 0) return null;
    const avg = (events[`vitalsum:${metric}:${device}`] ?? 0) / count;
    return { avg, goodShare: good / count, poorShare: poor / count, count };
  };
  const devices = DEVICES.filter((d) => VITAL_METRICS.some((m) => cell(m, d)));

  return (
    <Card
      title="Speed for real visitors (Web Vitals)"
      note="Average per device, and the share of visits Google rates “good”. LCP = main content shown, INP = response to taps, CLS = layout jumping."
    >
      {devices.length === 0 ? (
        <Empty>No speed data yet.</Empty>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-ink-muted">
              <th className="pb-2 font-normal">Metric</th>
              {devices.map((d) => (
                <th key={d} className="pb-2 text-right font-normal capitalize">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {VITAL_METRICS.map((metric) => (
              <tr key={metric}>
                <td className="py-2 text-ink-primary">{metric}</td>
                {devices.map((device) => {
                  const c = cell(metric, device);
                  if (!c) return <td key={device} className="py-2 text-right text-ink-muted">–</td>;
                  const tone =
                    c.goodShare >= 0.75 ? "text-emerald-400" : c.poorShare > 0.25 ? "text-red-400" : "text-amber-400";
                  return (
                    <td key={device} className="py-2 text-right tabular-nums text-ink-secondary">
                      {formatVital(metric, c.avg)}{" "}
                      <span className={tone} title={`${c.count} visits measured`}>
                        {percent(c.goodShare, 1)} good
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export function NotFoundCard({ events }: { events: EventStats }) {
  const paths = byDetail(events, "not_found");
  if (paths.length === 0) return null;
  return (
    <Card title="Broken links (404)" note="Addresses visitors landed on that don't exist. Fix or redirect the frequent ones.">
      <ul className="divide-y divide-white/5">
        {paths.map(([path, count]) => (
          <li key={path} className="flex items-center justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0">
            <code className="truncate text-ink-primary">{path}</code>
            <span className="tabular-nums text-ink-secondary">{count.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
