"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { track } from "@/lib/visits/track";
import {
  QUOTE_DESIGN,
  QUOTE_FEATURES,
  QUOTE_PAGES,
  QUOTE_PROJECT_TYPES,
  QUOTE_TIMELINES,
} from "@/data/i18n/types";

type Status = "idle" | "submitting" | "success" | "invalid" | "error";

const labelClass = "mb-3 block text-[12px] uppercase tracking-[0.1em] text-ink-muted";
const inputClass =
  "w-full rounded-[10px] border border-hair bg-surface px-4 py-3.5 text-[14px] text-ink-primary transition-colors duration-300 placeholder:text-ink-muted focus:border-accent-dim focus:outline-none";
const legendClass = "mb-6 font-grotesk text-[13px] uppercase tracking-[0.14em] text-ink-secondary";

/** A radio or checkbox rendered as a selectable pill. */
function Choice({
  type,
  name,
  value,
  label,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
}) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="inline-block rounded-full border border-hair px-4 py-2.5 text-[13px] text-ink-secondary transition-colors duration-300 hover:border-accent-dim hover:text-ink-primary peer-checked:border-ink-primary peer-checked:bg-ink-primary peer-checked:text-[#141414] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {label}
      </span>
    </label>
  );
}

function ChoiceGroup({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-8">
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </fieldset>
  );
}

function OptionalTag({ text }: { text: string }) {
  return <span className="normal-case tracking-normal text-ink-muted"> ({text})</span>;
}

export function QuoteForm() {
  const { dict, lang } = useLanguage();
  const t = dict.quote;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const payload = {
      projectType: get("projectType"),
      description: get("description"),
      currentUrl: get("currentUrl"),
      pages: get("pages"),
      features: data.getAll("features").map(String),
      design: get("design"),
      timeline: get("timeline"),
      budget: get("budget"),
      name: get("name"),
      email: get("email"),
      whatsapp: get("whatsapp"),
      country: get("country"),
      company: get("company"), // honeypot
      lang,
    };

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!payload.projectType || !payload.description || !payload.name || !emailOk) {
      track("form_error:quote");
      setStatus("invalid");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        console.error("Quote form failed:", res.status, detail);
        track("form_error:quote");
        setStatus(res.status === 422 ? "invalid" : "error");
        return;
      }
      form.reset();
      track("form_submit:quote");
      setStatus("success");
    } catch (err) {
      console.error("Quote form network error:", err);
      track("form_error:quote");
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

  return (
    <form onSubmit={handleSubmit} noValidate data-track-form="quote">
      <div className="mb-12">
        <p className={legendClass}>01 · {t.sections.project}</p>
        <ChoiceGroup legend={t.projectType.label}>
          {QUOTE_PROJECT_TYPES.map((key) => (
            <Choice key={key} type="radio" name="projectType" value={key} label={t.projectType.options[key]} />
          ))}
        </ChoiceGroup>
        <div className="mb-8">
          <label htmlFor="qf-description" className={labelClass}>
            {t.description.label}
          </label>
          <textarea
            id="qf-description"
            name="description"
            rows={5}
            placeholder={t.description.placeholder}
            required
            className={cn(inputClass, "min-h-[120px] resize-y")}
          />
        </div>
        <div>
          <label htmlFor="qf-url" className={labelClass}>
            {t.currentUrl.label}
            <OptionalTag text={t.optional} />
          </label>
          <input
            id="qf-url"
            name="currentUrl"
            type="url"
            dir="ltr"
            placeholder={t.currentUrl.placeholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mb-12 border-t border-hair pt-12">
        <p className={legendClass}>02 · {t.sections.scope}</p>
        <ChoiceGroup legend={t.pages.label}>
          {QUOTE_PAGES.map((key) => (
            <Choice key={key} type="radio" name="pages" value={key} label={t.pages.options[key]} />
          ))}
        </ChoiceGroup>
        <ChoiceGroup legend={t.features.label}>
          {QUOTE_FEATURES.map((key) => (
            <Choice key={key} type="checkbox" name="features" value={key} label={t.features.options[key]} />
          ))}
        </ChoiceGroup>
        <ChoiceGroup legend={t.design.label}>
          {QUOTE_DESIGN.map((key) => (
            <Choice key={key} type="radio" name="design" value={key} label={t.design.options[key]} />
          ))}
        </ChoiceGroup>
      </div>

      <div className="mb-12 border-t border-hair pt-12">
        <p className={legendClass}>03 · {t.sections.timing}</p>
        <ChoiceGroup legend={t.timeline.label}>
          {QUOTE_TIMELINES.map((key) => (
            <Choice key={key} type="radio" name="timeline" value={key} label={t.timeline.options[key]} />
          ))}
        </ChoiceGroup>
        <div>
          <label htmlFor="qf-budget" className={labelClass}>
            {t.budget.label}
            <OptionalTag text={t.optional} />
          </label>
          <input id="qf-budget" name="budget" type="text" placeholder={t.budget.placeholder} className={inputClass} />
        </div>
      </div>

      <div className="mb-10 border-t border-hair pt-12">
        <p className={legendClass}>04 · {t.sections.contact}</p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 bp-xs:grid-cols-1">
          <div>
            <label htmlFor="qf-name" className={labelClass}>{t.name}</label>
            <input id="qf-name" name="name" type="text" autoComplete="name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="qf-email" className={labelClass}>{t.email}</label>
            <input id="qf-email" name="email" type="email" dir="ltr" autoComplete="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="qf-whatsapp" className={labelClass}>
              {t.whatsapp}
              <OptionalTag text={t.optional} />
            </label>
            <input id="qf-whatsapp" name="whatsapp" type="tel" dir="ltr" autoComplete="tel" className={inputClass} />
          </div>
          <div>
            <label htmlFor="qf-country" className={labelClass}>
              {t.country}
              <OptionalTag text={t.optional} />
            </label>
            <input id="qf-country" name="country" type="text" autoComplete="country-name" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Honeypot: kept off-screen, ignored by humans, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="qf-company">Company</label>
        <input id="qf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
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
