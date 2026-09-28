import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { saveImage } from "@/lib/content/images";

const MAX_SIZE = 4 * 1024 * 1024;
// Netlify Functions reject request bodies over ~6MB, so videos can't go much higher.
const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPEG, WebP, GIF, AVIF, SVG, MP4, or WebM." },
      { status: 400 },
    );
  }
  const isVideo = file.type.startsWith("video/");
  if (file.size > (isVideo ? MAX_VIDEO_SIZE : MAX_SIZE)) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video is too large (max 5MB). Compress it, or host it elsewhere and paste its URL."
          : "Image is too large (max 4MB).",
      },
      { status: 400 },
    );
  }

  const key = `${Date.now()}-${randomUUID()}.${extension}`;

  try {
    await saveImage(key, await file.arrayBuffer(), file.type);
    return NextResponse.json({ url: `/api/images/${key}` });
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
