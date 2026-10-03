export type VisitStats = {
  total: number;
  /** ISO date ("YYYY-MM-DD", UTC) -> visit count for that day. */
  byDay: Record<string, number>;
  /** ISO 3166-1 alpha-2 country code (or "XX" when unknown) -> all-time visit count. */
  byCountry?: Record<string, number>;
  /** Site language ("en" / "ar") -> number of visits currently in that language; follows mid-visit switches. */
  byLang?: Record<string, number>;
  /** Visits from a browser that had already visited before (more than RETURN_GAP_MS earlier). */
  returning?: number;
  /** Acquisition source (`?ref=` / `utm_source`, else referrer host, else "direct") -> visit count. */
  bySource?: Record<string, number>;
};

/**
 * Engagement counters, each meaning "number of visits that did X" — every
 * event counts at most once per visit (deduped server-side against the
 * session's `actions`). Keys look like `section:projects`, `click:linkedin@contact`,
 * `form_submit:quote`, `not_found:/old-page`. Web Vitals are stored as
 * `vital:<metric>:<device>:<rating>` counts plus `vitalsum:<metric>:<device>` totals.
 */
export type EventStats = Record<string, number>;

export type SiteLang = "en" | "ar";

/** One browser-tab session on the live site. No IP address or other identifier is stored. */
export type VisitorSession = {
  id: string;
  /** ISO timestamp of the first page load in this tab. */
  startedAt: string;
  /** ISO timestamp of the latest heartbeat. */
  lastSeen: string;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
  /** Host of the external page that linked here, or null for direct visits. */
  referrer: string | null;
  /** Browser/OS language (`navigator.language`), e.g. "ar-SA". */
  language: string | null;
  /** Language the visitor is viewing the site in (the EN/AR toggle). Absent on sessions recorded before it was tracked. */
  siteLang?: SiteLang | null;
  /** 1 for a browser's first visit, 2 for its second, … (stored in localStorage). */
  visitNumber?: number;
  /** `?ref=` / `utm_source` from the landing URL, e.g. "linkedin" or "cv". */
  source?: string | null;
  /** `utm_campaign` from the landing URL. */
  campaign?: string | null;
  /** Distinct engagement events this visit triggered, in order (see EventStats). */
  actions?: string[];
  landingPath: string;
  /** Path the visitor is currently on (updated on client-side navigation). */
  path: string;
};
