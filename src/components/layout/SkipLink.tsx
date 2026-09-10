"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

/** Keyboard skip link — localised copy, same target as before. */
export function SkipLink() {
  const { dict } = useLanguage();
  return (
    <a
      href="#about"
      className="fixed left-3 top-0 z-[200] -translate-y-[140%] rounded-b-lg border border-hair bg-surface px-[18px] py-2.5 font-grotesk text-[12px] uppercase tracking-[0.1em] text-ink-primary transition-transform duration-[250ms] ease-smooth focus-visible:translate-y-0"
    >
      {dict.skipToContent}
    </a>
  );
}
