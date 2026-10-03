/**
 * Engagement event names shared by the client tracker, the visits API and the
 * stats dashboard. An event is `<kind>` or `<kind>:<detail>`, e.g.
 * `section:projects`, `project_view:Marasil`, `click:linkedin@contact`.
 */
export const EVENT_KINDS = [
  "section",
  "project_view",
  "video_complete",
  "project_link",
  "click",
  "form_start",
  "form_submit",
  "form_error",
  "not_found",
  "vital",
] as const;

export type EventKind = (typeof EVENT_KINDS)[number];

export type TrackedEvent = { name: string; value?: number };

const MAX_DETAIL = 80;

/** Returns a cleaned event name, or null when it isn't one we accept. */
export function normalizeEventName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const [kind, ...rest] = value.split(":");
  if (!(EVENT_KINDS as readonly string[]).includes(kind)) return null;
  // eslint-disable-next-line no-control-regex
  const detail = rest.join(":").replace(/[\u0000-\u001f]/g, "").trim().slice(0, MAX_DETAIL);
  return detail ? `${kind}:${detail}` : kind;
}

export const VITAL_METRICS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;
export type VitalMetric = (typeof VITAL_METRICS)[number];
export type VitalRating = "good" | "needs-improvement" | "poor";

/** Google's published "good" / "poor" boundaries (ms, except CLS which is unitless). */
const VITAL_THRESHOLDS: Record<VitalMetric, [number, number]> = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

export function isVitalMetric(value: string): value is VitalMetric {
  return (VITAL_METRICS as readonly string[]).includes(value);
}

export function rateVital(metric: VitalMetric, value: number): VitalRating {
  const [good, poor] = VITAL_THRESHOLDS[metric];
  return value <= good ? "good" : value <= poor ? "needs-improvement" : "poor";
}
