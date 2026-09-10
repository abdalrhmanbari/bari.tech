

const FALLBACK_SITE_URL = "https://abd-alrhman-al-bari.vercel.app";

// Origin used for canonical links, sitemap, robots, and Open Graph metadata.
// Falls back to the production URL when NEXT_PUBLIC_SITE_URL is unset, blank, or
// malformed — an invalid `metadataBase` fails the Next.js production build.
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return FALLBACK_SITE_URL;
  try {
    return new URL(configured).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

// Where the contact form POSTs. Defaults to the built-in Gmail-SMTP route;
// set NEXT_PUBLIC_CONTACT_ENDPOINT to an external URL (e.g. Formspree) to override.
export const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact";

export const site = {
  name: "Abd Alrhman Al Bari",
  /** Two display lines used by the masked hero headline. */
  titleLines: ["ABD ALRHMAN", "AL BARI"],
  role: "Frontend Developer / Software Engineer",
  /** Small eyebrow above the hero headline. */
  kicker: "Software Engineering · Frontend · React",
  /** Role chips shown under the hero headline, separated by dots. */
  roles: ["Frontend Developer", "React & Next.js", "Software Engineer"],
  tagline:
    "Frontend Developer specializing in React, Next.js, TypeScript, and modern web experiences.",
  /** Short logo mark in the header: primary word + dimmed descriptor. */
  logo: { primary: "AL BARI", secondary: "Frontend Developer" },
  /**
   * Contact details — the single source of truth. Edit an address or URL here
   * and it flows to the contact list (both languages), the mobile menu, the
   * footer, the JSON-LD, and the Open Graph image. Each social carries its
   * `url` plus the `handle` shown as the row's display text.
   * (The contact form's delivery inbox is configured separately via env —
   * see `.env.example`.)
   */
  email: "bariabdalrhman@gmail.com",
  location: "Available worldwide · Remote",
  socials: {
    github: {
      url: "https://github.com/abdalrhmanbari",
      handle: "@abdalrhmanbari",
    },
    linkedin: {
      url: "https://www.linkedin.com/in/abdalrahman-al-bari-b09503260",
      handle: "in/abd-alrhman-al-bari",
    },
    whatsapp: {
      url: "https://wa.me/963982050174",
      handle: "+963 982 050 174",
    },
  },
  /** Header navigation. Order and labels mirror the reference site. */
  nav: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Skills", href: "#techstack" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  meta: {
    title: "Abd Alrhman Al Bari — Frontend Developer",
    description:
      "Portfolio of Abd Alrhman Al Bari, a Frontend Developer and Software Engineering student building fast, responsive web experiences with React, Next.js, TypeScript, and Headless WordPress.",
    keywords: [
      "Abd Alrhman Al Bari",
      "Frontend Developer",
      "Software Engineer",
      "React Developer",
      "Next.js Developer",
      "TypeScript",
      "Tailwind CSS",
      "Headless WordPress",
      "Web Developer Portfolio",
    ],
  },
} as const;

export type Site = typeof site;
