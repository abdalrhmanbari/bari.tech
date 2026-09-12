import { getStore } from "@netlify/blobs";

const STORE_NAME = "cms-images";

/**
 * Same runtime caveat as `store.ts`: Netlify Blobs auto-configures from the
 * deploy environment, so this only works as a Netlify Function (deployed, or
 * via `netlify dev`).
 */
function store() {
  return getStore(STORE_NAME);
}

export type StoredImage = {
  data: ArrayBuffer;
  contentType: string;
};

export async function saveImage(
  key: string,
  data: ArrayBuffer,
  contentType: string,
): Promise<void> {
  await store().set(key, data, { metadata: { contentType } });
}

/** Returns `null` when the key doesn't exist, or storage is unreachable. */
export async function readImage(key: string): Promise<StoredImage | null> {
  try {
    const result = await store().getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) return null;
    const contentType =
      typeof result.metadata?.contentType === "string"
        ? result.metadata.contentType
        : "application/octet-stream";
    return { data: result.data, contentType };
  } catch {
    return null;
  }
}
