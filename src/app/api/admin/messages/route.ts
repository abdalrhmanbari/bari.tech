import { NextResponse } from "next/server";
import { deleteMessage, listMessages, setMessageRead } from "@/lib/messages/store";

export async function GET() {
  const messages = await listMessages();
  return NextResponse.json({ messages });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id;
  const read = body?.read;

  if (typeof id !== "string" || typeof read !== "boolean") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    await setMessageRead(id, read);
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

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ?id=" }, { status: 400 });
  }

  try {
    await deleteMessage(id);
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
