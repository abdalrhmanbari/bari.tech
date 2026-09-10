"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function About() {
  const { dict } = useLanguage();
  const about = dict.about;

  return (
    <Section id="about">
      <div className="grid grid-cols-[0.9fr_1.1fr] items-start gap-20 bp-md:grid-cols-1 bp-md:gap-10">
        <div>
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <Reveal>
            <h2 className="text-[clamp(34px,4.5vw,54px)] leading-[1.15]">
              {about.heading}
            </h2>
          </Reveal>
        </div>

        <div>
          {about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="mb-5 max-w-[560px] text-[16px] text-ink-secondary">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <div className="mt-11 grid grid-cols-2 gap-x-10 gap-y-7">
            {about.facts.map((fact) => (
              <Reveal key={fact.label}>
                <div className="font-grotesk text-[34px] text-ink-primary">
                  {fact.value}
                </div>
                <div className="mt-1.5 text-[12px] uppercase tracking-[0.1em] text-ink-muted">
                  {fact.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
