import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/lib/utils";

type SiteHeaderProps = {
  top: number;
  scrolled: boolean;
  onOpenMenu: () => void;
};

export function SiteHeader({ top, scrolled, onOpenMenu }: SiteHeaderProps) {
  return (
    <header id="header" className={cx("header", scrolled && "scrolled")} style={{ top }}>
      <div className="header-blur" />
      <div className="header-container">
        <div className="header-left">
          <a href="#top" className="logo-link" style={{display: 'flex', alignItems: 'center'}}><img src="/assets/images/dark-logo.png" style={{height: 44, width: 'auto', filter: 'brightness(0) invert(1)'}} alt="OAKSORS Logo" /></a>
        </div>
        <nav className="header-nav">
          <a href="#top" className="nav-link">Home</a>
          <a href="#precious-metals" className="nav-link">Precious Metals IRA</a>
          <a href="#news" className="nav-link">News</a>
          <a href="#contact" className="nav-link">Contact Us</a>
        </nav>
        <div className="header-actions">
          <ButtonLink href="#qualify" style={{ padding: "0 24px" }}>
            Get Started Now
          </ButtonLink>
        </div>
        <button className="menu-toggle" id="menu-toggle" aria-label="Open menu" onClick={onOpenMenu}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
      );
}
