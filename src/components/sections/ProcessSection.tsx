export function ProcessSection() {
  return (
    <section id="how-it-works" style={{backgroundColor: '#f9fafb', padding: '112px 0'}}>
      <div className="container" style={{maxWidth: 1280, margin: '0 auto', padding: '0 24px'}}>
        <div className="scroll-reveal" style={{maxWidth: 672, margin: '0 auto', textAlign: 'center', marginBottom: 32}}>
          <h2 className="section-title" style={{color: '#111827', textAlign: 'center'}}>
            How Do I Start?
          </h2>
          <p style={{fontSize: 16, color: '#6b7280'}}>3 Easy Steps</p>
        </div>
        <div className="steps-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
          {/* Card 1 */}
          <div className="scroll-reveal" style={{backgroundColor: 'white', borderRadius: 16, padding: 12, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)'}}>
            <img src="/assets/images/img1.png" style={{width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 12, marginBottom: 20}} alt="Application Step" />
            <div style={{padding: '0 8px 8px'}}>
              <h3 style={{fontSize: 20, fontWeight: 500, color: '#111827', marginBottom: 8}}>
                APPLICATION
              </h3>
              <p style={{fontSize: 14, color: '#6b7280', lineHeight: '1.5'}}>
                Complete our simple secure online retirement application in 5
                minutes or less.
              </p>
              <ul style={{listStyle: 'none', marginTop: 16, fontSize: 14, color: '#6b7280', lineHeight: '1.5'}}>
                <li style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Simple secure online application
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  5 minutes or less
                </li>
              </ul>
            </div>
          </div>
          {/* Card 2 */}
          <div className="scroll-reveal" style={{backgroundColor: 'white', borderRadius: 16, padding: 12, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)', transitionDelay: '100ms'}}>
            <img src="/assets/images/img2.png" style={{width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 12, marginBottom: 20}} alt="Pick Amount Step" />
            <div style={{padding: '0 8px 8px'}}>
              <h3 style={{fontSize: 20, fontWeight: 500, color: '#111827', marginBottom: 8}}>
                PICK AMOUNT
              </h3>
              <p style={{fontSize: 14, color: '#6b7280', lineHeight: '1.5'}}>
                Decide on the amount to transfer penalty-free from an existing
                retirement account to your Precious Metals IRA.
              </p>
              <ul style={{listStyle: 'none', marginTop: 16, fontSize: 14, color: '#6b7280', lineHeight: '1.5'}}>
                <li style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Penalty-free transfer
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  From existing retirement account
                </li>
              </ul>
            </div>
          </div>
          {/* Card 3 */}
          <div className="scroll-reveal" style={{backgroundColor: 'white', borderRadius: 16, padding: 12, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)', transitionDelay: '200ms'}}>
            <img src="/assets/images/img3.png" style={{width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 12, marginBottom: 20}} alt="Finalize Step" />
            <div style={{padding: '0 8px 8px'}}>
              <h3 style={{fontSize: 20, fontWeight: 500, color: '#111827', marginBottom: 8}}>
                FINALIZE
              </h3>
              <p style={{fontSize: 14, color: '#6b7280', lineHeight: '1.5'}}>
                Once funds have been transferred, we’ll help you select your
                Precious Metals and lock-in pricing.
              </p>
              <ul style={{listStyle: 'none', marginTop: 16, fontSize: 14, color: '#6b7280', lineHeight: '1.5'}}>
                <li style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Select your Precious Metals
                </li>
                <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Lock-in pricing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
      );
}
