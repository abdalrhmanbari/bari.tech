

export type StackGroup = {
  title: string;
  items: string[];
};

export const techStack: StackGroup[] = [
  {
    title: "Frameworks",
    items: ["React.js", "Next.js (App Router)", "React Query", ],
  },
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
  },
  {
    title: "Styling",
    items: ["Tailwind CSS", "Framer Motion", "Responsive Design", "CSS Modules"],
  },
  {
    title: "CMS & Data",
    items: ["Headless WordPress", "REST APIs", "WooCommerce"],
  },
  {
    title: "Tooling",
    items: ["Git", "GitHub", "VS Code", "Vercel"],
  },
  {
    title: "Practices",
    items: ["Reusable Components", "Performance", "Accessibility", "SEO"],
  },
];
