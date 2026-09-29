"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { PublicReview } from "@/lib/reviews/schema";

/** Approved client reviews. Renders nothing until at least one is approved. */
export function Testimonials({ reviews }: { reviews: PublicReview[] }) {
  const { dict } = useLanguage();
  const t = dict.testimonials;
  if (reviews.length === 0) return null;

  return (
    <Section id="testimonials">
      <Eyebrow>{t.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="max-w-[640px] text-[clamp(34px,4.5vw,54px)]">{t.title}</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-5 bp-md:grid-cols-1">
        {reviews.map((r) => (
          <Reveal
            key={r.id}
            className="flex flex-col rounded-2xl border border-hair bg-card px-[30px] py-[32px]"
          >
            <p
              className="mb-5 text-[18px] leading-none tracking-[0.12em] text-amber-300"
              role="img"
              aria-label={t.starsLabel.replace("{n}", String(r.rating))}
            >
              {"★".repeat(r.rating)}
              <span className="text-hair">{"★".repeat(5 - r.rating)}</span>
            </p>
            <blockquote dir="auto" className="mb-7 flex-1 text-[16px] leading-relaxed text-ink-primary">
              “{r.text}”
            </blockquote>
            <footer className="border-t border-hair pt-5">
              <p className="text-[15px] text-ink-primary">{r.name}</p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {r.role ? `${r.role} · ` : ""}
                {r.project}
              </p>
            </footer>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
