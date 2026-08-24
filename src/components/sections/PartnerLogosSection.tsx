export function PartnerLogosSection() {
  return (
    <section className="partner-logos-section">
      <div className="container">
        <p className="partner-logos-label scroll-reveal">
          Trusted By Industry Leaders
        </p>
        <div className="partner-logos-row scroll-reveal" style={{transitionDelay: '0.15s'}}>
          <a href="https://delawaredepository.com/about-delaware-depository/our-services/ira-services/" target="_blank" rel="noreferrer" aria-label="Delaware Depository IRA Services">
            <img src="/assets/images/delaware-depository.webp" alt="Delaware Depository" className="partner-logo" />
          </a>
          <img src="/assets/images/veteran.png" alt="Veteran Owned Business" className="partner-logo" />
          <a href="https://www.trustpilot.com/review/oaksorsllc.com" target="_blank" rel="noreferrer" aria-label="Oaksors Trustpilot reviews">
            <img src="/assets/images/trustpilot.png" alt="Trustpilot" className="partner-logo" />
          </a>
        </div>
      </div>
    </section>
      );
}
