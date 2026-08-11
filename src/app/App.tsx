import { useEffect, useState } from "react";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Preloader } from "@/components/layout/Preloader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { AboutSection } from "@/components/sections/AboutSection";
import { ClosingCtaSection } from "@/components/sections/ClosingCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MetalsSection } from "@/components/sections/MetalsSection";
import { PartnerLogosSection } from "@/components/sections/PartnerLogosSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { QualificationSection } from "@/components/sections/QualificationSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const header = useHeaderScroll();
  useScrollReveal();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <Preloader />
      <TopBar hidden={header.isTopBarHidden} />
      <SiteHeader
        top={header.headerTop}
        scrolled={header.isHeaderScrolled}
        onOpenMenu={() => setIsMenuOpen(true)}
      />
      <MobileNavigation open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
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
      <SiteFooter />
    </>
  );
}
