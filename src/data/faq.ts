export type FaqItem = {
  index: string;
  question: string;
  answer: string;
};

export const faq: FaqItem[] = [
  {
    index: "01",
    question: "Do you provide technical support after delivery?",
    answer:
      "Yes. Free technical support is included for 6 months after delivery to help resolve technical issues and keep the website running smoothly.",
  },
  {
    index: "02",
    question: "Do you offer website management after launch?",
    answer:
      "Yes. I can manage website content, updates, and maintenance after launch based on your needs.",
  },
  {
    index: "03",
    question: "Can I request changes after the website is delivered?",
    answer:
      "Yes. Post-launch changes, improvements, and new features can be requested separately based on the scope of the work.",
  },
  {
    index: "04",
    question: "Do you provide website deployment and server setup?",
    answer:
      "Yes. I can handle website deployment, server configuration, domain, and SSL setup.",
  },
  {
    index: "05",
    question: "Can you improve the performance of an existing website?",
    answer:
      "Yes. I can analyze and improve your website's performance, UX, and SEO.",
  },
];
