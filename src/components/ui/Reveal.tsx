"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import { revealVariants, revealViewport } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

type RevealProps = Omit<ComponentPropsWithoutRef<typeof motion.div>, "custom"> & {
  /** Extra delay in seconds before this element animates in. */
  delay?: number;
};

/**
 * Scroll-triggered fade + rise, mirroring the reference site's `.reveal`
 * elements (opacity 0 -> 1, y 40 -> 0, 1s easeOutCubic, fired once near
 * the bottom of the viewport).
 *
 * When the visitor prefers reduced motion the element renders in its final
 * state with no entrance — content is never gated behind an animation.
 */
export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  const reduce = useReducedMotionSafe();

  const animationProps = reduce
    ? {}
    : {
        custom: delay,
        variants: revealVariants,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: revealViewport,
      };

  return (
    <motion.div {...animationProps} {...rest}>
      {children}
    </motion.div>
  );
}
