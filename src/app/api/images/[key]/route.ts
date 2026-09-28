import { NextResponse } from "next/server";
import { readImage } from "@/lib/content/images";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const image = await readImage(key);
  if (!image) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const headers = {
    "Content-Type": image.contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };
  const size = image.data.byteLength;

  // Browsers (Safari in particular) fetch videos with Range requests and
  // won't play them unless we answer with 206 Partial Content.
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    return new NextResponse(image.data.slice(start, end + 1), {
      status: 206,
      headers: {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  return new NextResponse(image.data, {
    headers: { ...headers, "Content-Length": String(size) },
  });
}
