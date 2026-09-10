"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { EASE_OUT_CUBIC, EASE_OUT_QUART } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/** Page-load entrance timings lifted from the reference's GSAP timeline. */
const groupTransition = (i: number) => ({
  duration: 1,
  ease: EASE_OUT_CUBIC,
  delay: 1.1 + i * 0.12,
});

export function Hero() {
  const reduce = useReducedMotionSafe();
  // `initial={false}` makes Framer render straight at the target — no entrance.
  const group = reduce ? false : { opacity: 0, y: 20 };

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <div className="hero-kicker">
          <motion.span
            className="line-inner"
            initial={reduce ? false : { y: "40%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: EASE_OUT_CUBIC, delay: 0.2 }}
          >
            {site.kicker}
          </motion.span>
        </div>

        <h1 className="hero-title">
          {site.titleLines.map((line, i) => (
            <span className="line" key={line}>
              <motion.span
                className="line-inner"
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

        <motion.div
          className="hero-roles"
          initial={group}
          animate={{ opacity: 1, y: 0 }}
          transition={groupTransition(0)}
        >
          {site.roles.map((role, i) => (
            <Fragment key={role}>
              {i > 0 && <span className="dot">·</span>}
              <span>{role}</span>
            </Fragment>
          ))}
        </motion.div>

        <motion.p
          className="hero-sub"
          initial={group}
          animate={{ opacity: 1, y: 0 }}
          transition={groupTransition(1)}
        >
          {site.tagline}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={group}
          animate={{ opacity: 1, y: 0 }}
          transition={groupTransition(2)}
        >
          <a href="#projects" className="btn btn-primary">
            View Projects
          </a>

          <a href="#contact" className="btn btn-ghost">
            Contact Me
          </a>
        </motion.div>
      </div>

      <div className="hero-portrait" aria-hidden="true">
        <div className="hero-portrait-frame">
          <Image
            src="/portrait.svg"
            alt=""
            width={600}
            height={680}
            priority
            sizes="(max-width: 980px) 80vw, 49vw"
          />
        </div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={group}
        animate={{ opacity: 1, y: 0 }}
        transition={groupTransition(3)}
      >
        <span>Scroll</span>
        <span className="scroll-line" />
      </motion.div>
    </section>
  );
}
