import type { FormEvent } from "react";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { DateOfBirthField } from "@/components/forms/DateOfBirthField";
import { FormStatus } from "@/components/forms/FormStatus";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCrmSubmission } from "@/hooks/useCrmSubmission";
import type { RetirementIntakeSubmission } from "@/services/crmApi";
import { toIsoDob } from "@/utils/dateOfBirth";

const accountTypes = ["Traditional IRA", "Roth IRA", "401(k)", "403(b)", "TSP", "SEP IRA", "Annuity", "Other"];
const maritalStatuses = ["married", "not_married", "divorced", "widowed"] as const;
type MaritalStatus = (typeof maritalStatuses)[number];

function isMaritalStatus(value: string): value is MaritalStatus {
  return maritalStatuses.some((status) => status === value);
}

function formatSsn(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!/^(?!000|666|9\d{2})\d{3}(?!00)\d{2}(?!0000)\d{4}$/.test(digits)) return null;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function GetStartedPage() {
  const submission = useCrmSubmission("retirement-intake-submissions");
  usePageMeta("Get Started | Oaksors", "Review the information needed to begin a precious-metals IRA conversation with Oaksors.");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const dob = toIsoDob(String(data.get("dob") ?? "").trim());
    if (!dob) { submission.setClientErrors({ dob: "Enter a valid past date in MM/DD/YYYY format." }); return; }
    const ssn = formatSsn(String(data.get("ssn") ?? "").trim());
    if (!ssn) { submission.setClientErrors({ ssn: "Enter a valid Social Security number using 9 digits." }); return; }
    const maritalStatus = String(data.get("married") ?? "");
    if (!isMaritalStatus(maritalStatus)) { submission.setClientErrors({ married: "Select a marital status." }); return; }
    const accountTypes = data.getAll("accountTypes").map(String);
    if (!accountTypes.length) { submission.setClientErrors({ accountTypes: "Select at least one account type." }); return; }
    const notes = String(data.get("notes") ?? "").trim();
    const payload: RetirementIntakeSubmission = { firstName: String(data.get("firstName") ?? "").trim(), lastName: String(data.get("lastName") ?? "").trim(), dob, ssn, phone: String(data.get("phone") ?? "").trim(), email: String(data.get("email") ?? "").trim(), address: String(data.get("address") ?? "").trim(), married: maritalStatus, portfolioValue: String(data.get("portfolioValue") ?? ""), accountTypes, ...(notes ? { notes } : {}), privacyConsent: true };
    if (await submission.submit(payload)) form.reset();
  }
  return (
    <main className="conversion-page">
      <PageHero compact eyebrow="Get started" title={<>Prepare today. Move forward <em>with confidence.</em></>} description="Share the account information needed to begin a precious-metals IRA conversation. Never include a password or account statement in this form." />

      <section className="mp-section mp-section--soft start-form-section start-form-section--early">
        <div className="container">
          <div className="start-form-layout">
            <div className="mp-form-card">
              {submission.phase === "success" ? (
                <FormStatus phase="success" successTitle="Your intake has been sent." onReset={submission.clearFeedback} />
              ) : <form aria-label="Retirement account intake form" onSubmit={handleSubmit} onInput={submission.clearFeedback}>
                <fieldset disabled={submission.isSubmitting}>
                  <p className="mp-required-hint"><span className="mp-required-mark" aria-hidden="true">*</span> Required fields</p>
                  <div className="mp-form-grid">
                    <FormField label="First name" name="firstName" autoComplete="given-name" required error={submission.fieldErrors.firstName} />
                    <FormField label="Last name" name="lastName" autoComplete="family-name" required error={submission.fieldErrors.lastName} />
                    <DateOfBirthField error={submission.fieldErrors.dob} />
                    <FormField label="SSN / Tax ID" name="ssn" type="text" inputMode="numeric" autoComplete="off" placeholder="123-45-6789" minLength={9} maxLength={11} pattern="[0-9]{3}-?[0-9]{2}-?[0-9]{4}" title="Enter 9 digits, with or without dashes." required error={submission.fieldErrors.ssn} />
                    <FormField label="Email address" name="email" type="email" autoComplete="email" required error={submission.fieldErrors.email} />
                    <FormField label="Cell phone" name="phone" type="tel" autoComplete="tel" required error={submission.fieldErrors.phone} />
                    <FormField label="Full address" name="address" autoComplete="street-address" full required error={submission.fieldErrors.address} />
                    <FormField label="Marital status" name="married" required error={submission.fieldErrors.married}><select id="married" name="married" defaultValue="" required aria-invalid={Boolean(submission.fieldErrors.married)} aria-describedby={submission.fieldErrors.married ? "married-error" : undefined}><option value="">Select an option</option><option value="married">Married</option><option value="not_married">Not married</option><option value="divorced">Divorced</option><option value="widowed">Widowed</option></select></FormField>
                    <FormField label="Approximate portfolio value" name="portfolioValue" required error={submission.fieldErrors.portfolioValue}><select id="portfolioValue" name="portfolioValue" defaultValue="" required aria-invalid={Boolean(submission.fieldErrors.portfolioValue)} aria-describedby={submission.fieldErrors.portfolioValue ? "portfolioValue-error" : undefined}><option value="">Select a range</option><option value="under-100000">Under $100,000</option><option value="100000-250000">$100,000–$250,000</option><option value="250000-500000">$250,000–$500,000</option><option value="500000-1000000">$500,000–$1,000,000</option><option value="1000000-plus">$1,000,000+</option></select></FormField>
                    <fieldset className="mp-check-group mp-field--full" aria-required="true" aria-describedby={submission.fieldErrors.accountTypes ? "accountTypes-error" : undefined}><legend>Please select all account types that apply<span className="mp-required-mark" aria-hidden="true" /></legend><div>{accountTypes.map((type) => <label key={type}><input type="checkbox" name="accountTypes" value={type} /> {type}</label>)}</div>{submission.fieldErrors.accountTypes && <small id="accountTypes-error" className="mp-field-error">{submission.fieldErrors.accountTypes}</small>}</fieldset>
                    <TextAreaField label="Any other information you would like to provide (optional)" name="notes" maxLength={2000} error={submission.fieldErrors.notes} />
                    <label className="form-consent mp-field--full"><input type="checkbox" name="privacyConsent" required /> <span>I agree to the <a href="/privacy-notice/">privacy notice</a> and consent to being contacted about this request.<span className="mp-required-mark" aria-hidden="true" /></span></label>
                  </div>
                  <FormStatus phase={submission.phase} />
                  <button type="submit" className="btn btn-primary btn-lg form-submit-button">{submission.isSubmitting ? "Submitting…" : "Submit"}</button>
                </fieldset>
              </form>}
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
