"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";

/**
 * Pointer-follow 3D tilt for the project cards, matching the reference:
 *   rotateX = pointerY * -6deg, rotateY = pointerX * 6deg, perspective 900.
 * Springed so it settles smoothly on enter/leave. No-ops on touch input.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(maxDeg = 6) {
  const ref = useRef<T>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 150, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxDeg, -maxDeg]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxDeg, maxDeg]), spring);

  function onPointerMove(event: ReactPointerEvent<T>) {
    if (event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  const style: MotionStyle = {
    rotateX,
    rotateY,
    transformPerspective: 900,
    transformStyle: "preserve-3d",
  };

  return { ref, style, onPointerMove, onPointerLeave };
}
