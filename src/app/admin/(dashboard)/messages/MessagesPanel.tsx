"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/messages/schema";
import { Skeleton } from "@/components/ui/Skeleton";

export function MessagesPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load messages.");
      setMessages(body.messages as ContactMessage[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(m: ContactMessage) {
    setBusyId(m.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, read: !m.read }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Update failed.");
      setMessages((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, read: !m.read } : item)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(m: ContactMessage) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    setBusyId(m.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(m.id)}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Delete failed.");
      setMessages((prev) => prev.filter((item) => item.id !== m.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-ink-primary">Messages</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Submissions from the contact form.
            {unreadCount > 0 && ` ${unreadCount} unread.`}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-ink-secondary transition hover:border-white/20 hover:text-ink-primary"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-card p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-3 h-3 w-2/3" />
              <div className="flex gap-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <p className="text-sm text-ink-secondary">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border p-4 ${
                m.read ? "border-white/10 bg-card" : "border-white/20 bg-white/[0.04]"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-ink-primary">
                    {!m.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    )}
                    {m.name}
                  </p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-ink-secondary hover:text-ink-primary"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="text-xs text-ink-secondary">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="mb-3 whitespace-pre-wrap text-sm text-ink-primary/90">{m.message}</p>

              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href={`mailto:${m.email}`}
                  className="text-ink-secondary hover:text-ink-primary"
                >
                  Reply
                </a>
                <button
                  type="button"
                  disabled={busyId === m.id}
                  onClick={() => toggleRead(m)}
                  className="text-ink-secondary hover:text-ink-primary disabled:opacity-50"
                >
                  {m.read ? "Mark as unread" : "Mark as read"}
                </button>
                <button
                  type="button"
                  disabled={busyId === m.id}
                  onClick={() => remove(m)}
                  className="text-ink-secondary hover:text-red-400 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
