import { NextResponse } from "next/server";
import {
  deleteReview,
  listReviews,
  setReviewApproved,
  setReviewTranslation,
} from "@/lib/reviews/store";

const STORAGE_ERROR =
  "Storage unavailable. This works once the site is deployed on Netlify (Netlify Blobs), or locally via `netlify dev`.";

export async function GET() {
  const reviews = await listReviews();
  return NextResponse.json({ reviews });
}

/** Body: `{ id, approved: boolean }` or `{ id, translation: { text, role } }`. */
export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id;
  const approved = body?.approved;
  const translation = body?.translation;
  const isTranslation =
    typeof translation === "object" &&
    translation !== null &&
    typeof translation.text === "string" &&
    typeof translation.role === "string";

  if (typeof id !== "string" || (typeof approved !== "boolean" && !isTranslation)) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    if (isTranslation) {
      await setReviewTranslation(id, {
        text: translation.text.trim().slice(0, 2000),
        role: translation.role.trim().slice(0, 150),
      });
    } else {
      await setReviewApproved(id, approved);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: STORAGE_ERROR }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ?id=" }, { status: 400 });
  }

  try {
    await deleteReview(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: STORAGE_ERROR }, { status: 503 });
  }
}
