"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { revealVariants, revealViewport } from "@/lib/motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
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
      className="project-card"
      {...revealProps}
      style={reduce ? undefined : tilt.style}
      onPointerMove={reduce ? undefined : tilt.onPointerMove}
      onPointerLeave={reduce ? undefined : tilt.onPointerLeave}
    >
      <div className="project-media">
        <span className="project-index" aria-hidden="true">
          {label}
        </span>
      </div>

      <div className="project-body">
        <p className="project-tag">{project.tag}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="tech-tags">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div className="project-links">
            {project.links.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} <span aria-hidden="true">→</span>
                </a>
              ) : (
                <span key={link.label} className="project-link-pending">
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
