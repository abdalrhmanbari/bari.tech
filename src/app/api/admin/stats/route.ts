import { NextResponse } from "next/server";
import { getActiveVisitors, getEventStats, getRecentVisitors, getVisitStats } from "@/lib/visits/store";

export async function GET() {
  const [stats, events, active, recent] = await Promise.all([
    getVisitStats(),
    getEventStats(),
    getActiveVisitors(),
    getRecentVisitors(),
  ]);
  return NextResponse.json({ stats, events, active, recent });
}
