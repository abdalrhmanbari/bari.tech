import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { techStack } from "@/data/tech-stack";

export function TechStack() {
  return (
    <section id="techstack" className="section">
      <Eyebrow>Tech Stack</Eyebrow>
      <Reveal>
        <h2 className="section-title">Technologies I build with.</h2>
      </Reveal>

      <div className="stack-grid">
        {techStack.map((group) => (
          <Reveal className="stack-cell" key={group.title}>
            <h4>{group.title}</h4>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
