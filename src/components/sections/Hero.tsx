"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { buttonClass } from "@/components/ui/Button";
import { EASE_OUT_CUBIC, EASE_OUT_QUART } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/** Page-load entrance timings lifted from the reference's GSAP timeline. */
const groupTransition = (i: number) => ({
  duration: 1,
  ease: EASE_OUT_CUBIC,
  delay: 1.1 + i * 0.12,
});

export function Hero() {
  const { dict } = useLanguage();
  const hero = dict.hero;
  const reduce = useReducedMotionSafe();

  const group = reduce ? false : { opacity: 0, y: 20 };

  return (
    <section
      id="hero"
      className="relative z-[5] mx-auto flex min-h-[100svh] max-w-section flex-col items-center justify-center px-12 pb-40 pt-header text-center bp-nav:px-6"
    >
      <div
        className="
          relative z-[2]
          flex w-full max-w-[1000px]
          flex-col items-center
          text-center
        "
      >
        {/* Kicker */}
        <div className="mb-8 overflow-hidden text-center font-grotesk text-[13px] uppercase tracking-[0.2em] text-ink-muted">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "40%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              ease: EASE_OUT_CUBIC,
              delay: 0.2,
            }}
          >
            {hero.kicker}
          </motion.span>
        </div>

        {/* Title */}
        <h1 className="w-full max-w-[900px] text-center font-grotesk text-[clamp(47px,7.5vw,76px)] font-bold leading-[1.05] tracking-[0.01em] text-ink-primary">
          {hero.titleLines.map((line, i) => (
            <span className="block overflow-hidden" key={line}>
              <motion.span
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.3,
                  ease: EASE_OUT_QUART,
                  delay: 0.35 + i * 0.12,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Roles */}
        <motion.div
          className="
            mt-[26px]
            flex flex-wrap
            items-center justify-center
            gap-2.5
            text-center
            font-grotesk
            text-[14px]
            tracking-[0.05em]
            text-ink-secondary
          "
          initial={group}
          animate={{ opacity: 1, y: 0 }}
          transition={groupTransition(0)}
        >
          {hero.roles.map((role, i) => (
            <Fragment key={role}>
              {i > 0 && <span className="text-hair">·</span>}
              <span>{role}</span>
            </Fragment>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          className="
            mt-[34px]
            w-full max-w-[620px]
            text-center
            text-[17px]
            font-light
            leading-relaxed
            text-ink-secondary
          "
          initial={group}
          animate={{ opacity: 1, y: 0 }}
          transition={groupTransition(1)}
        >
          {hero.tagline}
        </motion.p>

        {/* Actions */}
        <motion.div
          className="
            mt-[46px]
            flex flex-wrap
            items-center justify-center
            gap-[18px]
            bp-2xs:w-full bp-2xs:max-w-[320px] bp-2xs:flex-col
          "
          initial={group}
          animate={{ opacity: 1, y: 0 }}
          transition={groupTransition(2)}
        >
          <a
            href="#projects"
            className={buttonClass("primary", "bp-2xs:w-full bp-2xs:justify-center")}
          >
            {hero.viewProjects}
          </a>

          <a
            href="#contact"
            className={buttonClass("ghost", "bp-2xs:w-full bp-2xs:justify-center")}
          >
            {hero.contactMe}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="
          absolute inset-x-0 bottom-11
          flex
          flex-col items-center
          gap-2.5
          text-[11px]
          uppercase
          tracking-[0.18em]
          text-ink-muted
        "
        initial={group}
        animate={{ opacity: 1, y: 0 }}
        transition={groupTransition(3)}
      >
        <span>{hero.scroll}</span>

        <span
          className="
            relative
            h-9 w-px
            overflow-hidden
            bg-hair
            after:absolute
            after:left-0
            after:top-0
            after:h-2/5
            after:w-full
            after:animate-scroll-drop
            after:bg-ink-primary
            after:content-['']
          "
        />
      </motion.div>
    </section>
  );
}