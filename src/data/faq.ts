export type FaqItem = {
  index: string;
  question: string;
  answer: string;
};

export const faq: FaqItem[] = [
  {
    index: "01",
    question: "What does “from A to Z” actually include?",
    answer:
      "Everything needed to take your website from idea to launch: planning the structure, UI design (or building from your existing design), developing the front-end in Next.js, setting up WordPress as a headless CMS, custom dashboards, integrations like payments and booking, performance and SEO, and deployment with your domain and SSL. You deal with one person for the whole project.",
  },
  {
    index: "02",
    question: "Will I be able to update the content myself?",
    answer:
      "Yes. Your content is managed from a WordPress dashboard, so you can edit pages, services, projects, and posts without touching any code.",
  },
  {
    index: "03",
    question: "Why Next.js with Headless WordPress instead of a regular WordPress site?",
    answer:
      "You get the best of both: a fast, secure, SEO-friendly website built with Next.js, and the familiar WordPress dashboard for managing your content. The front-end isn’t tied to themes or heavy plugins, so the site stays fast and easy to grow.",
  },
  {
    index: "04",
    question: "How long does a project take, and how much does it cost?",
    answer:
      "It depends on the size and features of the project. After we discuss what you need, you receive a clear proposal covering the scope, timeline, cost, and ownership of the code and hosting, all agreed before any work starts.",
  },
  {
    index: "05",
    question: "What happens after launch?",
    answer:
      "Every project includes 6 months of free technical support to fix issues and keep the website running smoothly. After that, I can continue managing your content, updates, and maintenance, and new features or changes can be requested based on their scope.",
  },
  {
    index: "06",
    question: "Do you work with clients from other countries?",
    answer:
      "Yes. I work remotely with clients from any country, and I can build your website in any language, including multilingual and right-to-left (RTL) websites. My clients so far are in Germany, Saudi Arabia, the UAE, Italy, Iraq, and Malaysia, and I communicate in both English and Arabic.",
  },
];
