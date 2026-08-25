import type { FormEvent } from "react";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { FormStatus } from "@/components/forms/FormStatus";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCrmSubmission } from "@/hooks/useCrmSubmission";
import type { RetirementIntakeSubmission } from "@/services/crmApi";

const accountTypes = ["Traditional IRA", "Roth IRA", "401(k)", "403(b)", "TSP", "SEP IRA", "Annuity", "Other"];

export function GetStartedPage() {
  const submission = useCrmSubmission("retirement-intake-submissions");
  usePageMeta("Get Started | Oaksors", "Review the information needed to begin a precious-metals IRA conversation with Oaksors.");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const accountTypes = data.getAll("accountTypes").map(String);
    if (!accountTypes.length) { submission.setClientErrors({ accountTypes: "Select at least one account type." }); return; }
    const notes = String(data.get("notes") ?? "").trim();
    const payload: RetirementIntakeSubmission = { firstName: String(data.get("firstName") ?? "").trim(), lastName: String(data.get("lastName") ?? "").trim(), dob: String(data.get("dob") ?? ""), phone: String(data.get("phone") ?? "").trim(), email: String(data.get("email") ?? "").trim(), address: String(data.get("address") ?? "").trim(), married: data.get("married") === "married" ? "married" : "not_married", portfolioValue: String(data.get("portfolioValue") ?? ""), accountTypes, ...(notes ? { notes } : {}), privacyConsent: true };
    if (await submission.submit(payload)) form.reset();
  }
  return (
    <main className="conversion-page">
      <PageHero compact eyebrow="Get started" title={<>Prepare today. Move forward <em>with confidence.</em></>} description="Share the basic account information needed to begin a precious-metals IRA conversation. Never include an SSN, Tax ID, password, or account statement in this form." />

      <section className="mp-section mp-section--soft start-form-section start-form-section--early">
        <div className="container">
          <div className="start-form-layout">
            <div className="mp-form-card">
              <form aria-label="Retirement account intake form" onSubmit={handleSubmit} onInput={submission.clearFeedback}>
                <fieldset disabled={submission.isSubmitting}>
                  <div className="mp-form-grid">
                    <FormField label="First name" name="firstName" autoComplete="given-name" required error={submission.fieldErrors.firstName} />
                    <FormField label="Last name" name="lastName" autoComplete="family-name" required error={submission.fieldErrors.lastName} />
                    <FormField label="Date of birth" name="dob" type="date" required error={submission.fieldErrors.dob} />
                    <FormField label="Cell phone" name="phone" type="tel" autoComplete="tel" required error={submission.fieldErrors.phone} />
                    <FormField label="Email address" name="email" type="email" autoComplete="email" required error={submission.fieldErrors.email} />
                    <FormField label="Full address" name="address" autoComplete="street-address" full required error={submission.fieldErrors.address} />
                    <FormField label="Marital status" name="married" error={submission.fieldErrors.married}><select id="married" name="married" defaultValue="" required aria-invalid={Boolean(submission.fieldErrors.married)} aria-describedby={submission.fieldErrors.married ? "married-error" : undefined}><option value="">Select an option</option><option value="married">Married</option><option value="not_married">Not married</option></select></FormField>
                    <FormField label="Approximate portfolio value" name="portfolioValue" error={submission.fieldErrors.portfolioValue}><select id="portfolioValue" name="portfolioValue" defaultValue="" required aria-invalid={Boolean(submission.fieldErrors.portfolioValue)} aria-describedby={submission.fieldErrors.portfolioValue ? "portfolioValue-error" : undefined}><option value="">Select a range</option><option value="under-100000">Under $100,000</option><option value="100000-250000">$100,000–$250,000</option><option value="250000-500000">$250,000–$500,000</option><option value="500000-1000000">$500,000–$1,000,000</option><option value="1000000-plus">$1,000,000+</option></select></FormField>
                    <fieldset className="mp-check-group mp-field--full" aria-describedby={submission.fieldErrors.accountTypes ? "accountTypes-error" : undefined}><legend>Please select all account types that apply</legend><div>{accountTypes.map((type) => <label key={type}><input type="checkbox" name="accountTypes" value={type} /> {type}</label>)}</div>{submission.fieldErrors.accountTypes && <small id="accountTypes-error" className="mp-field-error">{submission.fieldErrors.accountTypes}</small>}</fieldset>
                    <TextAreaField label="Any other information you would like to provide" name="notes" maxLength={2000} error={submission.fieldErrors.notes} />
                    <label className="form-consent mp-field--full"><input type="checkbox" name="privacyConsent" required /> <span>I agree to the <a href="/privacy-notice/">privacy notice</a> and consent to being contacted about this request.</span></label>
                  </div>
                  <FormStatus phase={submission.phase} />
                  <button type="submit" className="btn btn-primary btn-lg">{submission.isSubmitting ? "Submitting…" : "Submit retirement intake"}</button>
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
