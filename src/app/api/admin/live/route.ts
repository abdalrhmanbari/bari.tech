import { NextResponse, type NextRequest } from "next/server";
import { getActiveSession, isValidSessionId } from "@/lib/visits/store";
import { getLiveBatches, startWatching, stopWatching } from "@/lib/visits/live";

/**
 * Live view of one visitor (admin only — gated by middleware).
 * POST starts/renews the watch lease, GET polls new batches, DELETE stops.
 */
function sessionId(request: NextRequest): string | null {
  const id = request.nextUrl.searchParams.get("id");
  return isValidSessionId(id) ? id : null;
}

export async function POST(request: NextRequest) {
  const id = sessionId(request);
  if (!id) return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  try {
    await startWatching(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Live view needs Netlify Blobs (deploy or `netlify dev`)." }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  const id = sessionId(request);
  if (!id) return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  const since = Number(request.nextUrl.searchParams.get("since") ?? 0) || 0;
  const [batches, session] = await Promise.all([getLiveBatches(id, since), getActiveSession(id)]);
  // `session` is null once the visitor's tab is closed (no recent heartbeat).
  return NextResponse.json({ batches, session });
}

export async function DELETE(request: NextRequest) {
  const id = sessionId(request);
  if (id) await stopWatching(id);
  return NextResponse.json({ ok: true });
}
