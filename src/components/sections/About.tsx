import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/data/about";

export function About() {
  return (
    <section id="about" className="section">
      <div className="about-grid">
        <div>
          <Eyebrow>About</Eyebrow>
          <Reveal>
            <h2 className="about-heading">{about.heading}</h2>
          </Reveal>
        </div>

        <div className="about-text">
          {about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p>{paragraph}</p>
            </Reveal>
          ))}

          <div className="about-facts">
            {about.facts.map((fact) => (
              <Reveal key={fact.label}>
                <div className="fact-num num">{fact.value}</div>
                <div className="fact-label">{fact.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
