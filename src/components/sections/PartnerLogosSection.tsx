export function PartnerLogosSection() {
  return (
    <section className="partner-logos-section">
      <div className="container">
        <p className="partner-logos-label scroll-reveal">
          Trusted By Industry Leaders
        </p>
        <div className="partner-logos-row scroll-reveal" style={{transitionDelay: '0.15s'}}>
          <img src="/assets/images/delaware-depository.webp" alt="Delaware Depository" className="partner-logo" />
          <img src="/assets/images/preferred-trust.webp" alt="Preferred Trust Company" className="partner-logo" />
          <img src="/assets/images/veteran.png" alt="Veteran Owned Business" className="partner-logo" />
          <img src="/assets/images/trustpilot.png" alt="Trustpilot" className="partner-logo" />
        </div>
      </div>
    </section>
      );
}
