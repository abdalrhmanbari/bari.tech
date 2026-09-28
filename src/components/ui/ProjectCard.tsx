"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { revealVariants, revealViewport } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { ProjectEntry } from "@/data/i18n/types";

export function ProjectCard({
  project,
  index,
}: {
  project: ProjectEntry;
  index: number;
}) {
  const { dict } = useLanguage();
  const reduce = useReducedMotionSafe();
  const tilt = useTilt<HTMLElement>(6);
  const label = String(index + 1).padStart(2, "0");
  const [videoReady, setVideoReady] = useState(false);
  // Media box follows the file's own aspect ratio so it shows whole, uncropped.
  const [ratio, setRatio] = useState(16 / 9);
  const cover = project.video
    ? project.poster || project.image
    : project.image || project.poster;

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
      className="group grid grid-cols-[1.45fr_1fr] overflow-hidden rounded-[18px] border border-hair bg-card shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow duration-500 ease-smooth will-change-transform hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] bp-xl:grid-cols-1"
      {...revealProps}
      style={reduce ? undefined : tilt.style}
      onPointerMove={reduce ? undefined : tilt.onPointerMove}
      onPointerLeave={reduce ? undefined : tilt.onPointerLeave}
    >
      <div className={`relative flex ${cover || project.video ? "" : "min-h-[280px]"} items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(160deg,#1f1f1f,#131313)]`}>
        {cover || project.video ? (
          <>
            {cover && (
              <>
                {/* Blurred fill for any space the text column adds beyond the media's height. */}
                <Image
                  src={cover}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 1150px) 100vw, 60vw"
                  className="scale-110 object-cover opacity-40 blur-2xl"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(20,20,20,0.15),rgba(20,20,20,0.6))]"
                />
              </>
            )}
            {/* Sized to the file's own aspect ratio, so the whole frame shows uncropped. */}
            <div style={{ aspectRatio: ratio }} className="relative w-full">
              {cover && (
                <Image
                  src={cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1150px) 100vw, 60vw"
                  className="object-contain"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (!project.video && img.naturalHeight) {
                      setRatio(img.naturalWidth / img.naturalHeight);
                    }
                  }}
                />
              )}
              {project.video && (
                <video
                  ref={(v) => {
                    // Metadata may load before hydration, when onLoadedMetadata isn't attached yet.
                    if (v && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
                  }}
                  src={project.video}
                  poster={cover}
                  aria-label={project.title}
                  muted
                  loop
                  playsInline
                  autoPlay={!reduce}
                  controls={reduce}
                  preload={reduce ? "none" : "auto"}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
                  }}
                  onCanPlay={() => setVideoReady(true)}
                  className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-smooth ${
                    videoReady || reduce ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </div>
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

      <div className="flex flex-col justify-center px-9 py-7 [@media(max-width:480px)]:px-[26px] [@media(max-width:480px)]:py-9">
        <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          <span>{project.tag}</span>
          {project.country && (
            <>
              <span aria-hidden="true" className="text-hair bp-sm:hidden">
                ·
              </span>
              <span className="inline-flex items-center gap-1 text-ink-secondary bp-sm:w-full">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {project.country}
              </span>
            </>
          )}
        </p>
        <h3 className="mb-2.5 text-[30px]">{project.title}</h3>
        {project.role && (
          <p className="mb-3 text-[13px] tracking-[0.05em] text-ink-primary">
            <span className="text-ink-muted">{dict.projects.roleLabel}:</span>{" "}
            {project.role}
          </p>
        )}
        <p className="mb-5 max-w-[440px] text-[14px] text-ink-secondary">
          {project.description}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
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
