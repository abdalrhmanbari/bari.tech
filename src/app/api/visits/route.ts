import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { endSession, isValidSessionId, startSession, touchSession } from "@/lib/visits/store";
import { isBot, parseUserAgent, readGeo } from "@/lib/visits/request-info";

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

type VisitBody = {
  action?: "start" | "ping" | "leave";
  id?: unknown;
  path?: unknown;
  referrer?: unknown;
  language?: unknown;
};

/**
 * Public, unauthenticated endpoint the live site uses to report visits:
 * `start` once per browser tab, `ping` as a heartbeat while the tab is
 * visible, `leave` (via sendBeacon) when it's hidden or closed. The body is
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

  if (body.action === "ping" || body.action === "leave") {
    if (!isValidSessionId(body.id)) {
      return NextResponse.json({ error: "Invalid session." }, { status: 400 });
    }
    if (body.action === "leave") {
      await endSession(body.id);
      return NextResponse.json({ ok: true });
    }
    const known = await touchSession(body.id, clip(body.path) ?? undefined);
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
    landingPath: path,
    path,
  });

  return NextResponse.json({ ok: true, id });
}
