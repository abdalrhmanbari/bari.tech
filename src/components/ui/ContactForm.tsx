"use client";

import { useState } from "react";
import { CONTACT_ENDPOINT } from "@/data/site";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "invalid" | "error";

const fieldClass = "mb-[22px]";
const labelClass =
  "mb-2.5 block text-[12px] uppercase tracking-[0.1em] text-ink-muted";
const inputClass =
  "w-full rounded-[10px] border border-hair bg-surface px-4 py-3.5 text-[14px] text-ink-primary transition-colors duration-300 placeholder:text-ink-muted focus:border-accent-dim focus:outline-none";

export function ContactForm() {
  const { dict } = useLanguage();
  const t = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const company = String(data.get("company") ?? "").trim(); // honeypot

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !message || !emailOk) {
      setStatus("invalid");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, company }),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={fieldClass}>
        <label htmlFor="cf-name" className={labelClass}>
          {t.name}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="cf-email" className={labelClass}>
          {t.email}
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <div className={fieldClass}>
        <label htmlFor="cf-message" className={labelClass}>
          {t.message}
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={6}
          placeholder={t.messagePlaceholder}
          required
          className={cn(inputClass, "min-h-[110px] resize-y")}
        />
      </div>

      {/* Honeypot: kept off-screen, ignored by humans, filled by bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
      >
        <label htmlFor="cf-company">Company</label>
        <input
          id="cf-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className={buttonClass("primary")}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? t.sending : t.send}
      </button>

      <p
        className="mt-[18px] text-[13px] tracking-[0.02em] text-ink-secondary"
        role="status"
        aria-live="polite"
      >
        {status === "success" && t.success}
        {status === "invalid" && t.error}
        {status === "error" && t.networkError}
      </p>
    </form>
  );
}
