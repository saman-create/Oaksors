export function SiteFooter() {
  return (
    <footer className="footer bg-dark" style={{padding: '80px 0 40px 0'}}>
      <div className="container">
        <div className="footer-top" style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 60, marginBottom: 60}}>
          <div className="footer-brand">
            <div style={{marginBottom: 20, display: 'flex', alignItems: 'center'}}>
              <img src="/assets/images/dark-logo.png" style={{height: 96, width: 'auto'}} alt="OAKSORS Logo" />
            </div>
            <p className="mt-4 opacity-50" style={{fontSize: 15, lineHeight: '1.6', maxWidth: 400, color: '#ddd'}}>
              OAKSORS is a wholesale precious metals company that provides
              service internationally and to all 50 states and territories
              within the United States of America. We believe in a simple, quick
              and honest process. Inquire about our services today!
            </p>
          </div>
          <div className="footer-links">
            <h4 style={{fontSize: 18, marginBottom: 24, color: 'white'}}>
              Quick Links
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <a href="#top" style={{color: '#ffffff', textDecoration: 'none'}}>Home</a>
              <a href="#precious-metals" style={{color: '#ffffff', textDecoration: 'none'}}>Precious Metals IRA</a>
              <a href="#news" style={{color: '#ffffff', textDecoration: 'none'}}>News</a>
              <a href="#contact" style={{color: '#ffffff', textDecoration: 'none'}}>Contact Us</a>
            </div>
          </div>
          <div className="footer-links">
            <h4 style={{fontSize: 18, marginBottom: 24, color: 'white'}}>
              Contact Us
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              <a href="tel:8556125017" style={{display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff', textDecoration: 'none'}}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>(855) 612-5017</span>
              </a>
              <a href="mailto:corporate@oaksorsllc.com" style={{display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff', textDecoration: 'none'}}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>corporate@oaksorsllc.com</span>
              </a>
              <div style={{display: 'flex', gap: 16, marginTop: 16}}>
                <a href="#" aria-label="TikTok" style={{color: 'var(--c-pale-yellow)'}}><svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg></a>
                <a href="#" aria-label="YouTube" style={{color: 'var(--c-pale-yellow)'}}><svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a>
                <a href="#" aria-label="LinkedIn" style={{color: 'var(--c-pale-yellow)'}}><svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 20, color: '#ffffff', fontSize: 14}}>
          <p>
            © 2026
            <span style={{color: 'var(--c-pale-yellow)'}}>OAKSORS</span>. All Rights
            Reserved.
          </p>
          <a href="#" style={{color: 'var(--c-pale-yellow)', textDecoration: 'none'}}>Privacy Notice</a>
        </div>
      </div>
    </footer>
      );
}
