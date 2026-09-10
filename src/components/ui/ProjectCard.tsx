"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { revealVariants, revealViewport } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import type { ProjectEntry } from "@/data/i18n/types";

export function ProjectCard({
  project,
  index,
}: {
  project: ProjectEntry;
  index: number;
}) {
  const reduce = useReducedMotionSafe();
  const tilt = useTilt<HTMLElement>(6);
  const label = String(index + 1).padStart(2, "0");

  const revealProps = reduce
    ? {}
    : {
        custom: 0,
        variants: revealVariants,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: revealViewport,
      };

  return (
    <motion.article
      ref={tilt.ref}
      data-cursor-grow
      className="group grid grid-cols-2 overflow-hidden rounded-[18px] border border-hair bg-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow duration-500 ease-smooth will-change-transform hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] bp-sm:grid-cols-1"
      {...revealProps}
      style={reduce ? undefined : tilt.style}
      onPointerMove={reduce ? undefined : tilt.onPointerMove}
      onPointerLeave={reduce ? undefined : tilt.onPointerLeave}
    >
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(160deg,#1f1f1f,#131313)]">
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 820px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(160deg,rgba(20,20,20,0.15),rgba(20,20,20,0.6))]"
            />
          </>
        ) : (
          <span
            className="font-grotesk text-[80px] leading-none text-[rgba(245,245,245,0.06)]"
            aria-hidden="true"
          >
            {label}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center px-10 py-11 [@media(max-width:480px)]:px-[26px] [@media(max-width:480px)]:py-9">
        <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <span>{project.tag}</span>
          {project.country && (
            <>
              <span aria-hidden="true" className="text-hair">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-ink-secondary">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {project.country}
              </span>
            </>
          )}
        </p>
        <h3 className="mb-2.5 text-[30px]">{project.title}</h3>
        <p className="mb-[22px] max-w-[440px] text-[15px] text-ink-secondary">
          {project.description}
        </p>

        <div className="mb-[26px] flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-hair px-3 py-[5px] font-grotesk text-[11px] tracking-[0.05em] text-ink-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-[22px]">
            {project.links.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-hair pb-[3px] text-[13px] tracking-[0.05em] text-ink-secondary transition-colors duration-300 hover:border-ink-primary hover:text-ink-primary"
                >
                  {link.label}{" "}
                  <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
                    →
                  </span>
                </a>
              ) : (
                <span
                  key={link.label}
                  className="border-b border-dashed border-hair pb-[3px] text-[13px] tracking-[0.05em] text-ink-muted"
                >
                  {link.label}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
