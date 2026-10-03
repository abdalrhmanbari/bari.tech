import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { endSession, isValidSessionId, startSession, touchSession } from "@/lib/visits/store";
import { isBot, parseUserAgent, readGeo } from "@/lib/visits/request-info";
import type { SiteLang } from "@/lib/visits/schema";
import { normalizeEventName, type TrackedEvent } from "@/lib/visits/events";
import { isWatched, parseLiveBatch, pushLiveBatch } from "@/lib/visits/live";

/** Upper bound on events accepted per request; a real tab sends a handful at a time. */
const MAX_EVENTS_PER_REQUEST = 40;

/**
 * Rejects requests whose Origin/Referer host doesn't match the request's own
 * Host header. This is not a strong security boundary — headers can be
 * spoofed by a determined caller — but it stops the stats from being
 * trivially inflated by naive scripts/crawlers hitting the endpoint directly.
 */
function isSameOrigin(request: NextRequest): boolean {
  const host = request.headers.get("host");
  if (!host) return false;

  for (const header of ["origin", "referer"]) {
    const value = request.headers.get(header);
    if (!value) continue;
    try {
      return new URL(value).host === host;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * True when the request carries a valid admin session cookie — the
 * `admin_session` cookie is set with `path: "/"` (see the login route), so it
 * rides along on this request too even though it's outside `/admin`.
 */
async function isAdminSession(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token, adminPassword);
}

function clip(value: unknown, max = 200): string | null {
  return typeof value === "string" && value ? value.slice(0, max) : null;
}

/** Keeps only the host of an external referrer; same-site or malformed referrers count as direct. */
function referrerHost(value: unknown, ownHost: string | null): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const host = new URL(value).host;
    return host && host !== ownHost ? host.slice(0, 200) : null;
  } catch {
    return null;
  }
}

function siteLang(value: unknown): SiteLang | undefined {
  return value === "en" || value === "ar" ? value : undefined;
}

function parseEvents(value: unknown): TrackedEvent[] {
  if (!Array.isArray(value)) return [];
  const events: TrackedEvent[] = [];
  for (const item of value.slice(0, MAX_EVENTS_PER_REQUEST)) {
    const name = normalizeEventName((item as { name?: unknown } | null)?.name);
    if (!name) continue;
    const raw = (item as { value?: unknown }).value;
    events.push(typeof raw === "number" && Number.isFinite(raw) ? { name, value: raw } : { name });
  }
  return events;
}

/** Short tracking tag from the landing URL (`?ref=` / utm), lowercased. */
function tag(value: unknown): string | null {
  const text = clip(value, 40);
  return text ? text.toLowerCase().replace(/[^a-z0-9._-]/g, "") || null : null;
}

type VisitBody = {
  action?: "start" | "ping" | "leave" | "watch-check" | "live";
  id?: unknown;
  path?: unknown;
  referrer?: unknown;
  language?: unknown;
  siteLang?: unknown;
  events?: unknown;
  visitNumber?: unknown;
  source?: unknown;
  campaign?: unknown;
  batch?: unknown;
};

/**
 * Public, unauthenticated endpoint the live site uses to report visits:
 * `start` once per browser tab, `ping` as a heartbeat while the tab is
 * visible, `leave` (via sendBeacon) when it's hidden or closed. `ping` and
 * `leave` also carry any engagement events the tab has batched since.
 * `watch-check` asks whether the admin opened a live view of this visit, and
 * `live` delivers one live-view batch while they have. The body is
 * sent as text so sendBeacon doesn't need a CORS-preflighted content type.
 */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: VisitBody;
  try {
    body = JSON.parse(await request.text()) as VisitBody;
  } catch {
    body = { action: "start" };
  }

  if (body.action === "watch-check" || body.action === "live") {
    if (!isValidSessionId(body.id)) {
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });
    }
    if (body.action === "watch-check") {
      return NextResponse.json({ watched: await isWatched(body.id) });
    }
    const batch = parseLiveBatch(body.batch);
    if (!batch) return NextResponse.json({ error: "Invalid batch." }, { status: 400 });
    return NextResponse.json({ watched: await pushLiveBatch(body.id, batch) });
  }

  if (body.action === "ping" || body.action === "leave") {
    if (!isValidSessionId(body.id)) {
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });
    }
    const events = parseEvents(body.events);
    if (body.action === "leave") {
      if (events.length) await touchSession(body.id, { events }, false);
      await endSession(body.id);
      return NextResponse.json({ ok: true });
    }
    const known = await touchSession(body.id, {
      path: clip(body.path) ?? undefined,
      siteLang: siteLang(body.siteLang),
      events,
    });
    return NextResponse.json({ ok: known }, { status: known ? 200 : 404 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  // Don't let the site owner's own browsing while logged into /admin, or crawlers, inflate the stats.
  if (isBot(userAgent) || (await isAdminSession(request))) {
    return NextResponse.json({ ok: true, id: null });
  }

  const path = clip(body.path) ?? "/";
  const id = await startSession({
    ...readGeo(request.headers),
    ...parseUserAgent(userAgent),
    referrer: referrerHost(body.referrer, request.headers.get("host")),
    language: clip(body.language, 35),
    siteLang: siteLang(body.siteLang) ?? null,
    visitNumber:
      typeof body.visitNumber === "number" && body.visitNumber >= 1 ? Math.min(Math.floor(body.visitNumber), 100_000) : 1,
    source: tag(body.source),
    campaign: tag(body.campaign),
    landingPath: path,
    path,
  });

  return NextResponse.json({ ok: true, id });
}
