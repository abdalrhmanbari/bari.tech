import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/visits/store";

/** Public, unauthenticated endpoint — the live site pings this once per browser session. */
export async function POST() {
  await recordVisit();
  return NextResponse.json({ ok: true });
}
