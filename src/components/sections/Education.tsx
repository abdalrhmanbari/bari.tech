import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { education } from "@/data/education";

export function Education() {
  return (
    <section id="education" className="section">
      <Eyebrow>Education</Eyebrow>
      <Reveal>
        <h2 className="section-title">Building knowledge through study.</h2>
      </Reveal>

      <div className="cert-row">
        {education.map((item) => (
          <Reveal className="cert-card" key={item.index}>
            <span className="num">{item.index}</span>
            <h4>{item.title}</h4>
            <p>{item.org}</p>
            <small>{item.meta}</small>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
