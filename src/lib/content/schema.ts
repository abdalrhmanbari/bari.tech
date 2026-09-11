import type {
  ContactLink,
  ExperienceEntry,
  Fact,
  FaqEntry,
  ProjectEntry,
  ServiceEntry,
  StackGroup,
} from "@/data/i18n/types";

/**
 * The subset of each `Dictionary` that the admin dashboard can edit. UI
 * chrome (nav labels, button text, aria labels, form field labels) is
 * intentionally excluded — only actual site content is stored here.
 */
export type ContentOverride = {
  hero?: {
    kicker: string;
    titleLines: string[];
    roles: string[];
    tagline: string;
  };
  about?: {
    heading: string;
    paragraphs: string[];
    facts: Fact[];
  };
  services?: {
    title: string;
    items: ServiceEntry[];
  };
  projects?: {
    title: string;
    items: ProjectEntry[];
  };
  experience?: {
    title: string;
    items: ExperienceEntry[];
  };
  techStack?: {
    title: string;
    groups: StackGroup[];
  };
  faq?: {
    title: string;
    items: FaqEntry[];
  };
  contact?: {
    heading: string[];
    text: string;
    links: ContactLink[];
  };
};

export type SectionKey = keyof ContentOverride;

export const SECTION_KEYS: SectionKey[] = [
  "hero",
  "about",
  "services",
  "projects",
  "experience",
  "techStack",
  "faq",
  "contact",
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  about: "About",
  services: "Services",
  projects: "Projects",
  experience: "Experience",
  techStack: "Tech Stack",
  faq: "FAQ",
  contact: "Contact",
};

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && SECTION_KEYS.includes(value as SectionKey);
}
