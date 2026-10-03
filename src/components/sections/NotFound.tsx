"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { buttonClass } from "@/components/ui/Button";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { track } from "@/lib/visits/track";

export function NotFound() {
  const { dict } = useLanguage();
  const t = dict.notFound;
  const pathname = usePathname();

  // Lets the stats dashboard list broken links people actually land on.
  useEffect(() => {
    track(`not_found:${pathname}`);
  }, [pathname]);

  return (
    <Section id="not-found">
      <div className="mx-auto flex min-h-[50svh] max-w-[680px] flex-col justify-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 className="text-[clamp(36px,5.5vw,58px)] leading-[1.1]">{t.title}</h1>
        <p className="mb-10 mt-6 max-w-[540px] text-[16px] text-ink-secondary">{t.text}</p>
        <Link href="/" className={buttonClass("primary", "self-start")}>
          {t.home}
        </Link>
      </div>
    </Section>
  );
}
