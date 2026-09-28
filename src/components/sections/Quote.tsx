"use client";

import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Quote() {
  const { dict } = useLanguage();
  const quote = dict.quote;
  const arrow = dict.dir === "rtl" ? "→" : "←";

  return (
    <Section id="quote">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-[13px] tracking-[0.05em] text-ink-muted transition-colors duration-300 hover:text-ink-primary"
        >
          <span aria-hidden="true">{arrow}</span>
          {quote.backHome}
        </Link>

        <Eyebrow>{quote.eyebrow}</Eyebrow>
        <Reveal>
          <h1 className="text-[clamp(38px,6vw,64px)] leading-[1.08]">{quote.title}</h1>
        </Reveal>
        <Reveal delay={0.04}>
          <p className="mb-16 mt-6 max-w-[560px] text-[16px] text-ink-secondary">{quote.intro}</p>
        </Reveal>

        <QuoteForm />
      </div>
    </Section>
  );
}
