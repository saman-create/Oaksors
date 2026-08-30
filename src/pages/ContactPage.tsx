import type { FormEvent } from "react";
import { PageHero } from "@/components/common/PageHero";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { ConsentField } from "@/components/forms/ConsentField";
import { FormStatus } from "@/components/forms/FormStatus";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCrmSubmission } from "@/hooks/useCrmSubmission";
import type { EmailSubmission } from "@/services/crmApi";

const contactCards = [
  { label: "Customer service", value: "(855) 612-5017", href: "tel:8556125017", note: "Monday–Friday, 8am–5pm PST" },
  { label: "Email", value: "info@oaksorsllc.com", href: "mailto:info@oaksorsllc.com", note: "General questions and support" },
  { label: "Fax line", value: "(562) 309-8909", href: "tel:5623098909", note: "For requested documents only" },
];

export function ContactPage() {
  const submission = useCrmSubmission("email-submissions");
  usePageMeta("Contact Oaksors", "Call, email, visit, or send a message to the Oaksors team in Long Beach, California.");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    const payload: EmailSubmission = { firstName: String(data.get("firstName") ?? "").trim(), lastName: String(data.get("lastName") ?? "").trim(), email: String(data.get("email") ?? "").trim(), ...(phone ? { phone } : {}), subject: String(data.get("subject") ?? "").trim(), message: String(data.get("message") ?? "").trim(), sourcePage: "contact", privacyConsent: true };
    if (await submission.submit(payload)) form.reset();
  }
  return (
    <main className="conversion-page">
      <PageHero compact eyebrow="Contact us" title={<>Real people. Clear answers. <em>No runaround.</em></>} description="Whether you are comparing options or ready to discuss an existing retirement account, our team is here to help you understand the next step." />

      <section className="mp-section mp-section--soft inquiry-section inquiry-section--early">
        <div className="container inquiry-grid">
          <div className="mp-form-card">
            {submission.phase === "success" ? (
              <FormStatus phase="success" successTitle="Your message has been sent." onReset={submission.clearFeedback} />
            ) : <form aria-label="Contact email form" onSubmit={handleSubmit} onInvalid={submission.handleInvalid} onInput={submission.handleInput}>
              <fieldset disabled={submission.isSubmitting}>
                <div className="mp-form-grid">
                  <FormField label="First name" name="firstName" autoComplete="given-name" required error={submission.fieldErrors.firstName} />
                  <FormField label="Last name" name="lastName" autoComplete="family-name" required error={submission.fieldErrors.lastName} />
                  <FormField label="Email address" name="email" type="email" autoComplete="email" required error={submission.fieldErrors.email} />
                  <FormField label="Cell phone (optional)" name="phone" type="tel" autoComplete="tel" error={submission.fieldErrors.phone} />
                  <FormField label="Subject" name="subject" full required maxLength={160} error={submission.fieldErrors.subject} />
                  <TextAreaField label="Message" name="message" required maxLength={4000} error={submission.fieldErrors.message} />
                  <ConsentField error={submission.fieldErrors.privacyConsent} />
                </div>
                <FormStatus phase={submission.phase} />
                <button type="submit" className="btn btn-primary btn-lg form-submit-button">{submission.isSubmitting ? "Sending…" : "Send message"}</button>
              </fieldset>
            </form>}
          </div>
          <aside className="contact-info-panel">
            <p className="page-eyebrow">Hours of operation</p>
            <h2>Monday–Friday</h2>
            <p className="contact-info-muted">8am–5pm PST</p>

            <div className="contact-info-divider" />

            <p className="page-eyebrow">Visit Oaksors</p>
            <h2>Long Beach, California</h2>
            <address>111 W Ocean Blvd.<br />Suite 400<br />Long Beach, CA 90802</address>
            <a className="text-link" href="https://maps.google.com/?q=111+W+Ocean+Blvd+400+Long+Beach+CA+90802" target="_blank" rel="noreferrer">Open in maps <span aria-hidden="true">↗</span></a>

            <div className="contact-info-divider" />

            <p className="page-eyebrow">Need a direct answer?</p>
            <p className="contact-info-muted">Call <a href="tel:8556125017">(855) 612-5017</a> or email <a href="mailto:info@oaksorsllc.com">info@oaksorsllc.com</a>.</p>
          </aside>
        </div>
      </section>

      <section className="contact-band">
        <div className="container contact-card-grid">
          {contactCards.map((card) => <article key={card.label}><p>{card.label}</p><a href={card.href}>{card.value}</a><span>{card.note}</span></article>)}
        </div>
      </section>

    </main>
  );
}
