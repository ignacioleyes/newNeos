import { Hero } from "../components/sections/Hero";
import { Pillars } from "../components/sections/Pillars";
import { Projects } from "../components/sections/Projects";
import { About } from "../components/sections/About";
import { Regions } from "../components/sections/Regions";
import { BrochureCTA } from "../components/sections/BrochureCTA";
import { Contact } from "../components/sections/Contact";

export function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <Projects />
      <About />
      <Regions />
      <BrochureCTA />
      <Contact />
    </>
  );
}
