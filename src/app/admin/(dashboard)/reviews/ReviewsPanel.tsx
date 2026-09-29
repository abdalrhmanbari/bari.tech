"use client";

import { useCallback, useEffect, useState } from "react";
import type { Review, ReviewTranslation } from "@/lib/reviews/schema";
import { Skeleton } from "@/components/ui/Skeleton";

const LANG_NAMES = { en: "English", ar: "Arabic" } as const;

const fieldClass =
  "w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-ink-primary outline-none focus:border-white/30";

/** Edits the translation of one review into the language it wasn't written in. */
function TranslationEditor({
  review,
  onSaved,
}: {
  review: Review;
  onSaved: (translation: ReviewTranslation | undefined) => void;
}) {
  const target = review.lang === "ar" ? "en" : "ar";
  const [text, setText] = useState(review.translation?.text ?? "");
  const [role, setRole] = useState(review.translation?.role ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = text !== (review.translation?.text ?? "") || role !== (review.translation?.role ?? "");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, translation: { text, role } }),
      });
      if (!res.ok) throw new Error();
      onSaved(text.trim() ? { text: text.trim(), role: role.trim() } : undefined);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mb-3 rounded-md border border-white/10 bg-white/[0.02] p-3">
      <p className="mb-2 text-xs text-ink-secondary">
        Translation into {LANG_NAMES[target]} — shown to {LANG_NAMES[target]} visitors, labelled as translated.
        Leave empty to show the original to everyone.
      </p>
      <textarea
        rows={3}
        dir={target === "ar" ? "rtl" : "ltr"}
        value={text}
        onChange={(e) => { setText(e.target.value); setStatus("idle"); }}
        placeholder={`Review in ${LANG_NAMES[target]}`}
        className={`${fieldClass} mb-2`}
      />
      <input
        type="text"
        dir={target === "ar" ? "rtl" : "ltr"}
        value={role}
        onChange={(e) => { setRole(e.target.value); setStatus("idle"); }}
        placeholder={review.role ? `Role in ${LANG_NAMES[target]} (original: ${review.role})` : `Role in ${LANG_NAMES[target]} (optional)`}
        className={`${fieldClass} mb-2`}
      />
      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || status === "saving"}
          className="rounded-md bg-ink-primary px-3 py-1.5 font-medium text-bg-primary transition disabled:opacity-40"
        >
          {status === "saving" ? "Saving…" : "Save translation"}
        </button>
        {status === "saved" && <span className="text-emerald-400">Saved</span>}
        {status === "error" && <span className="text-red-400">Save failed — try again.</span>}
      </div>
    </div>
  );
}

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
              <p className="mb-1 text-[11px] uppercase tracking-wide text-ink-secondary">
                Original ({LANG_NAMES[r.lang]})
              </p>
              <p dir="auto" className="mb-3 whitespace-pre-wrap text-sm text-ink-primary/90">
                {r.text}
              </p>

              <TranslationEditor
                review={r}
                onSaved={(translation) =>
                  setReviews((prev) => prev.map((item) => (item.id === r.id ? { ...item, translation } : item)))
                }
              />

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
