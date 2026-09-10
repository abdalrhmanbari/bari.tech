import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { contact } from "@/data/contact";

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="contact-grid">
        <div>
          <Eyebrow>Get In Touch</Eyebrow>

          <Reveal>
            <h2 className="contact-heading">
              {contact.heading[0]}
              <br />
              {contact.heading[1]}
            </h2>
          </Reveal>

          <Reveal delay={0.04}>
            <p className="contact-text">{contact.text}</p>
          </Reveal>

          <div className="contact-links">
            {contact.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={`${link.label}: ${link.value}`}
                {...(link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span>{link.label}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
