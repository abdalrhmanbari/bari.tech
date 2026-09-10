import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="section">
      <Eyebrow>Experience</Eyebrow>
      <Reveal>
        <h2 className="section-title">A path shaped by building.</h2>
      </Reveal>

      <div className="timeline">
        {experience.map((item) => (
          <Reveal className="timeline-item" key={item.date + item.role}>
            <div className="timeline-date">{item.date}</div>
            <h3>{item.role}</h3>
            <p>{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
