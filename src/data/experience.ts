
export type ExperienceItem = {
  date: string;
  role: string;
  /** Optional secondary line (e.g. institution) shown between the role and description. */
  org?: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    date: "2024 — Present",
    role: "Full-Stack Developer",
    description:
      "Building complete websites and web applications for businesses and organizations, working across the development process from planning and UI implementation to CMS integration, APIs, dashboards, integrations, performance, and deployment.",
  },
  {
    date: "2022 — Present",
    role: "Software Engineering Student",
    org: "Qasioun Private University",
    description:
      "Pursuing a B.Sc. in Software Engineering, with a focus on software development, web technologies, and practical project-based learning.",
  },
];
