import type { Metadata } from "next";
import { Quote } from "@/components/sections/Quote";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Tell me about your website or web app and get a clear offer with the price and timeline within 5 hours.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return <Quote />;
}
