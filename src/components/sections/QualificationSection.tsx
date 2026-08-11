import { Button } from "@/components/ui/Button";

export function QualificationSection() {
  return (
    <section id="qualify" className="content-section bg-dark" style={{background: 'url("/assets/images/actnow-bg.png") center/cover no-repeat'}}>
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
        <div className="form-container scroll-reveal" style={{transitionDelay: '100ms', background: 'var(--c-white)', color: 'var(--c-black)', padding: 40, borderRadius: 8}}>
          <form className="form-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            <div>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>First Name <span style={{color: 'red'}}>*</span></label>
              <input type="text" style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required />
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>Last Name <span style={{color: 'red'}}>*</span></label>
              <input type="text" style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required />
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>Cell phone <span style={{color: 'red'}}>*</span></label>
              <input type="text" style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required />
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>Email Address <span style={{color: 'red'}}>*</span></label>
              <input type="email" style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required />
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>Retired <span style={{color: 'red'}}>*</span></label>
              <div style={{display: 'flex', gap: 16, marginTop: 12}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 6}}><input type="radio" name="retired" defaultValue="Yes" required />
                  Yes</label>
                <label style={{display: 'flex', alignItems: 'center', gap: 6}}><input type="radio" name="retired" defaultValue="No" required />
                  No</label>
              </div>
            </div>
            <div>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>Date of Birth <span style={{color: 'red'}}>*</span></label>
              <input type="date" style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>Please describe your portfolio: Assets, type of accounts,
                approximate market values, etc.
                <span style={{color: 'red'}}>*</span></label>
              <textarea rows={3} style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required defaultValue={""} />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{fontSize: 13, fontWeight: 'bold', color: '#444'}}>What are some of your biggest concerns regarding your
                portfolio and retirement?
                <span style={{color: 'red'}}>*</span></label>
              <textarea rows={3} style={{width: '100%', padding: 12, border: '1px solid #ccc', borderRadius: 4, marginTop: 6}} required defaultValue={""} />
            </div>
            <div style={{gridColumn: '1 / -1', marginTop: 10}}>
              <Button type="button" style={{width: '100%', justifyContent: 'center', height: 48, fontSize: 16}}>
                REQUEST INFORMATION NOW
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
      );
}
