"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Footer() {
  const { dict } = useLanguage();
  return (
    <footer className="relative z-[5] flex items-center justify-between border-t border-hair px-12 py-12 font-grotesk text-[12px] tracking-[0.06em] text-ink-muted bp-2xs:flex-col bp-2xs:gap-3.5 bp-2xs:px-6 bp-2xs:py-9 bp-2xs:text-center">
      <div>{dict.footer.builtBy.replace("{name}", dict.name)}</div>
      <div>© {new Date().getFullYear()}</div>
    </footer>
  );
}
