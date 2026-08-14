export function MetalsSection() {
  return (
    <section id="precious-metals" className="content-section bg-dark" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="section-header scroll-reveal">
          <h2 className="section-title text-white">Precious Metals</h2>
          <p className="section-subtitle" style={{ color: 'var(--c-pale-yellow)', fontSize: 18, fontWeight: 500, filter: 'brightness(1.2)' }}>
            Live market pricing
          </p>
        </div>
        <div className="landing-live-metal-grid">
          {[
            ['Gold', 'XAU'],
            ['Silver', 'XAG'],
            ['Platinum', 'XPT'],
            ['Palladium', 'XPD'],
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
