import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { TechStack } from "@/components/sections/TechStack";
import { Faq } from "@/components/sections/Faq";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { listApprovedReviews } from "@/lib/reviews/store";

export default async function HomePage() {
  const reviews = await listApprovedReviews();

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Experience />
      <TechStack />
      <Faq />
      <Testimonials reviews={reviews} />
      <Contact />
    </>
  );
}
