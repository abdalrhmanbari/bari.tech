import type { VisitorSession } from "./schema";

type Geo = Pick<VisitorSession, "countryCode" | "city" | "region">;
type Agent = Pick<VisitorSession, "device" | "browser" | "os">;

const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget/i;

/**
 * Reads the visitor's location from the geo headers Netlify attaches to every
 * function request: `x-nf-geo` (base64-encoded JSON) with `x-country` as a
 * fallback. Both are absent outside Netlify (e.g. plain `next dev`).
 */
export function readGeo(headers: Headers): Geo {
  const encoded = headers.get("x-nf-geo");
  if (encoded) {
    try {
      const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
      const geo = JSON.parse(new TextDecoder().decode(bytes)) as {
        city?: string;
        country?: { code?: string };
        subdivision?: { name?: string };
      };
      return {
        countryCode: geo.country?.code?.toUpperCase() || null,
        city: geo.city || null,
        region: geo.subdivision?.name || null,
      };
    } catch {
      // Malformed header — fall through to the plain country header.
    }
  }
  const country = headers.get("x-country");
  return { countryCode: country ? country.toUpperCase() : null, city: null, region: null };
}

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/** Coarse device/browser/OS detection — good enough for a stats overview, not fingerprinting. */
export function parseUserAgent(ua: string): Agent {
  const device: Agent["device"] = /iPad|Tablet/i.test(ua)
    ? "tablet"
    : /Mobi|iPhone|Android/i.test(ua)
      ? "mobile"
      : "desktop";

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Chrome\/|CriOS/.test(ua)
          ? "Chrome"
          : /Firefox\/|FxiOS/.test(ua)
            ? "Firefox"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Other";

  const os = /Windows NT/.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Android/.test(ua)
        ? "Android"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : /Linux/.test(ua)
              ? "Linux"
              : "Other";

  return { device, browser, os };
}
