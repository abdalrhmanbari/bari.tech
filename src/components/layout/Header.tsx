"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  LanguageSwitch,
  HEADER_LINK_CLASS,
} from "@/components/ui/LanguageSwitch";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";

const metaLink =
  "text-[12px] tracking-[0.14em] text-ink-muted transition-colors duration-300 ease-smooth hover:text-ink-primary";

export function Header() {
  const { dict } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  // Plain `overflow: hidden` on body doesn't stop touch-scrolling on iOS
  // Safari, so we also pin the body in place and restore the scroll
  // position on close.
  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] flex h-header items-center justify-between border-b border-transparent bg-transparent px-12 transition-[background,border-color,backdrop-filter] duration-[400ms] ease-smooth bp-nav:px-6",
        scrolled &&
          "border-b-hair bg-[rgba(21,21,21,0.72)] backdrop-blur-[16px] backdrop-saturate-[1.2]",
      )}
    >
      <a
        href="#hero"
        className="relative z-[95] font-grotesk text-[15px] uppercase tracking-[0.14em]"
        aria-label={dict.homeAria}
      >
        {dict.logo.primary}{" "}
        <span className="opacity-50 bp-nav:text-[12px]">{dict.logo.secondary}</span>
      </a>

      <nav className="bp-nav:hidden" aria-label={dict.navAria}>
        <ul className="flex list-none items-center gap-10">
          {dict.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={HEADER_LINK_CLASS}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <LanguageSwitch />
          </li>
        </ul>
      </nav>

      <div className="hidden items-center gap-1.5 bp-nav:flex">
        <LanguageSwitch variant="compact" />
        <button
          type="button"
          className="relative z-[95] -me-2 inline-flex h-10 w-10 items-center justify-center text-ink-primary"
          aria-label={menuOpen ? dict.menuClose : dict.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            className="fixed inset-0 z-[90] flex flex-col bg-[rgba(17,17,17,0.92)] px-12 pb-12 pt-[104px] backdrop-blur-[20px] backdrop-saturate-[1.2] bp-nav:px-6"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <motion.ul
              className="flex list-none flex-col"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
            >
              {dict.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  className="last:[&_a]:border-b last:[&_a]:border-hair"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: EASE_SMOOTH },
                    },
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline justify-between gap-4 border-t border-hair py-[22px] font-grotesk text-[26px] tracking-[0.02em] text-ink-primary"
                  >
                    <span>{item.label}</span>
                    <span className="text-[12px] tracking-[0.1em] text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-3 pt-8 font-grotesk uppercase tracking-[0.14em] text-ink-muted">
              {dict.contact.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={metaLink}
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
              <LanguageSwitch
                variant="block"
                onSwitch={() => setMenuOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
