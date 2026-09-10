"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";

const HEADER_OFFSET = 72;

/**
 * Momentum scrolling via Lenis (lerp 0.09, matching the reference), plus
 * smooth in-page anchor navigation for every `#` link. Disabled entirely
 * when the visitor prefers reduced motion — native scrolling + the
 * `scroll-margin-top` on sections take over. `MotionConfig` makes every
 * Framer Motion animation honour the same preference.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      const onClick = (event: MouseEvent) => {
        const link = (event.target as HTMLElement)?.closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        if (!link) return;
        const id = link.getAttribute("href")!.slice(1);
        const target = id ? document.getElementById(id) : null;
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView();
        history.pushState(null, "", `#${id}`);
      };
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -HEADER_OFFSET, duration: 1.1 });
      history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
