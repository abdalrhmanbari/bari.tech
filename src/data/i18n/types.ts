/**
 * Shape shared by every locale dictionary. `en` is composed from the editable
 * files in `src/data/*` (so English stays single-sourced and the README's
 * "Editing content" table still applies); `ar` is authored in full alongside it.
 */

export type Lang = "en" | "ar";

export type NavItem = { label: string; href: string };

/** Option keys for the quote form. The API validates against these same lists. */
export const QUOTE_PROJECT_TYPES = ["corporate", "ecommerce", "booking", "dashboard", "improve", "other"] as const;
export const QUOTE_PAGES = ["1-5", "5-10", "10+", "unsure"] as const;
export const QUOTE_FEATURES = ["dashboard", "payments", "booking", "multilingual", "accounts", "blog", "integrations"] as const;
export const QUOTE_DESIGN = ["need", "have"] as const;
export const QUOTE_TIMELINES = ["urgent", "month", "quarter", "flexible"] as const;
export type QuoteProjectType = (typeof QUOTE_PROJECT_TYPES)[number];
export type QuotePages = (typeof QUOTE_PAGES)[number];
export type QuoteFeature = (typeof QUOTE_FEATURES)[number];
export type QuoteDesign = (typeof QUOTE_DESIGN)[number];
export type QuoteTimeline = (typeof QUOTE_TIMELINES)[number];

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
  /** Optional preview video (URL). Plays in place of the image once loaded. */
  video?: string;
  /** Image shown while the video loads. Falls back to `image`. */
  poster?: string;
  /** Country the project's owner / client is based in. */
  country?: string;
  /** What I did on the project (e.g. "Full-Stack Development"). Shown under the title. */
  role?: string;
};

export type ServiceEntry = { index: string; title: string; description: string };
export type ExperienceEntry = {
  date: string;
  role: string;
  /** Optional secondary line (e.g. institution) shown between the role and description. */
  org?: string;
  description: string;
};
export type StackGroup = { title: string; items: string[] };
export type FaqEntry = { index: string; question: string; answer: string };
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
  navAria: string;
  menuOpen: string;
  menuClose: string;

  hero: {
    kicker: string;
    titleLines: string[];
    roles: string[];
    tagline: string;
    viewProjects: string;
    contactMe: string;
    getQuote: string;
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
    /** Prefix shown before each project's role, e.g. "Role". */
    roleLabel: string;
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

  faq: {
    eyebrow: string;
    title: string;
    items: FaqEntry[];
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

  /** The /quote page: a project brief the visitor fills in to get a price and timeline. */
  quote: {
    eyebrow: string;
    title: string;
    intro: string;
    backHome: string;
    sections: { project: string; scope: string; timing: string; contact: string };
    projectType: { label: string; options: Record<QuoteProjectType, string> };
    description: { label: string; placeholder: string };
    currentUrl: { label: string; placeholder: string };
    pages: { label: string; options: Record<QuotePages, string> };
    features: { label: string; options: Record<QuoteFeature, string> };
    design: { label: string; options: Record<QuoteDesign, string> };
    timeline: { label: string; options: Record<QuoteTimeline, string> };
    budget: { label: string; placeholder: string };
    name: string;
    email: string;
    whatsapp: string;
    country: string;
    optional: string;
    send: string;
    sending: string;
    success: string;
    /** Shown when required fields are missing or the email is invalid. */
    error: string;
    networkError: string;
  };

  /** The private /review page clients use to leave a review (not linked from the site). */
  review: {
    eyebrow: string;
    title: string;
    intro: string;
    project: string;
    projectPlaceholder: string;
    rating: string;
    /** `{n}` is replaced with the star number, for the star buttons' labels. */
    starLabel: string;
    name: string;
    role: string;
    rolePlaceholder: string;
    text: string;
    textPlaceholder: string;
    consent: string;
    optional: string;
    send: string;
    sending: string;
    success: string;
    /** Shown when required fields are missing. */
    error: string;
    networkError: string;
  };

  /** The approved-reviews section on the home page. */
  testimonials: {
    eyebrow: string;
    title: string;
    /** `{n}` is replaced with the rating, for the stars' accessible label. */
    starsLabel: string;
    /** Shown under a review translated from the other language. */
    translatedNote: string;
  };

  footer: {
    /** `{name}` is replaced with `Dictionary.name`. */
    builtBy: string;
  };
};
