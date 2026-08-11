import { AboutSection } from "@/components/sections/AboutSection";
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MetalsSection } from "@/components/sections/MetalsSection";
import { PartnerLogosSection } from "@/components/sections/PartnerLogosSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { QualificationSection } from "@/components/sections/QualificationSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function HomePage() {
  usePageMeta("Oaksors | Precious Metals IRA Specialists", "Roll over eligible retirement savings into precious metals with a simple, guided process.");
  useScrollReveal();

  return (
    <main>
      <HeroSection />
      <PartnerLogosSection />
      <QualificationSection />
      <ProcessSection />
      <WhyChooseSection />
      <MetalsSection />
      <AboutSection />
      <ClosingCtaSection />
    </main>
  );
}
