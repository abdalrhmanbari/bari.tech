import { NextResponse } from "next/server";
import type { Lang } from "@/data/i18n/types";
import { getEditableContent } from "@/lib/content/merge";
import { readOverride, writeOverride } from "@/lib/content/store";
import { isSectionKey } from "@/lib/content/schema";

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ar";
}

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang");
  if (!isLang(lang)) {
    return NextResponse.json({ error: "Invalid or missing ?lang=en|ar" }, { status: 400 });
  }
  const content = await getEditableContent(lang);
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const lang = body?.lang;
  const section = body?.section;
  const data = body?.data;

  if (!isLang(lang) || !isSectionKey(section) || typeof data !== "object" || data === null) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    const current = (await readOverride(lang)) ?? {};
    await writeOverride(lang, { ...current, [section]: data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "Storage unavailable. This works once the site is deployed on Netlify (Netlify Blobs), or locally via `netlify dev`.",
      },
      { status: 503 },
    );
  }
}
