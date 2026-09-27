

export type StackGroup = {
  title: string;
  items: string[];
};

export const techStack: StackGroup[] = [
  {
    title: "Frontend",
    items: ["React.js", "Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "React Query"],
  },
  {
    title: "Backend & APIs",
    items: ["Next.js API Routes", "Server Components", "REST APIs", "Authentication & Middleware"],
  },
  {
    title: "CMS & E-commerce",
    items: ["Headless WordPress", "WordPress", "WooCommerce", "Custom Admin Dashboards"],
  },
  {
    title: "Integrations",
    items: ["Stripe Payments", "Email / SMTP", "AI Assistants", "Booking Systems"],
  },
  {
    title: "Deployment & DevOps",
    items: ["Netlify", "Vercel", "Domains, DNS & SSL", "Git & GitHub"],
  },
  {
    title: "Practices",
    items: ["Performance", "SEO", "Accessibility", "Responsive Design"],
  },
];
