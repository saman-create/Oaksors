import { Link, NavLink } from "react-router-dom";
import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/lib/utils";

type SiteHeaderProps = {
  top: number;
  scrolled: boolean;
  onOpenMenu: () => void;
};

const navigation = [
  { label: "Home", to: "/" },
  { label: "Precious Metals IRA", to: "/precious-metals-ira/" },
  { label: "News", to: "/news/" },
  { label: "Contact Us", to: "/contact-us/" },
];

export function SiteHeader({ top, scrolled, onOpenMenu }: SiteHeaderProps) {
  return (
    <header id="header" className={cx("header", scrolled && "scrolled")} style={{ top }}>
      <div className="header-blur" />
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link" aria-label="Oaksors home">
            <img src="/assets/images/dark-logo.png" className="site-logo" alt="Oaksors" />
          </Link>
        </div>
        <nav className="header-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => cx("nav-link", isActive && "active")}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <ButtonLink href="/get-started-now/" style={{ padding: "0 24px" }}>
            Get Started Now
          </ButtonLink>
        </div>
        <button className="menu-toggle" aria-label="Open menu" onClick={onOpenMenu}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
