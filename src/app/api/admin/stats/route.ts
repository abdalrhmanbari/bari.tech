import { NextResponse } from "next/server";
import { getVisitStats } from "@/lib/visits/store";

export async function GET() {
  const stats = await getVisitStats();
  return NextResponse.json({ stats });
}
