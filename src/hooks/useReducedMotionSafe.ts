"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * SSR-safe reduced-motion flag.
 *
 * `useReducedMotion()` can read `matchMedia` synchronously on the client, which
 * makes the first client render disagree with the server render (which has no
 * `matchMedia`) — a hydration mismatch whenever the result changes what is
 * rendered. This hook reports `false` until after mount, so the server render
 * and first client render always agree; the real preference is applied on the
 * next commit.
 */
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Boolean(reduced) : false;
}
