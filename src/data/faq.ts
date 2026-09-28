export type FaqItem = {
  index: string;
  question: string;
  answer: string;
};

export const faq: FaqItem[] = [
  {
    index: "01",
    question: "What do you handle in a project?",
    answer:
      "Everything from start to launch: design, development, a custom dashboard, integrations, and deployment. You deal with one person for the whole project.",
  },
  {
    index: "02",
    question: "Can I edit the content myself?",
    answer:
      "Yes. I build you a simple, custom dashboard, so you can update your content without touching any code.",
  },
  {
    index: "03",
    question: "Why Next.js and Headless WordPress?",
    answer:
      "Next.js makes your website fast, secure, and SEO-friendly, while WordPress works in the background to store your content reliably.",
  },
  {
    index: "04",
    question: "How long does it take, and how much does it cost?",
    answer:
      "It depends on the project. Before we start, you get a clear offer with the scope, timeline, price, and code ownership.",
  },
  {
    index: "05",
    question: "Do you offer support after launch?",
    answer:
      "Yes. You get 6 months of free technical support, and I can keep managing and updating your website after that.",
  },
  {
    index: "06",
    question: "Do you work with clients from other countries?",
    answer:
      "Yes. I work remotely with clients anywhere and build websites in any language, including Arabic (RTL).",
  },
];
