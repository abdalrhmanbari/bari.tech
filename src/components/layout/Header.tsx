"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className={cn("site-header", scrolled && "scrolled")}>
      <a href="#hero" className="header-logo" aria-label={`${site.name} — home`}>
        {site.logo.primary}{" "}
        <span style={{ opacity: 0.5 }}>{site.logo.secondary}</span>
      </a>

      <nav className="header-nav" aria-label="Primary">
        <ul>
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
            >
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: EASE_SMOOTH },
                    },
                  }}
                >
                  <a href={item.href} onClick={() => setMenuOpen(false)}>
                    <span>{item.label}</span>
                    <span className="index">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mobile-nav-meta">
              <a href={site.socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${site.email}`}>Email</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
