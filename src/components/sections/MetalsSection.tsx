export function MetalsSection() {
  return (
    <section id="precious-metals" className="content-section bg-dark" style={{borderTop: '1px solid rgba(255, 255, 255, 0.05)'}}>
      <div className="container" style={{position: 'relative', zIndex: 10}}>
        <div className="section-header scroll-reveal">
          <h2 className="section-title text-white">Precious Metals</h2>
          <p className="section-subtitle" style={{color: 'var(--c-pale-yellow)', fontSize: 18, fontWeight: 500, filter: 'brightness(1.2)'}}>
            Live market pricing
          </p>
        </div>
        <div className="features-grid metals-carousel" style={{gridTemplateColumns: 'repeat(4, 1fr)', gap: 20}}>
          {/* Gold Chart */}
          <div className="feature-card scroll-reveal glass-card" style={{padding: 24, color: 'white'}}>
            <h3 style={{fontSize: 20, textAlign: 'left', marginBottom: 12, color: 'white'}}>
              Gold
            </h3>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <span style={{fontSize: 24, fontWeight: 'bold', color: 'var(--c-pale-yellow)'}}>$4,104.76</span>
              <span style={{color: 'var(--c-pale-yellow)', fontWeight: 'bold', fontSize: 14}}>↑ 0.81%</span>
            </div>
            <div style={{height: 120, borderLeft: '1px solid #333', borderBottom: '1px solid #333', position: 'relative'}}>
              <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%'}} preserveAspectRatio="none">
                <polyline points="0,90 20,70 40,80 60,30 80,40 100,10" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={2} />
              </svg>
            </div>
            <p style={{fontSize: 14, color: '#ffffff', marginTop: 16, lineHeight: '1.5'}}>
              Gold Price per Ounce<br />Jun 11 UTC<br />GoldBroker
            </p>
          </div>
          {/* Silver Chart */}
          <div className="feature-card scroll-reveal glass-card" style={{padding: 24, color: 'white', transitionDelay: '100ms'}}>
            <h3 style={{fontSize: 20, textAlign: 'left', marginBottom: 12, color: 'white'}}>
              Silver
            </h3>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <span style={{fontSize: 24, fontWeight: 'bold', color: 'var(--c-pale-yellow)'}}>$64.45</span>
              <span style={{color: 'var(--c-pale-yellow)', fontWeight: 'bold', fontSize: 14}}>↑ 1.62%</span>
            </div>
            <div style={{height: 120, borderLeft: '1px solid #333', borderBottom: '1px solid #333', position: 'relative'}}>
              <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%'}} preserveAspectRatio="none">
                <polyline points="0,80 20,60 40,70 60,40 80,20 100,10" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={2} />
              </svg>
            </div>
            <p style={{fontSize: 14, color: '#ffffff', marginTop: 16, lineHeight: '1.5'}}>
              Silver Price per Ounce<br />Jun 11 UTC<br />GoldBroker
            </p>
          </div>
          {/* Platinum Chart */}
          <div className="feature-card scroll-reveal glass-card" style={{padding: 24, color: 'white', transitionDelay: '200ms'}}>
            <h3 style={{fontSize: 20, textAlign: 'left', marginBottom: 12, color: 'white'}}>
              Platinum
            </h3>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <span style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>$1,682.50</span>
              <span style={{color: '#ff4d4d', fontWeight: 'bold', fontSize: 14}}>↓ -0.62%</span>
            </div>
            <div style={{height: 120, borderLeft: '1px solid #333', borderBottom: '1px solid #333', position: 'relative'}}>
              <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%'}} preserveAspectRatio="none">
                <polyline points="0,50 20,40 40,60 60,50 80,70 100,80" fill="none" stroke="#ff4d4d" strokeWidth={2} />
              </svg>
            </div>
            <p style={{fontSize: 14, color: '#ffffff', marginTop: 16, lineHeight: '1.5'}}>
              Platinum Price per Ounce<br />Jun 11 UTC<br />GoldBroker
            </p>
          </div>
          {/* Palladium Chart */}
          <div className="feature-card scroll-reveal glass-card" style={{padding: 24, color: 'white', transitionDelay: '300ms'}}>
            <h3 style={{fontSize: 20, textAlign: 'left', marginBottom: 12, color: 'white'}}>
              Palladium
            </h3>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <span style={{fontSize: 24, fontWeight: 'bold', color: 'var(--c-pale-yellow)'}}>$1,254.00</span>
              <span style={{color: 'var(--c-pale-yellow)', fontWeight: 'bold', fontSize: 14}}>↑ 1.13%</span>
            </div>
            <div style={{height: 120, borderLeft: '1px solid #333', borderBottom: '1px solid #333', position: 'relative'}}>
              <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%'}} preserveAspectRatio="none">
                <polyline points="0,70 20,50 40,60 60,20 80,30 100,10" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={2} />
              </svg>
            </div>
            <p style={{fontSize: 14, color: '#ffffff', marginTop: 16, lineHeight: '1.5'}}>
              Palladium Price per Ounce<br />Jun 11 UTC<br />GoldBroker
            </p>
          </div>
        </div>
        <div className="landing-live-metal-grid">
          {[
            ["Gold", "XAU"],
            ["Silver", "XAG"],
            ["Platinum", "XPT"],
            ["Palladium", "XPD"],
          ].map(([name, symbol]) => (
            <article className="landing-live-metal-card" key={symbol}>
              <div className="landing-live-metal-head">
                <div><p>Live market pricing</p><h3>{name}</h3></div>
                <span><i /> Live</span>
              </div>
              <iframe title={`${name} live price`} src={`https://goldbroker.com/widget/live/${symbol}?currency=USD&height=320`} />
            </article>
          ))}
        </div>
      </div>
    </section>
      );
}
