import { getStore } from "@netlify/blobs";
import type { Lang } from "@/data/i18n/types";
import type { ContentOverride } from "./schema";

const STORE_NAME = "cms-content";

/**
 * Netlify Blobs auto-configures from the deploy environment when this runs
 * as a Netlify Function (which the Next.js Runtime uses for API routes and
 * server components). Outside that context — e.g. plain `next dev` — it
 * throws, so callers must handle the failure.
 */
function store() {
  return getStore(STORE_NAME);
}

/** Returns `null` when no override has been saved yet, or storage is unreachable. */
export async function readOverride(
  lang: Lang,
): Promise<Partial<ContentOverride> | null> {
  try {
    const data = await store().get(lang, { type: "json" });
    return (data as Partial<ContentOverride> | null) ?? null;
  } catch {
    return null;
  }
}

/** Throws if Netlify Blobs isn't reachable — callers surface this to the admin UI. */
export async function writeOverride(
  lang: Lang,
  data: Partial<ContentOverride>,
): Promise<void> {
  await store().setJSON(lang, data);
}
