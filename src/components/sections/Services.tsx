"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Services() {
  const { dict } = useLanguage();
  const services = dict.services;

  return (
    <Section id="services">
      <Eyebrow>{services.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="max-w-[640px] text-[clamp(34px,4.5vw,54px)]">
          {services.title}
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-5 bp-md:grid-cols-1">
        {services.items.map((item) => (
          <Reveal
            data-cursor-grow
            className="rounded-2xl border border-hair bg-card px-[26px] py-[30px] transition-[transform,border-color] duration-[400ms] ease-smooth hover:-translate-y-1 hover:border-accent-dim"
            key={item.index}
          >
            <span className="mb-[18px] flex items-center gap-3 font-grotesk text-[13px] tracking-[0.06em] text-ink-muted">
              {item.index}
              <span
                aria-hidden="true"
                className="inline-block h-px w-6 shrink-0 bg-hair"
              />
            </span>
            <h3 className="mb-2.5 text-[19px] font-medium">{item.title}</h3>
            <p className="text-[14px] leading-relaxed text-ink-secondary">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
