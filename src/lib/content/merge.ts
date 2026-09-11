import { dictionaries } from "@/data/i18n";
import type { Dictionary, Lang } from "@/data/i18n/types";
import { readOverride } from "./store";
import type { ContentOverride } from "./schema";

function mergeDictionary(
  base: Dictionary,
  override: Partial<ContentOverride> | null,
): Dictionary {
  if (!override) return base;
  return {
    ...base,
    hero: override.hero ? { ...base.hero, ...override.hero } : base.hero,
    about: override.about ? { ...base.about, ...override.about } : base.about,
    services: override.services
      ? { ...base.services, ...override.services }
      : base.services,
    projects: override.projects
      ? { ...base.projects, ...override.projects }
      : base.projects,
    experience: override.experience
      ? { ...base.experience, ...override.experience }
      : base.experience,
    techStack: override.techStack
      ? { ...base.techStack, ...override.techStack }
      : base.techStack,
    faq: override.faq ? { ...base.faq, ...override.faq } : base.faq,
    contact: override.contact
      ? { ...base.contact, ...override.contact }
      : base.contact,
  };
}

/** Full dictionaries for both languages, with any saved CMS edits applied. */
export async function getMergedDictionaries(): Promise<Record<Lang, Dictionary>> {
  const [enOverride, arOverride] = await Promise.all([
    readOverride("en"),
    readOverride("ar"),
  ]);
  return {
    en: mergeDictionary(dictionaries.en, enOverride),
    ar: mergeDictionary(dictionaries.ar, arOverride),
  };
}

/** The current effective value of every editable section, for prefilling the admin forms. */
export async function getEditableContent(lang: Lang): Promise<Required<ContentOverride>> {
  const dict = (await getMergedDictionaries())[lang];
  return {
    hero: {
      kicker: dict.hero.kicker,
      titleLines: dict.hero.titleLines,
      roles: dict.hero.roles,
      tagline: dict.hero.tagline,
    },
    about: {
      heading: dict.about.heading,
      paragraphs: dict.about.paragraphs,
      facts: dict.about.facts,
    },
    services: { title: dict.services.title, items: dict.services.items },
    projects: { title: dict.projects.title, items: dict.projects.items },
    experience: { title: dict.experience.title, items: dict.experience.items },
    techStack: { title: dict.techStack.title, groups: dict.techStack.groups },
    faq: { title: dict.faq.title, items: dict.faq.items },
    contact: {
      heading: dict.contact.heading,
      text: dict.contact.text,
      links: dict.contact.links,
    },
  };
}
