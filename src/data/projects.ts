

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  /** Short category label shown above the title. */
  tag: string;
  description: string;
  tech: string[];
  links: ProjectLink[];
  /**
   * Optional preview image, as a path under `public/`. Drop a screenshot at
   * `public/projects/<slug>.png` and point `image` at `/projects/<slug>.png`.
   * When omitted, the card shows the faded index number instead.
   */
  image?: string;
  /** Country the project's owner / client is based in. Shown next to the tag. */
  country?: string;
  /** What I did on the project (e.g. "Full-Stack Development"). Shown under the title. */
  role?: string;
};

export const projects: Project[] = [
  {
    title: "DigitStone",
    tag: "Corporate / Next.js",
    description:
      "Website for a German software company, built end to end with Next.js and Headless WordPress: dynamic services and case studies, multilingual content, an appointment booking system, and a custom dashboard for managing content without touching the code.",
    tech: ["Next.js", "TypeScript", "Headless WordPress", "Tailwind CSS"],
    links: [{ label: "Visit Live Site", href: "https://digitstone.tech/" }],
    image: "/projects/digitstone.png",
    country: "Germany",
    role: "Full-Stack Development",
  },
  {
    title: "Nextzett",
    tag: "E-commerce / Next.js",
    description:
      "E-commerce platform for an automotive care brand, built end to end with Next.js and Headless WordPress + WooCommerce: product browsing, search and filtering, cart, checkout, customer accounts, order tracking, and Stripe payments.",
    tech: ["Next.js", "TypeScript", "Headless WordPress", "WooCommerce", "Stripe", "Tailwind CSS"],
    links: [{ label: "Coming Soon", href: "" }],
    image: "/projects/nextzett.png",
    country: "Iraq",
    role: "Full-Stack Development",
  },
  {
    title: "Bombo Car Wash",
    tag: "Booking / Next.js",
    description:
      "Car wash service platform built end to end with Next.js and Headless WordPress: a multi-step appointment booking system, dynamic service management, testimonials, and a custom dashboard for managing site content and bookings.",
    tech: ["Next.js", "TypeScript", "Headless WordPress", "Tailwind CSS", "Framer Motion"],
    links: [{ label: "Coming Soon", href: "" }],
    image: "/projects/bombo.png",
    country: "Iraq",
    role: "Full-Stack Development",
  },
  {
    title: "MAHAM",
    tag: "Corporate / Next.js",
    description:
      "Portfolio website for an engineering firm, built end to end with Next.js and Headless WordPress: dynamic project content, multilingual support, and a custom dashboard for managing site content.",
    tech: ["Next.js", "TypeScript", "Headless WordPress", "Tailwind CSS"],
    links: [{ label: "Visit Live Site", href: "https://mahameng.com/" }],
    image: "/projects/maham.png",
    country: "Italy",
    role: "Full-Stack Development",
  },
  {
    title: "Marasil",
    tag: "Logistics / React.js",
    description:
      "Logistics platform for managing shipments, shipping rates, order tracking, and integrations with major e-commerce and delivery platforms. I worked on the React front-end, connecting the interface to the platform's REST APIs.",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    links: [{ label: "Visit Live Site", href: "https://www.marasil.sa/" }],
    image: "/projects/marasil.png",
    country: "Saudi Arabia",
    role: "Frontend Development (React)",
  },
  {
    title: "Aurodia",
    tag: "E-commerce / WordPress",
    description:
      "A luxury jewelry e-commerce website built with WordPress and WooCommerce, featuring product discovery, responsive shopping experiences, customer accounts, and a complete checkout flow.",
    tech: ["WordPress", "WooCommerce", "Elementor", "JavaScript"],
    links: [{ label: "Visit Live Site", href: "https://aurodia.de/" }],
    image: "/projects/aurodia.png",
    country: "Germany",
    role: "WordPress Development",
  },
  {
    title: "Terra Group",
    tag: "Corporate / React.js",
    description:
      "Corporate website for an engineering and design consultancy. I built the front-end in React and TypeScript, with responsive layouts and reusable UI components.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    links: [{ label: "Visit Live Site", href: "https://beta.terragroup.ae/" }],
    image: "/projects/terra.png",
    country: "United Arab Emirates",
    role: "Frontend Development (React)",
  },
  {
    title: "PPSMS",
    tag: "Management System / React.js",
    description:
      "Management system for a non-profit association in Malaysia: member applications, spouse and family records, documents, IMM13 and UNHCR status tracking, PDF generation, reports, and programme statistics. I built the React front-end with Material UI.",
    tech: ["React.js", "Material UI"],
    links: [{ label: "Private System", href: "" }],
    image: "/projects/ppsms.png",
    country: "Malaysia",
    role: "Frontend Development (React)",
  },
];
