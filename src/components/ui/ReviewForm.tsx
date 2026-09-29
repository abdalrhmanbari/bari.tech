"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "invalid" | "error";

const fieldClass = "mb-7";
const labelClass = "mb-3 block text-[12px] uppercase tracking-[0.1em] text-ink-muted";
const inputClass =
  "w-full rounded-[10px] border border-hair bg-surface px-4 py-3.5 text-[14px] text-ink-primary transition-colors duration-300 placeholder:text-ink-muted focus:border-accent-dim focus:outline-none";

/** `initialProject` preselects a project from the link, e.g. /review?project=MAHAM. */
export function ReviewForm({ initialProject = "" }: { initialProject?: string }) {
  const { dict, lang } = useLanguage();
  const t = dict.review;
  const projects = dict.projects.items.map((p) => p.title);
  const preselected = projects.find((p) => p.toLowerCase() === initialProject.trim().toLowerCase()) ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const payload = {
      project: get("project"),
      rating,
      name: get("name"),
      role: get("role"),
      text: get("text"),
      consent: data.get("consent") === "on",
      company: get("company"), // honeypot
      lang,
    };

    if (!payload.project || !rating || !payload.name || !payload.text || !payload.consent) {
      setStatus("invalid");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        console.error("Review form failed:", res.status, detail);
        setStatus(res.status === 422 ? "invalid" : "error");
        return;
      }
      setStatus("success");
    } catch (err) {
      console.error("Review form network error:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-2xl border border-hair bg-card px-8 py-10 text-[17px] leading-relaxed text-ink-primary">
        {t.success}
      </p>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={fieldClass}>
        <label htmlFor="rf-project" className={labelClass}>{t.project}</label>
        <select id="rf-project" name="project" defaultValue={preselected} required className={cn(inputClass, "appearance-none")}>
          <option value="" disabled>{t.projectPlaceholder}</option>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <fieldset className={fieldClass}>
        <legend className={labelClass}>{t.rating}</legend>
        <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "block text-[34px] leading-none transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                  n <= shown ? "text-amber-300" : "text-hair",
                )}
              >
                ★
              </span>
              <span className="sr-only">{t.starLabel.replace("{n}", String(n))}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-x-5 bp-xs:grid-cols-1">
        <div className={fieldClass}>
          <label htmlFor="rf-name" className={labelClass}>{t.name}</label>
          <input id="rf-name" name="name" type="text" autoComplete="name" required className={inputClass} />
        </div>
        <div className={fieldClass}>
          <label htmlFor="rf-role" className={labelClass}>
            {t.role}
            <span className="normal-case tracking-normal"> ({t.optional})</span>
          </label>
          <input id="rf-role" name="role" type="text" autoComplete="organization-title" placeholder={t.rolePlaceholder} className={inputClass} />
        </div>
      </div>

      <div className={fieldClass}>
        <label htmlFor="rf-text" className={labelClass}>{t.text}</label>
        <textarea
          id="rf-text"
          name="text"
          rows={6}
          dir="auto"
          placeholder={t.textPlaceholder}
          required
          className={cn(inputClass, "min-h-[140px] resize-y")}
        />
      </div>

      <label className="mb-9 flex cursor-pointer items-start gap-3 text-[14px] text-ink-secondary">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-[#C9CBCE]" />
        <span>{t.consent}</span>
      </label>

      {/* Honeypot: kept off-screen, ignored by humans, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="rf-company">Company</label>
        <input id="rf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className={buttonClass("primary")} disabled={status === "submitting"}>
        {status === "submitting" ? t.sending : t.send}
      </button>

      <p className="mt-[18px] text-[13px] tracking-[0.02em] text-ink-secondary" role="status" aria-live="polite">
        {status === "invalid" && t.error}
        {status === "error" && t.networkError}
      </p>
    </form>
  );
}
