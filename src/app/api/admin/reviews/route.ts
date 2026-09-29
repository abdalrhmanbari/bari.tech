import { NextResponse } from "next/server";
import { deleteReview, listReviews, setReviewApproved } from "@/lib/reviews/store";

const STORAGE_ERROR =
  "Storage unavailable. This works once the site is deployed on Netlify (Netlify Blobs), or locally via `netlify dev`.";

export async function GET() {
  const reviews = await listReviews();
  return NextResponse.json({ reviews });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id;
  const approved = body?.approved;

  if (typeof id !== "string" || typeof approved !== "boolean") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    await setReviewApproved(id, approved);
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
