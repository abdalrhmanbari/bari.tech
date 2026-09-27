export type ServiceItem = {
  index: string;
  title: string;
  description: string;
};

export const services: ServiceItem[] = [
  {
    index: "01",
    title: "End-to-End Web Development",
    description:
      "From idea to launch: UI design, a fast Next.js front-end, a Headless WordPress CMS you can manage yourself, and deployment with your domain and SSL. Corporate websites, booking platforms, and content-driven sites.",
  },
  {
    index: "02",
    title: "E-commerce Development",
    description:
      "Complete online stores built with Next.js and Headless WooCommerce: product catalog, search and filters, cart, checkout, customer accounts, order tracking, and payment integrations like Stripe.",
  },
  {
    index: "03",
    title: "Custom Dashboards & Integrations",
    description:
      "Custom admin dashboards to manage your content, bookings, and data without touching code, plus integrations with payments, booking systems, email, and AI assistants.",
  },
];
