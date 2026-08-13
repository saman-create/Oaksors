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
          <a href="https://www.preferredtrustcompany.com/why-self-directed-ira/" target="_blank" rel="noreferrer" aria-label="Preferred Trust Company Self-Directed IRA">
            <img src="/assets/images/preferred-trust.webp" alt="Preferred Trust Company" className="partner-logo" />
          </a>
          <img src="/assets/images/veteran.png" alt="Veteran Owned Business" className="partner-logo" />
          <a href="https://www.trustpilot.com/review/oaksorsllc.com" target="_blank" rel="noreferrer" aria-label="Oaksors Trustpilot reviews">
            <img src="/assets/images/trustpilot.png" alt="Trustpilot" className="partner-logo" />
          </a>
          <a href="https://www.bbb.org/us/nv/las-vegas/profile/trust-company/preferred-trust-company-llc-1086-80528" target="_blank" rel="noreferrer" aria-label="Preferred Trust Company BBB profile">
            <img src="/assets/images/preferred-trust-bbb.png" alt="Preferred Trust Company BBB Accredited Business" className="partner-logo partner-logo--bbb" />
          </a>
        </div>
      </div>
    </section>
      );
}
