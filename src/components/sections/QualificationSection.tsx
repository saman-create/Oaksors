import type { FormEvent } from "react";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { DateOfBirthField } from "@/components/forms/DateOfBirthField";
import { ConsentField } from "@/components/forms/ConsentField";
import { FormStatus } from "@/components/forms/FormStatus";
import { useCrmSubmission } from "@/hooks/useCrmSubmission";
import type { QualificationSubmission } from "@/services/crmApi";
import { toIsoDob } from "@/utils/dateOfBirth";

export function QualificationSection() {
  const submission = useCrmSubmission("qualification-submissions");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const dob = toIsoDob(String(data.get("dob") ?? ""));
    if (!dob) { submission.setClientErrors({ dob: "Enter a valid past date of birth." }); return; }
    const payload: QualificationSubmission = {
      firstName: String(data.get("firstName") ?? "").trim(), lastName: String(data.get("lastName") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(), email: String(data.get("email") ?? "").trim(),
      retired: data.get("retired") === "retired" ? "retired" : "not_retired", dob,
      portfolio: String(data.get("portfolio") ?? "").trim(), concerns: String(data.get("concerns") ?? "").trim(),
      sourcePage: "home", privacyConsent: true,
    };
    if (await submission.submit(payload)) form.reset();
  }
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
          {submission.phase === "success" ? (
            <FormStatus phase="success" successTitle="Your request has been sent." onReset={submission.clearFeedback} />
          ) : <form aria-label="Account qualification form" onSubmit={handleSubmit} onInvalid={submission.handleInvalid} onInput={submission.handleInput}>
            <fieldset disabled={submission.isSubmitting}>
              <div className="mp-form-grid">
                <FormField label="First name" name="firstName" autoComplete="given-name" required error={submission.fieldErrors.firstName} />
                <FormField label="Last name" name="lastName" autoComplete="family-name" required error={submission.fieldErrors.lastName} />
                <FormField label="Cell phone" name="phone" type="tel" autoComplete="tel" required error={submission.fieldErrors.phone} />
                <FormField label="Email Address" name="email" type="email" autoComplete="email" required error={submission.fieldErrors.email} />
                <FormField label="Retirement status" name="retired" required error={submission.fieldErrors.retired}><select id="retired" name="retired" defaultValue="" required aria-invalid={Boolean(submission.fieldErrors.retired)} aria-describedby={submission.fieldErrors.retired ? "retired-error" : undefined}><option value="">Select an option</option><option value="retired">Retired</option><option value="not_retired">Not retired</option></select></FormField>
                <DateOfBirthField error={submission.fieldErrors.dob} />
                <TextAreaField label="Please describe your portfolio: assets, account types, and approximate values." name="portfolio" required maxLength={2000} error={submission.fieldErrors.portfolio} />
                <TextAreaField label="What are your biggest concerns about your portfolio and retirement?" name="concerns" required maxLength={2000} error={submission.fieldErrors.concerns} />
                <ConsentField error={submission.fieldErrors.privacyConsent} />
              </div>
              <FormStatus phase={submission.phase} />
              <button type="submit" className="btn btn-primary btn-lg form-submit-button">{submission.isSubmitting ? "SENDING…" : "REQUEST INFORMATION NOW"}</button>
            </fieldset>
          </form>}
        </div>
      </div>
    </section>
      );
}
