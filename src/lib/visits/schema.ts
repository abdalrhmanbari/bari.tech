export type VisitStats = {
  total: number;
  /** ISO date ("YYYY-MM-DD", UTC) -> visit count for that day. */
  byDay: Record<string, number>;
  /** ISO 3166-1 alpha-2 country code (or "XX" when unknown) -> all-time visit count. */
  byCountry?: Record<string, number>;
};

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
  language: string | null;
  landingPath: string;
  /** Path the visitor is currently on (updated on client-side navigation). */
  path: string;
};
