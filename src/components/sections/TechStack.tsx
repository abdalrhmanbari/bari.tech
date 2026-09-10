"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function TechStack() {
  const { dict } = useLanguage();

  return (
    <Section id="techstack">
      <Eyebrow>{dict.techStack.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="max-w-[640px] text-[clamp(34px,4.5vw,54px)]">
          {dict.techStack.title}
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-[18px] border border-hair bg-hair bp-xs:grid-cols-2 [@media(max-width:460px)]:grid-cols-1">
        {dict.techStack.groups.map((group) => (
          <Reveal className="bg-card px-7 py-9" key={group.title}>
            <h4 className="mb-[18px] font-grotesk text-[12px] uppercase tracking-[0.14em] text-ink-muted">
              {group.title}
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[14px] text-ink-secondary before:h-[5px] before:w-[5px] before:shrink-0 before:rounded-full before:bg-accent-dim before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
