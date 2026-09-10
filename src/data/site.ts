

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abd-alrhman-al-bari.vercel.app"
).replace(/\/$/, "");

export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

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
  email: "bariabdalrhman@gmail.com",
  location: "Available worldwide · Remote",
  socials: {
    github: "https://github.com/abdalrhmanbari",
    linkedin: "https://www.linkedin.com/in/abd-alrhman-al-bari-b09503260/",
  },
  /** Header navigation. Order and labels mirror the reference site. */
  nav: [
    { label: "About", href: "#about" },
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
