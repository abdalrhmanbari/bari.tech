
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
    role: "Frontend Developer",
    description:
      "Building production websites and web applications with React, Next.js, TypeScript, and Headless WordPress, including e-commerce, corporate, and booking platforms.",
  },
  {
    date: "2022 — Present",
    role: "Software Engineering Student",
    org: "Qasioun Private University",
    description:
      "Studying Software Engineering with a focus on programming, data structures, algorithms, software development, and engineering fundamentals.",
  },
];
