"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Experience() {
  const { dict } = useLanguage();

  return (
    <Section id="experience">
      <Eyebrow>{dict.experience.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="max-w-[640px] text-[clamp(34px,4.5vw,54px)]">
          {dict.experience.title}
        </h2>
      </Reveal>

      <div className="relative mt-[50px] border-s border-hair ps-9">
        {dict.experience.items.map((item) => (
          <Reveal
            className="relative pb-14 last:pb-0 before:absolute before:-start-[41px] before:top-1 before:h-[9px] before:w-[9px] before:rounded-full before:border before:border-accent-dim before:bg-bg-primary before:content-['']"
            key={item.date + item.role}
          >
            <div className="mb-2 font-grotesk text-[12px] uppercase tracking-[0.1em] text-ink-muted">
              {item.date}
            </div>
            <h3 className="mb-2 text-[22px]">{item.role}</h3>
            <p className="max-w-[560px] text-[15px] text-ink-secondary">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
