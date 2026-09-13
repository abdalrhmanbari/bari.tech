import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/admin/auth";
import { recordVisit } from "@/lib/visits/store";

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

/** Public, unauthenticated endpoint — the live site pings this once per browser tab session. */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Don't let the site owner's own browsing while logged into /admin inflate the stats.
  if (!(await isAdminSession(request))) {
    await recordVisit();
  }

  return NextResponse.json({ ok: true });
}
