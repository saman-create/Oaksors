import { FormField, TextAreaField } from "@/components/forms/FormField";
import { DisabledFormNotice } from "@/components/forms/DisabledFormNotice";

export function QualificationSection() {
  return (
    <section id="qualify" className="content-section bg-dark qualification-section">
      <video className="qualification-section-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="/assets/videos/page-hero-background.mp4" type="video/mp4" />
      </video>
      <div className="container qualify-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start'}}>
        <div className="form-info scroll-reveal">
          <p style={{textTransform: 'uppercase', letterSpacing: 2, opacity: 1, marginBottom: 10, color: 'white'}}>
            See if your account qualifies today
          </p>
          <h2 className="section-title text-white" style={{textAlign: 'left', marginBottom: 40}}>
            Act Now to Protect Your Retirement Wealth
          </h2>
          <div style={{background: '#111827', padding: 40, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.1)'}}>
            <h3 style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'var(--c-pale-yellow)'}}>
              FULL SERVICE WHOLESALER
            </h3>
            <p style={{marginBottom: 20, fontSize: 16}}>
              We offer and handle more for our clients at no extra cost.
            </p>
            <ul style={{listStyle: 'none', fontSize: 15, lineHeight: 2}}>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                All Paperwork for Processing
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                All Transfers &amp; Custodian Calls
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Around the Clock Customer Service
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                All of Your Purchases &amp; Liquidations
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Full Account Management &amp; Consulting
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                In-house Tax &amp; Legal Consultation
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--c-pale-yellow)" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                In-house Tax &amp; Legal Service
              </li>
            </ul>
          </div>
        </div>
        <div className="scroll-reveal mp-form-card" style={{transitionDelay: '100ms'}}>
          <DisabledFormNotice compact />
          <form aria-label="Landing qualification preview form">
            <fieldset disabled>
              <div className="mp-form-grid">
                <FormField label="First name" name="firstName" autoComplete="given-name" />
                <FormField label="Last name" name="lastName" autoComplete="family-name" />
                <FormField label="Cell phone" name="phone" type="tel" autoComplete="tel" />
                <FormField label="Email Address" name="email" type="email" autoComplete="email" />
                <FormField label="Retirement status" name="retired"><select id="retired" name="retired" defaultValue=""><option value="">Select an option</option><option>Retired</option><option>Not retired</option></select></FormField>
                <FormField label="Date of birth" name="dob" type="date" />
                <TextAreaField label="Please describe your portfolio: assets, account types, and approximate values." name="portfolio" />
                <TextAreaField label="What are your biggest concerns about your portfolio and retirement?" name="concerns" />
              </div>
              <button type="button" className="btn btn-primary btn-lg" disabled>REQUEST INFORMATION NOW</button>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
      );
}
