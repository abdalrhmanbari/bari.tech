import { site } from "@/data/site";

export type ContactLink = {
  label: string;
  href: string;
  value: string;
  external?: boolean;
};

/**
 * Contact rows without their label — single-sourced from `site` so the email
 * address and social URLs are edited in exactly one place (`src/data/site.ts`).
 * Each locale supplies only its translated labels through `contactLinks()`.
 */
const channels = [
  { key: "email", href: `mailto:${site.email}`, value: site.email, external: false },
  {
    key: "github",
    href: site.socials.github.url,
    value: site.socials.github.handle,
    external: true,
  },
  {
    key: "linkedin",
    href: site.socials.linkedin.url,
    value: site.socials.linkedin.handle,
    external: true,
  },
  {
    key: "whatsapp",
    href: site.socials.whatsapp.url,
    value: site.socials.whatsapp.handle,
    external: true,
  },
] as const;

export type ContactChannelKey = (typeof channels)[number]["key"];

/** Build the contact list for one locale from its per-channel labels. */
export function contactLinks(
  labels: Record<ContactChannelKey, string>,
): ContactLink[] {
  return channels.map((channel) => ({
    label: labels[channel.key],
    href: channel.href,
    value: channel.value,
    ...(channel.external ? { external: true } : {}),
  }));
}

export const contact = {
  heading: ["Have an idea?", "Let's build it together."],
  text: "Whether it's an e-commerce storefront, a corporate website, a booking platform, or a Headless WordPress build, I'm open to freelance work and collaboration.",
  links: contactLinks({
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
  }),
} as const;
