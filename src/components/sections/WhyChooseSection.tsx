export function WhyChooseSection() {
  return (
    <section className="content-section" style={{background: '#f9fafb', padding: '100px 0'}}>
      <div className="container" style={{maxWidth: 1280, margin: '0 auto', padding: '0 24px'}}>
        <div className="wc-v1-grid scroll-reveal">
          {/* Left: Image */}
          <div style={{position: 'relative'}}>
            <div className="wc-v1-img-wrapper">
              <img src="/assets/images/why-choose.jpg" alt="Couple securing gold bars in safe" />
            </div>
            <div className="wc-v1-badge">Serving All <span>50</span> States</div>
          </div>
          {/* Right: Content */}
          <div>
            <p className="wc-v1-eyebrow">Why Choose Us</p>
            <h2 className="wc-v1-title">Built on <em>Integrity</em>,<br />Driven by <em>Service</em></h2>
            <p className="wc-v1-desc">A veteran-owned company that handles every detail — from paperwork to custodian calls — so you can focus on what matters most.</p>
            <div className="wc-v1-items">
              <div className="wc-v1-item">
                <span className="wc-v1-num">01</span>
                <div>
                  <h4>Veteran Owned Business</h4>
                  <p>Discipline, integrity, and service excellence in every client relationship.</p>
                </div>
              </div>
              <div className="wc-v1-item">
                <span className="wc-v1-num">02</span>
                <div>
                  <h4>Around the Clock Support</h4>
                  <p>Full account management and consulting support at no extra cost, any time you need.</p>
                </div>
              </div>
              <div className="wc-v1-item">
                <span className="wc-v1-num">03</span>
                <div>
                  <h4>Direct Contact</h4>
                  <p style={{color: 'var(--c-pale-yellow)', fontWeight: 500}}>(855) 612-5017 · corporate@oaksorsllc.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      );
}
