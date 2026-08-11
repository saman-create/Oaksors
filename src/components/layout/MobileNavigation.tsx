import { ButtonLink } from "@/components/ui/Button";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  if (!open) return null;

  return (
    <div className="mobile-nav active" id="mobile-nav" role="dialog" aria-label="Mobile navigation" aria-modal="true">
      <div className="mobile-nav-header">
        <a href="#top" className="logo-link" style={{fontSize: 24, fontWeight: 800, letterSpacing: 2}}>
          OAKSORS
        </a>
        <button className="menu-close" id="menu-close" aria-label="Close menu" onClick={onClose} style={{background: 'transparent', border: 'none', color: 'white', cursor: 'pointer'}}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav className="mobile-nav-links">
        <a href="#top" className="mobile-link" onClick={onClose}>Home</a>
        <a href="#precious-metals" className="mobile-link" onClick={onClose}>Precious Metals IRA</a>
        <a href="#news" className="mobile-link" onClick={onClose}>News</a>
        <a href="#contact" className="mobile-link" onClick={onClose}>Contact Us</a>
      </nav>
      <div className="mobile-nav-actions">
        <ButtonLink href="#qualify" size="lg" onPress={onClose} style={{width: '100%', justifyContent: 'center'}}>Get Started Now</ButtonLink>
        <ButtonLink href="tel:8556125017" variant="ghost" size="lg" style={{width: '100%', justifyContent: 'center'}}>(855) 612-5017</ButtonLink>
      </div>
    </div>
      );
}
