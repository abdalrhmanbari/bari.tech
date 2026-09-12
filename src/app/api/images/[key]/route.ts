import { NextResponse } from "next/server";
import { readImage } from "@/lib/content/images";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const image = await readImage(key);
  if (!image) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
