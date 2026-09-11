

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
};

export const projects: Project[] = [
{
  title: "Bombo Car Wash",
  tag: "Service / Booking / Next.js",
  description:
    "A modern car wash service platform built with Next.js and Headless WordPress, featuring a multi-step appointment booking system, dynamic service management, testimonials, content management, and an AI-powered customer assistant.",
  tech: ["Next.js", "TypeScript", "Tailwind CSS", "Headless WordPress", "Framer Motion"],
  links: [{ label: "Coming Soon", href: "" }],
  image: "/projects/bombo.png",
  country: "Iraq",
},
{
  title: "Nextzett",
  tag: "E-commerce / Next.js",
  description:
    "A modern automotive care e-commerce storefront built with Next.js and WooCommerce, featuring product discovery, advanced search and filtering, cart and checkout flows, customer accounts, order tracking, and Stripe payments.",
  tech: ["Next.js", "TypeScript", "WooCommerce", "Stripe", "Tailwind CSS"],
  links: [{ label: "Coming Soon", href: "" }],
  image: "/projects/nextzett.png",
  country: "Iraq",
},
  {
    title: "DigitStone",
    tag: "Corporate / Next.js",
    description:
      "A digital agency website built with Next.js and Headless WordPress, featuring dynamic services, case studies, blog content, multilingual support, and an AI-powered website assistant.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Headless WordPress"],
    links: [{ label: "View Project", href: "https://digitstone.tech/" }],
    image: "/projects/digitstone.png",
    country: "Germany",
  },
  {
    title: "Aurodia",
    tag: "E-commerce / WordPress",
    description:
      "A luxury jewelry e-commerce website built with WordPress and WooCommerce, featuring product discovery, responsive shopping experiences, customer accounts, and a complete checkout flow.",
    tech: ["WordPress", "WooCommerce", "Elementor", "JavaScript"],
    links: [{ label: "View Project", href: "https://aurodia.de/" }],
    image: "/projects/aurodia.png",
    country: "Germany",
  },
  {
    title: "Marasil",
    tag: "Logistics / React.js",
    description:
      "A modern logistics platform for managing shipments, shipping rates, order tracking, and integrations with major e-commerce and delivery platforms.",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    links: [{ label: "View Project", href: "https://www.marasil.sa/" }],
    image: "/projects/marasil.png",
    country: "Saudi Arabia",
  },
  {
    title: "MAHAM",
    tag: "Corporate / Next.js",
    description:
      "A modern corporate website for an engineering consultancy, built with Next.js and Headless WordPress to deliver structured services, company content, insights, and a responsive user experience.",
    tech: ["Next.js", "Headless WordPress", "TypeScript", "Tailwind CSS"],
    links: [{ label: "View Project", href: "https://mahameng.com/" }],
    image: "/projects/maham.png",
    country: "Italy",
  },
  {
    title: "Terra Group",
    tag: "Corporate / React.js",
    description:
      "A corporate website for an engineering and design consultancy, built with React and TypeScript with responsive layouts and reusable UI components.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    links: [{ label: "View Project", href: "https://beta.terragroup.ae/" }],
    image: "/projects/terra.png",
    country: "United Arab Emirates",
  },
];