import { ButtonLink } from "@/components/ui/Button";

export function ClosingCtaSection() {
  return (
    <section id="cta-section" className="content-section">
      <div className="container" style={{textAlign: 'center'}}>
        <div className="scroll-reveal">
          <h2 className="section-title">Protect Your Retirement Wealth</h2>
          <p className="section-subtitle" style={{margin: '0 auto 40px auto'}}>
            Ask about our tax-free, penalty-free IRA rollover process
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
            <ButtonLink href="#qualify" size="lg" className="group">
              Get Started Now
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="icon-slide">
                <path d="M4 10h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonLink>
            <ButtonLink href="tel:8556125017" variant="ghost" size="lg">(855) 612-5017</ButtonLink>
          </div>
        </div>
      </div>
    </section>
      );
}
