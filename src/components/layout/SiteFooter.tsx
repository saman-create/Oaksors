import { Link } from "react-router-dom";
import { SocialLinks } from "@/components/common/SocialLinks";

const quickLinks = [
  ["Home", "/"],
  ["Precious Metals IRA", "/precious-metals-ira/"],
  ["Invest with Oaksors", "/invest/"],
  ["News", "/news/"],
  ["Contact Us", "/contact-us/"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link to="/" aria-label="Oaksors home"><img src="/assets/images/dark-logo.png" alt="Oaksors" /></Link>
            <p>Oaksors is a wholesale precious metals company serving clients internationally and throughout all 50 U.S. states and territories. We believe in a simple, quick, and honest process.</p>
          </div>
          <div>
            <h2>Follow Us</h2>
            <SocialLinks className="site-footer-social-links" />
          </div>
          <div>
            <h2>Quick Links</h2>
            <nav className="site-footer-links" aria-label="Footer navigation">
              {quickLinks.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
            </nav>
          </div>
          <div>
            <h2>Contact Us</h2>
            <div className="site-footer-links">
              <a href="tel:8556125017">(855) 612-5017</a>
              <a href="mailto:corporate@oaksorsllc.com">corporate@oaksorsllc.com</a>
              <span>Mon–Fri · 8am–5pm PST</span>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p>© 2026 <span>Oaksors</span>. All rights reserved.</p>
          <Link to="/privacy-notice/">Privacy Notice</Link>
        </div>
      </div>
    </footer>
  );
}
