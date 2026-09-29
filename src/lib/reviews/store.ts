import { getStore } from "@netlify/blobs";
import type { PublicReview, Review, ReviewTranslation } from "./schema";

const STORE_NAME = "client-reviews";

/**
 * Netlify Blobs auto-configures from the deploy environment when this runs
 * as a Netlify Function. Outside that context — e.g. plain `next dev` — it
 * throws, so callers must handle the failure. Strong consistency so an
 * approval shows up on the site immediately.
 */
function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Persists a new review as pending (not shown until approved). Throws if storage is unreachable. */
export async function saveReview(
  data: Omit<Review, "id" | "createdAt" | "approved">,
): Promise<void> {
  const review: Review = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    approved: false,
  };
  await store().setJSON(review.id, review);
}

/** All reviews newest-first, or `[]` when storage is unreachable. */
export async function listReviews(): Promise<Review[]> {
  try {
    const { blobs } = await store().list();
    const reviews = await Promise.all(
      blobs.map((blob) => store().get(blob.key, { type: "json" }) as Promise<Review | null>),
    );
    return reviews
      .filter((r): r is Review => r !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/** Approved reviews for the public site, trimmed to the fields it needs. */
export async function listApprovedReviews(): Promise<PublicReview[]> {
  const reviews = await listReviews();
  return reviews
    .filter((r) => r.approved)
    .map(({ id, name, role, project, rating, text, lang, translation }) => ({
      id, name, role, project, rating, text, lang,
      ...(translation?.text ? { translation } : {}),
    }));
}

/**
 * Saves (or, with empty text, clears) the translation into the other
 * language. Throws if Netlify Blobs isn't reachable.
 */
export async function setReviewTranslation(id: string, translation: ReviewTranslation): Promise<void> {
  const current = (await store().get(id, { type: "json" })) as Review | null;
  if (!current) return;
  const next: Review = { ...current };
  delete next.translation;
  if (translation.text) next.translation = translation;
  await store().setJSON(id, next);
}

/** Throws if Netlify Blobs isn't reachable — callers surface this to the admin UI. */
export async function setReviewApproved(id: string, approved: boolean): Promise<void> {
  const current = (await store().get(id, { type: "json" })) as Review | null;
  if (!current) return;
  await store().setJSON(id, { ...current, approved });
}

/** Throws if Netlify Blobs isn't reachable — callers surface this to the admin UI. */
export async function deleteReview(id: string): Promise<void> {
  await store().delete(id);
}
