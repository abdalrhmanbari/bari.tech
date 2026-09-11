"use client";

import { Plus } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Faq() {
  const { dict } = useLanguage();
  const faq = dict.faq;

  return (
    <Section id="faq">
      <Eyebrow>{faq.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="max-w-[640px] text-[clamp(34px,4.5vw,54px)]">
          {faq.title}
        </h2>
      </Reveal>

      <div className="mt-[50px] border-t border-hair">
        {faq.items.map((item) => (
          <Reveal key={item.index}>
            <details className="group border-b border-hair">
              <summary
                data-cursor-grow
                className="flex cursor-pointer list-none items-start gap-5 py-6 [&::-webkit-details-marker]:hidden"
              >
                <span className="mt-1 shrink-0 font-grotesk text-[12px] tracking-[0.06em] text-ink-muted">
                  {item.index}
                </span>
                <h3 className="flex-1 text-[18px] font-medium text-ink-primary">
                  {item.question}
                </h3>
                <Plus
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink-muted transition-transform duration-300 ease-smooth group-open:rotate-45"
                />
              </summary>
              <p className="pb-7 text-[15px] leading-relaxed text-ink-secondary bp-md:text-[14px]">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
