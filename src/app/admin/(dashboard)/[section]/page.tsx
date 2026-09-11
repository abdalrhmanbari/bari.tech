import { notFound } from "next/navigation";
import { isSectionKey } from "@/lib/content/schema";
import { SectionEditor } from "./SectionEditor";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();

  return <SectionEditor section={section} />;
}
