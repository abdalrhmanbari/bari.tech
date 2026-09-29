import { NextResponse } from "next/server";
import { getActiveVisitors, getRecentVisitors, getVisitStats } from "@/lib/visits/store";

export async function GET() {
  const [stats, active, recent] = await Promise.all([
    getVisitStats(),
    getActiveVisitors(),
    getRecentVisitors(),
  ]);
  return NextResponse.json({ stats, active, recent });
}
