"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Projects() {
  const { dict } = useLanguage();

  return (
    <Section id="projects">
      <Eyebrow>{dict.projects.eyebrow}</Eyebrow>
      <Reveal>
        <h2 className="max-w-[640px] text-[clamp(34px,4.5vw,54px)]">
          {dict.projects.title}
        </h2>
      </Reveal>

      <div className="mt-10 flex flex-col gap-[26px]">
        {dict.projects.items.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
