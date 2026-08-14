import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DisabledFormNotice } from "@/components/forms/DisabledFormNotice";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { usePageMeta } from "@/hooks/usePageMeta";

const accountTypes = ["Traditional IRA", "Roth IRA", "401(k)", "403(b)", "TSP", "SEP IRA", "Annuity", "Other"];

export function GetStartedPage() {
  usePageMeta("Get Started | Oaksors", "Review the information needed to begin a precious-metals IRA conversation with Oaksors.");
  return (
    <main className="conversion-page">
      <PageHero compact eyebrow="Get started" title={<>Prepare today. Move forward <em>with confidence.</em></>} description="Review what is typically needed to begin a precious-metals IRA conversation. For your protection, online submission is disabled until a secure intake service is connected." />

      <section className="mp-section mp-section--soft start-form-section start-form-section--early">
        <div className="container">
          <div className="start-form-layout">
            <div className="mp-form-card">
              <DisabledFormNotice />
              <form aria-label="Disabled retirement account intake form">
                <fieldset disabled>
                  <div className="mp-form-grid">
                    <FormField label="First name" name="firstName" />
                    <FormField label="Last name" name="lastName" />
                    <FormField label="Date of birth" name="dob" type="date" />
                    <FormField label="Tax ID / SSN" name="taxId" type="password" autoComplete="off" placeholder="Not accepted online" />
                    <FormField label="Cell phone" name="phone" type="tel" />
                    <FormField label="Email address" name="email" type="email" />
                    <FormField label="Full address" name="address" autoComplete="street-address" full />
                    <FormField label="Marital status" name="married"><select id="married" name="married" defaultValue=""><option value="">Select an option</option><option>Married</option><option>Not married</option></select></FormField>
                    <FormField label="Approximate portfolio value" name="portfolioValue" />
                    <fieldset className="mp-check-group mp-field--full"><legend>Please select all account types that apply</legend><div>{accountTypes.map((type) => <label key={type}><input type="checkbox" /> {type}</label>)}</div></fieldset>
                    <TextAreaField label="Any other information you would like to provide" name="notes" />
                    <FormField label="Statement PDF" name="statement" type="file" accept="application/pdf" full />
                  </div>
                  <button type="button" className="btn btn-primary btn-lg" disabled>Secure submission unavailable</button>
                </fieldset>
              </form>
            </div>

            <div className="start-inline-divider" aria-hidden="true" />

            <aside className="start-intro-inline">
              <SectionHeading eyebrow="What to expect" title="Protect your retirement with a process you can understand." description="A specialist can help identify the right paperwork, coordinate custodian conversations, and explain each stage before anything moves." />
              <ol className="start-steps">
                <li><span>01</span><div><h3>Review</h3><p>Gather a recent account statement and basic account details.</p></div></li>
                <li><span>02</span><div><h3>Discuss</h3><p>Talk through eligibility, objectives, risks, and available account structures.</p></div></li>
                <li><span>03</span><div><h3>Coordinate</h3><p>Complete approved custodian paperwork through the secure process provided by your specialist.</p></div></li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="start-contact-strip">
        <div className="container start-contact-grid">
          <div><span>Required statement and ID</span><a href="mailto:IRA@oaksorsllc.com">IRA@oaksorsllc.com</a></div>
          <div><span>Text</span><a href="tel:5624735334">(562) 473-5334</a></div>
          <div><span>Fax</span><a href="tel:5623098909">(562) 309-8909</a></div>
        </div>
      </section>

    </main>
  );
}
