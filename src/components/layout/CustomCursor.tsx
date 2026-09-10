"use client";

import { useEffect, useRef } from "react";

/**
 * Two-part pointer treatment from the reference:
 *  - #cursor-glow: soft radial that tracks the pointer 1:1
 *  - #cursor-ring: 28px outline that eases toward the pointer (lerp 0.18)
 *    and grows to 52px over interactive elements.
 * Only mounts for fine pointers on wide viewports; otherwise the OS cursor
 * is left untouched.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 901px)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || !wide || prefersReduced) return;

    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!ring || !glow) return;

    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    place(glow, mx, my);
    place(ring, rx, ry);

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
      place(glow, mx, my);
    };

    const onOver = (event: MouseEvent) => {
      const el = (event.target as HTMLElement)?.closest(
        "a, button, input, textarea, [data-cursor-grow]",
      );
      ring.classList.toggle("is-grow", Boolean(el));
    };

    let frame = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      place(ring, rx, ry);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div id="cursor-glow" ref={glowRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
