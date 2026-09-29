import { site } from "@/data/site";
import { about } from "@/data/about";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { techStack } from "@/data/tech-stack";
import { faq } from "@/data/faq";
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
  switchGlyph: "عربي",
  switchAria: "Switch to Arabic",

  nav: site.nav.map((item) => ({ label: item.label, href: item.href })),
  logo: { primary: site.logo.primary, secondary: site.logo.secondary },
  skipToContent: "Skip to content",
  homeAria: `${site.name} — home`,
  navAria: "Primary",
  menuOpen: "Open menu",
  menuClose: "Close menu",

  hero: {
    kicker: site.kicker,
    titleLines: [...site.titleLines],
    roles: [...site.roles],
    tagline: site.tagline,
    viewProjects: "View Projects",
    contactMe: "Contact Me",
    getQuote: "Get a Quote",
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
    roleLabel: "Role",
    items: projects.map((project) => ({
      title: project.title,
      tag: project.tag,
      description: project.description,
      tech: [...project.tech],
      links: project.links.map((link) => ({ label: link.label, href: link.href })),
      image: project.image,
      country: project.country,
      role: project.role,
    })),
  },

  experience: {
    eyebrow: "Experience & Education",
    title: "A path shaped by building and learning.",
    items: experience.map((item) => ({
      date: item.date,
      role: item.role,
      org: item.org,
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

  faq: {
    eyebrow: "FAQ",
    title: "Answers before you ask.",
    items: faq.map((item) => ({
      index: item.index,
      question: item.question,
      answer: item.answer,
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

  quote: {
    eyebrow: "Get a Quote",
    title: "Tell me about your project.",
    intro:
      "Answer a few quick questions and I’ll send you a clear offer with the price and timeline within 5 hours at most.",
    backHome: "Back to home",
    sections: {
      project: "Your project",
      scope: "Size & features",
      timing: "Timeline & budget",
      contact: "Your details",
    },
    projectType: {
      label: "What do you need?",
      options: {
        corporate: "Company website",
        ecommerce: "Online store",
        booking: "Booking platform",
        dashboard: "Dashboard / system",
        improve: "Improve an existing website",
        other: "Something else",
      },
    },
    description: {
      label: "Describe your idea",
      placeholder: "What should the website do, who is it for, and any websites you like…",
    },
    currentUrl: { label: "Current website", placeholder: "https://" },
    pages: {
      label: "How many pages, roughly?",
      options: { "1-5": "1–5", "5-10": "5–10", "10+": "More than 10", unsure: "Not sure" },
    },
    features: {
      label: "Features you need",
      options: {
        dashboard: "Content dashboard",
        payments: "Online payments",
        booking: "Bookings",
        multilingual: "Multiple languages",
        accounts: "User accounts",
        blog: "Blog",
        integrations: "Integrations with other services",
      },
    },
    design: {
      label: "Design",
      options: { need: "I need a design", have: "I already have a design" },
    },
    timeline: {
      label: "When do you need it?",
      options: {
        urgent: "As soon as possible",
        month: "Within a month",
        quarter: "In 1–3 months",
        flexible: "I’m flexible",
      },
    },
    budget: { label: "Budget", placeholder: "e.g. $1,000" },
    name: "Your Name",
    email: "Email Address",
    whatsapp: "WhatsApp",
    country: "Country",
    optional: "optional",
    send: "Send Request",
    sending: "Sending…",
    success: "Thanks! Your request is in — I’ll send you an offer with the price and timeline within 5 hours.",
    error: "Please choose a project type, describe your idea, and enter your name and a valid email.",
    networkError: "Couldn't send your request — please try again or email me directly.",
  },

  review: {
    eyebrow: "Leave a Review",
    title: "How was working with me?",
    intro:
      "Thank you for taking a minute to share your experience. Your review helps future clients know what to expect.",
    project: "Project",
    projectPlaceholder: "Choose your project",
    rating: "Your rating",
    starLabel: "{n} out of 5 stars",
    name: "Your Name",
    role: "Your role & company",
    rolePlaceholder: "e.g. Founder, MAHAM",
    text: "Your review",
    textPlaceholder: "How was the communication, the result, and would you recommend working with me?",
    consent: "I agree to have my name, role, and review shown on this website.",
    optional: "optional",
    send: "Submit Review",
    sending: "Submitting…",
    success: "Thank you so much! Your review was received.",
    error: "Please choose your project, a rating, write your review, enter your name, and tick the consent box.",
    networkError: "Couldn't submit your review — please try again.",
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say.",
    starsLabel: "{n} out of 5 stars",
  },

  footer: {
    builtBy: "Designed & Built by {name}",
  },
};
