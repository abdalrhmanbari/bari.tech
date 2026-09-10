import type { Variants } from "framer-motion";

/**
 * Easing curves mapped from the reference site's GSAP eases so timing/feel
 * carry over one-to-one.
 *   power3.out  -> easeOutCubic
 *   power4.out  -> easeOutQuart
 *   --ease      -> the site's shared cubic-bezier for CSS transitions
 */
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
export const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;
export const EASE_SMOOTH = [0.16, 0.84, 0.32, 1] as const;

/**
 * `.reveal` in the reference: opacity 0 -> 1, y 40 -> 0, 1s power3.out.
 * `custom` is an optional extra delay in seconds.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_OUT_CUBIC, delay },
  }),
};

/** Shared viewport config approximating ScrollTrigger `start: "top 88%"`. */
export const revealViewport = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -12% 0px",
} as const;

/** Container that reveals its children on a small stagger. */
export const revealStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
