"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/ui/ContactForm";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Contact() {
  const { dict } = useLanguage();
  const contact = dict.contact;
  const arrow = dict.dir === "rtl" ? "←" : "→";

  return (
    <Section id="contact">
      <div className="grid grid-cols-2 items-start gap-20 bp-md:grid-cols-1 bp-md:gap-[50px]">
        <div>
          <Eyebrow>{contact.eyebrow}</Eyebrow>

          <Reveal>
            <h2 className="max-w-[560px] text-[clamp(38px,6vw,74px)] leading-[1.08]">
              {contact.heading[0]}
              <br />
              {contact.heading[1]}
            </h2>
          </Reveal>

          <Reveal delay={0.04}>
            <p className="mt-6 max-w-[460px] text-[16px] text-ink-secondary">
              {contact.text}
            </p>
          </Reveal>

          <div className="mt-11 flex flex-col">
            {contact.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={`${link.label}: ${link.value}`}
                className="group flex items-center justify-between gap-4 border-t border-hair py-5 font-grotesk text-[15px] tracking-[0.02em] text-ink-secondary transition-[color,padding] duration-300 ease-smooth last:border-b last:border-hair hover:ps-2 hover:text-ink-primary"
                {...(link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span>{link.label}</span>
                <span
                  className="text-ink-muted transition-[transform,color] duration-300 ease-smooth group-hover:translate-x-1.5 group-hover:text-ink-primary rtl:group-hover:-translate-x-1.5"
                  aria-hidden="true"
                >
                  {arrow}
                </span>
              </a>
            ))}
          </div>
        </div>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
