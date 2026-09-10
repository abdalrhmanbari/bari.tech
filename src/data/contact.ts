import { site } from "@/data/site";



export type ContactLink = {
  label: string;
  href: string;
  value: string;
  external?: boolean;
};

export const contact = {
  heading: ["Have an idea?", "Let's build it together."],
  text: "Whether it's an e-commerce storefront, a corporate website, a booking platform, or a Headless WordPress build, I'm open to freelance work and collaboration.",
  links: [
    {
      label: "Email",
      href: `mailto:${site.email}`,
      value: site.email,
    },
    {
      label: "GitHub",
      href: site.socials.github,
      value: "@abdalrhmanbari",
      external: true,
    },
    {
      label: "LinkedIn",
      href: site.socials.linkedin,
      value: "in/abd-alrhman-al-bari",
      external: true,
    },
  ] satisfies ContactLink[],
} as const;
