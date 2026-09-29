"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function ReviewPage({ initialProject }: { initialProject?: string }) {
  const { dict } = useLanguage();
  const review = dict.review;

  return (
    <Section id="review">
      <div className="mx-auto max-w-[680px]">
        <Eyebrow>{review.eyebrow}</Eyebrow>
        <Reveal>
          <h1 className="text-[clamp(36px,5.5vw,58px)] leading-[1.1]">{review.title}</h1>
        </Reveal>
        <Reveal delay={0.04}>
          <p className="mb-14 mt-6 max-w-[540px] text-[16px] text-ink-secondary">{review.intro}</p>
        </Reveal>

        <ReviewForm initialProject={initialProject} />
      </div>
    </Section>
  );
}
