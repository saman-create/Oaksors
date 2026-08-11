import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Preloader } from "@/components/layout/Preloader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TopBar } from "@/components/layout/TopBar";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";

export function SiteShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const header = useHeaderScroll();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: "<!-- OAKSORS MULTI-PAGE CONTRACT | THESIS: retirement education should feel calm, tangible, and direct rather than like a generic financial funnel. | OWN-WORLD: deep charcoal fields, emerald signals, GT typography, generous white editorial sections, rounded glass and paper panels. | STORY: understand the option, examine the evidence, choose a safe next step. | FIRST VIEWPORT: one decisive headline, useful context, and one primary action beside physical precious-metals imagery. | FORM: established Oaksors homepage language extended across routed pages. | FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->" }} />
      <Preloader />
      <TopBar hidden={header.isTopBarHidden} />
      <SiteHeader
        top={header.headerTop}
        scrolled={header.isHeaderScrolled}
        onOpenMenu={() => setIsMenuOpen(true)}
      />
      <MobileNavigation open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Outlet />
      <SiteFooter />
    </>
  );
}
