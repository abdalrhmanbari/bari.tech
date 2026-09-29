"use client";

import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/lib/reviews/schema";
import { Skeleton } from "@/components/ui/Skeleton";

export function ReviewsPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to load reviews.");
      setReviews(body.reviews as Review[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleApproved(r: Review) {
    setBusyId(r.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, approved: !r.approved }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Update failed.");
      setReviews((prev) => prev.map((item) => (item.id === r.id ? { ...item, approved: !r.approved } : item)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(r: Review) {
    if (!confirm(`Delete the review from ${r.name}?`)) return;
    setBusyId(r.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(r.id)}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Delete failed.");
      setReviews((prev) => prev.filter((item) => item.id !== r.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/review`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-medium text-ink-primary">Reviews</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Client reviews from the private /review page. Only approved ones appear on the site.
            {pendingCount > 0 && ` ${pendingCount} pending.`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-ink-secondary transition hover:border-white/20 hover:text-ink-primary"
          >
            {copied ? "Copied!" : "Copy review link"}
          </button>
          <button
            type="button"
            onClick={load}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-ink-secondary transition hover:border-white/20 hover:text-ink-primary"
          >
            Refresh
          </button>
        </div>
      </div>

      <p className="mb-4 text-xs text-ink-secondary">
        Tip: add <code className="rounded bg-white/5 px-1">?project=Project Title</code> to the link to preselect a project,
        e.g. <code className="rounded bg-white/5 px-1">/review?project=MAHAM</code>.
      </p>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-card p-4">
              <Skeleton className="mb-2 h-4 w-40" />
              <Skeleton className="mb-3 h-3 w-24" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink-secondary">No reviews yet. Send the review link to a client to get one.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`rounded-lg border p-4 ${r.approved ? "border-white/10 bg-card" : "border-amber-400/30 bg-amber-400/[0.04]"}`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-ink-primary">
                    {r.name}
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        r.approved ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
                      }`}
                    >
                      {r.approved ? "Shown on site" : "Pending"}
                    </span>
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {r.role ? `${r.role} · ` : ""}
                    {r.project}
                  </p>
                </div>
                <span className="text-xs text-ink-secondary">{new Date(r.createdAt).toLocaleString()}</span>
              </div>

              <p className="mb-2 text-amber-300" aria-label={`${r.rating} out of 5 stars`}>
                {"★".repeat(r.rating)}
                <span className="text-white/20">{"★".repeat(5 - r.rating)}</span>
              </p>
              <p dir="auto" className="mb-3 whitespace-pre-wrap text-sm text-ink-primary/90">
                {r.text}
              </p>

              <div className="flex flex-wrap gap-3 text-xs">
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => toggleApproved(r)}
                  className={`disabled:opacity-50 ${r.approved ? "text-ink-secondary hover:text-ink-primary" : "font-medium text-emerald-300 hover:text-emerald-200"}`}
                >
                  {r.approved ? "Hide from site" : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => remove(r)}
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
