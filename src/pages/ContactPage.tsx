import { PageHero } from "@/components/common/PageHero";
import { DisabledFormNotice } from "@/components/forms/DisabledFormNotice";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { usePageMeta } from "@/hooks/usePageMeta";

const contactCards = [
  { label: "Customer service", value: "(855) 612-5017", href: "tel:8556125017", note: "Monday–Friday, 8am–5pm PST" },
  { label: "Email", value: "info@oaksorsllc.com", href: "mailto:info@oaksorsllc.com", note: "General questions and support" },
  { label: "Fax line", value: "(562) 309-8909", href: "tel:5623098909", note: "For requested documents only" },
];

export function ContactPage() {
  usePageMeta("Contact Oaksors", "Call, email, or visit Oaksors in Long Beach, California, and preview the retirement qualification inquiry.");
  return (
    <main className="conversion-page">
      <PageHero compact eyebrow="Contact us" title={<>Real people. Clear answers. <em>No runaround.</em></>} description="Whether you are comparing options or ready to discuss an existing retirement account, our team is here to help you understand the next step." />

      <section className="mp-section mp-section--soft inquiry-section inquiry-section--early">
        <div className="container inquiry-grid">
          <div className="mp-form-card">
            <DisabledFormNotice />
            <form aria-label="Disabled account qualification form">
              <fieldset disabled>
                <div className="mp-form-grid">
                  <FormField label="First name" name="firstName" autoComplete="given-name" />
                  <FormField label="Last name" name="lastName" autoComplete="family-name" />
                  <FormField label="Cell phone" name="phone" type="tel" autoComplete="tel" />
                  <FormField label="Email address" name="email" type="email" autoComplete="email" />
                  <FormField label="Retirement status" name="retired"><select id="retired" name="retired" defaultValue=""><option value="">Select an option</option><option>Retired</option><option>Not retired</option></select></FormField>
                  <FormField label="Date of birth" name="dob" type="date" />
                  <TextAreaField label="Please describe your portfolio: assets, account types, and approximate values." name="portfolio" />
                  <TextAreaField label="What are your biggest concerns about your portfolio and retirement?" name="concerns" />
                </div>
                <button type="button" className="btn btn-primary btn-lg" disabled>Submission unavailable</button>
              </fieldset>
            </form>
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
