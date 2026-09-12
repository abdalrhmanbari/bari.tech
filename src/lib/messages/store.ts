import { getStore } from "@netlify/blobs";
import type { ContactMessage } from "./schema";

const STORE_NAME = "contact-messages";

/**
 * Netlify Blobs auto-configures from the deploy environment when this runs
 * as a Netlify Function. Outside that context — e.g. plain `next dev` — it
 * throws, so callers must handle the failure.
 */
function store() {
  return getStore(STORE_NAME);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Persists a new submission. Callers should treat failures as non-fatal — email delivery is the primary channel. */
export async function saveMessage(
  data: Pick<ContactMessage, "name" | "email" | "message">,
): Promise<void> {
  const message: ContactMessage = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    read: false,
  };
  await store().setJSON(message.id, message);
}

/** Returns submissions newest-first, or `[]` when storage is unreachable. */
export async function listMessages(): Promise<ContactMessage[]> {
  try {
    const { blobs } = await store().list();
    const messages = await Promise.all(
      blobs.map((blob) => store().get(blob.key, { type: "json" }) as Promise<ContactMessage | null>),
    );
    return messages
      .filter((m): m is ContactMessage => m !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

/** Throws if Netlify Blobs isn't reachable — callers surface this to the admin UI. */
export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const current = (await store().get(id, { type: "json" })) as ContactMessage | null;
  if (!current) return;
  await store().setJSON(id, { ...current, read });
}

/** Throws if Netlify Blobs isn't reachable — callers surface this to the admin UI. */
export async function deleteMessage(id: string): Promise<void> {
  await store().delete(id);
}
