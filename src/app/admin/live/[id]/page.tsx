import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidSessionId } from "@/lib/visits/store";
import { LiveViewer } from "./LiveViewer";

export const metadata: Metadata = { title: "Watch live · Admin" };

/** Opened in its own tab from Stats → "Watch live" (gated by middleware like the rest of /admin). */
export default async function LiveViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidSessionId(id)) notFound();
  return <LiveViewer visitorId={id} />;
}
