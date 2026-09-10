import { site } from "@/data/site";
import { about } from "@/data/about";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { techStack } from "@/data/tech-stack";
import { education } from "@/data/education";
import { contact } from "@/data/contact";
import type { Dictionary } from "./types";

/**
 * English dictionary — composed from the editable content files so English
 * copy stays single-sourced. Only the strings that used to be hardcoded in
 * components (eyebrows, section titles, button + form labels, footer) are
 * spelled out here.
 */
export const en: Dictionary = {
  name: site.name,
  dir: "ltr",
  switchLabel: "العربية",
  switchGlyph: "ع",
  switchAria: "Switch to Arabic",

  nav: site.nav.map((item) => ({ label: item.label, href: item.href })),
  logo: { primary: site.logo.primary, secondary: site.logo.secondary },
  skipToContent: "Skip to content",
  homeAria: `${site.name} — home`,
  menuOpen: "Open menu",
  menuClose: "Close menu",

  hero: {
    kicker: site.kicker,
    titleLines: [...site.titleLines],
    roles: [...site.roles],
    tagline: site.tagline,
    viewProjects: "View Projects",
    contactMe: "Contact Me",
    scroll: "Scroll",
  },

  about: {
    eyebrow: "About",
    heading: about.heading,
    paragraphs: [...about.paragraphs],
    facts: about.facts.map((fact) => ({ value: fact.value, label: fact.label })),
  },

  services: {
    eyebrow: "Services",
    title: "What I can help you build.",
    items: services.map((item) => ({
      index: item.index,
      title: item.title,
      description: item.description,
    })),
  },

  projects: {
    eyebrow: "Selected Work",
    title: "Projects I’ve built, from goals to launch.",
    items: projects.map((project) => ({
      title: project.title,
      tag: project.tag,
      description: project.description,
      tech: [...project.tech],
      links: project.links.map((link) => ({ label: link.label, href: link.href })),
      image: project.image,
      country: project.country,
    })),
  },

  experience: {
    eyebrow: "Experience",
    title: "A path shaped by building.",
    items: experience.map((item) => ({
      date: item.date,
      role: item.role,
      description: item.description,
    })),
  },

  techStack: {
    eyebrow: "Tech Stack",
    title: "Technologies I build with.",
    groups: techStack.map((group) => ({
      title: group.title,
      items: [...group.items],
    })),
  },

  education: {
    eyebrow: "Education",
    title: "Building knowledge through study.",
    items: education.map((item) => ({
      index: item.index,
      title: item.title,
      org: item.org,
      meta: item.meta,
    })),
  },

  contact: {
    eyebrow: "Get In Touch",
    heading: [...contact.heading],
    text: contact.text,
    links: contact.links.map((link) => ({
      label: link.label,
      href: link.href,
      value: link.value,
      external: link.external,
    })),
    form: {
      name: "Your Name",
      email: "Email Address",
      message: "Project Details",
      messagePlaceholder: "Tell me about your project...",
      send: "Send Message",
      sending: "Sending…",
      success: "Thanks — your message is on its way.",
      error: "Please fill in every field with a valid email address.",
      networkError:
        "Couldn't send your message — please try again or email me directly.",
      subject: "Portfolio enquiry from {name}",
    },
  },

  footer: {
    builtBy: "Designed & Built by {name}",
  },
};
