import type { Metadata } from "next";
import { ReviewPage } from "@/components/sections/ReviewPage";

// Private page: only reachable from the link sent to clients.
export const metadata: Metadata = {
  title: "Leave a Review",
  robots: { index: false, follow: false },
};

export default async function Review({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const { project } = await searchParams;
  return <ReviewPage initialProject={typeof project === "string" ? project : ""} />;
}
