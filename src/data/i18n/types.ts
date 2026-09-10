/**
 * Shape shared by every locale dictionary. `en` is composed from the editable
 * files in `src/data/*` (so English stays single-sourced and the README's
 * "Editing content" table still applies); `ar` is authored in full alongside it.
 */

export type Lang = "en" | "ar";

export type NavItem = { label: string; href: string };
export type Fact = { value: string; label: string };
export type ProjectLink = { label: string; href: string };

export type ProjectEntry = {
  title: string;
  tag: string;
  description: string;
  tech: string[];
  links: ProjectLink[];
  /** Optional preview image (path under `public/`). Falls back to the index number. */
  image?: string;
  /** Country the project's owner / client is based in. */
  country?: string;
};

export type ServiceEntry = { index: string; title: string; description: string };
export type ExperienceEntry = { date: string; role: string; description: string };
export type StackGroup = { title: string; items: string[] };
export type EducationEntry = {
  index: string;
  title: string;
  org: string;
  meta: string;
};
export type ContactLink = {
  label: string;
  href: string;
  value: string;
  external?: boolean;
};

export type Dictionary = {
  /** Display name used in the footer / logo copy for this locale. */
  name: string;
  dir: "ltr" | "rtl";
  /** Label on the language switch — always names the *other* language. */
  switchLabel: string;
  /** Compact glyph for the switch on small screens. */
  switchGlyph: string;
  /** Accessible name for the language switch. */
  switchAria: string;

  nav: NavItem[];
  logo: { primary: string; secondary: string };
  skipToContent: string;
  homeAria: string;
  menuOpen: string;
  menuClose: string;

  hero: {
    kicker: string;
    titleLines: string[];
    roles: string[];
    tagline: string;
    viewProjects: string;
    contactMe: string;
    scroll: string;
  };

  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    facts: Fact[];
  };

  services: {
    eyebrow: string;
    title: string;
    items: ServiceEntry[];
  };

  projects: {
    eyebrow: string;
    title: string;
    items: ProjectEntry[];
  };

  experience: {
    eyebrow: string;
    title: string;
    items: ExperienceEntry[];
  };

  techStack: {
    eyebrow: string;
    title: string;
    groups: StackGroup[];
  };

  education: {
    eyebrow: string;
    title: string;
    items: EducationEntry[];
  };

  contact: {
    eyebrow: string;
    heading: string[];
    text: string;
    links: ContactLink[];
    form: {
      name: string;
      email: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      success: string;
      /** Shown when the visitor's input fails client-side validation. */
      error: string;
      /** Shown when the request to the server fails. */
      networkError: string;
      /** `{name}` is replaced with the visitor's name. */
      subject: string;
    };
  };

  footer: {
    /** `{name}` is replaced with `Dictionary.name`. */
    builtBy: string;
  };
};
