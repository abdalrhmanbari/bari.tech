"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

type Variant = "inline" | "compact" | "block";

/**
 * Primary-nav link style, shared with the `<a>` items in the header so the
 * language switch reads as just another nav link. (Inter, not grotesk —
 * `<button>` doesn't inherit the page font, so `font-sans` is explicit.)
 */
export const HEADER_LINK_CLASS =
  "relative pb-1.5 font-sans text-[13px] uppercase tracking-[0.06em] text-ink-secondary transition-colors duration-300 ease-smooth after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-ink-primary after:transition-[width] after:duration-[350ms] after:ease-smooth after:content-[''] hover:text-ink-primary hover:after:w-full aria-[current=true]:text-ink-primary rtl:after:left-auto rtl:after:right-0";

const VARIANT: Record<Variant, string> = {
  inline: HEADER_LINK_CLASS,
  compact:
    "px-1 py-2 font-grotesk text-[12px] uppercase tracking-[0.08em] text-ink-secondary transition-colors duration-300 ease-smooth hover:text-ink-primary",
  block:
    "font-grotesk text-[12px] uppercase tracking-[0.14em] text-ink-muted transition-colors duration-300 ease-smooth hover:text-ink-primary",
};

/**
 * Toggles the whole page between English and Arabic. The label always names
 * the language you'd switch *to*, so it carries that language's `lang`
 * attribute for correct shaping.
 */
export function LanguageSwitch({
  variant = "inline",
  onSwitch,
}: {
  variant?: Variant;
  onSwitch?: () => void;
}) {
  const { dict, lang, toggle } = useLanguage();

  return (
    <button
      type="button"
      className={VARIANT[variant]}
      lang={lang === "ar" ? "en" : "ar"}
      aria-label={dict.switchAria}
      onClick={() => {
        toggle();
        onSwitch?.();
      }}
    >
      {variant === "compact" ? dict.switchGlyph : dict.switchLabel}
    </button>
  );
}
