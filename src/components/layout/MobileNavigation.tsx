import { Link, NavLink } from "react-router-dom";
import { ButtonLink } from "@/components/ui/Button";

type MobileNavigationProps = { open: boolean; onClose: () => void };

const navigation = [
  ["Home", "/"],
  ["Precious Metals IRA", "/precious-metals-ira/"],
  ["News", "/news/"],
  ["Contact Us", "/contact-us/"],
] as const;

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  if (!open) return null;

  return (
    <div className="mobile-nav active" role="dialog" aria-label="Mobile navigation" aria-modal="true">
      <div className="mobile-nav-header">
        <Link to="/" className="logo-link" onClick={onClose}>
          <img src="/assets/images/dark-logo.png" className="site-logo" alt="Oaksors" />
        </Link>
        <button className="menu-close" aria-label="Close menu" onClick={onClose}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav className="mobile-nav-links">
        {navigation.map(([label, to]) => (
          <NavLink key={to} to={to} end={to === "/"} className="mobile-link" onClick={onClose}>{label}</NavLink>
        ))}
      </nav>
      <div className="mobile-nav-actions">
        <ButtonLink href="/get-started-now/" size="lg" onPress={onClose}>Get Started Now</ButtonLink>
        <ButtonLink href="tel:8556125017" variant="ghost" size="lg">(855) 612-5017</ButtonLink>
      </div>
    </div>
  );
}
