import { ButtonLink } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section id="top" style={{position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', padding: '0 0 60px'}}>
      {/* Hero Image Background */}
      <img src="/assets/images/hero-gold.png" alt="Gold bars and coins" className="hero-bg-animate" style={{position: 'absolute', top: 36, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1}} />
      {/* Hero Video Background (commented out â€” uncomment to restore video) */}
      {/*
      <video
        id="hero-video"
        class="hero-bg-animate"
        autoplay
        muted
        loop
        playsinline
        style="
          position: absolute;
          top: 36px;
          left: 0;
          width: 100%;
          height: 115%;
          object-fit: cover;
          object-position: center top;
          z-index: -1;
        "
      >
        <source data-src-config="heroVideo" type="video/mp4" />
      </video>
      */}
      <div className="container" style={{position: 'relative', zIndex: 10, width: '100%'}}>
        <div style={{maxWidth: 800}}>
          <h1 className="hero-animate hero-animate-delay-1" style={{fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: '0.97', marginBottom: 20, fontWeight: 400, letterSpacing: '-0.04em', color: '#ffffff'}}>
            Roll over your IRA into precious metals.
          </h1>
          <p className="hero-animate hero-animate-delay-2" style={{fontFamily: '"Inter", sans-serif', fontSize: 'clamp(16px, 1.2vw, 18px)', fontWeight: 400, marginBottom: 32, lineHeight: '1.45', color: '#d1d5db', maxWidth: 520}}>
            Ask about our simple, tax- and penalty-free process for opening a
            new precious metals-backed IRA.
          </p>
          <div className="hero-animate hero-animate-delay-3" style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
            <ButtonLink href="#qualify" size="lg" className="group">
              Get Started Now
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="icon-slide" style={{marginLeft: 8}}>
                <path d="M4 10h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonLink>
            <ButtonLink href="#precious-metals" variant="ghost" size="lg">Explore Precious Metals</ButtonLink>
          </div>
        </div>
      </div>
    </section>
      );
}
