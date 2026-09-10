import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="section">
      <Eyebrow>Selected Work</Eyebrow>
      <Reveal>
        <h2 className="section-title">
          Projects I&apos;ve built and continue to refine.
        </h2>
      </Reveal>

      <div className="mt-10 flex flex-col gap-[26px]">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
