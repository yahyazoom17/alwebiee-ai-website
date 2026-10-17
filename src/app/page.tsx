import { Approach } from "@/components/sections/approach";
import { BrandIntro } from "@/components/sections/brand-intro";
import { Capabilities } from "@/components/sections/capabilities";
import { Differentiators } from "@/components/sections/differentiators";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { InnovationLab } from "@/components/sections/innovation-lab";
import { Resources } from "@/components/sections/resources";

/** Bands alternate base/inset so adjacent sections are distinguishable. */
export default function Home() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <Capabilities />
      <InnovationLab />
      <Approach />
      <Differentiators />
      <Resources />
      <FinalCta />
    </>
  );
}
