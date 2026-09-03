import { lazy, Suspense, type FormEvent } from "react";
import { FormField, TextAreaField } from "@/components/forms/FormField";
import { ConsentField } from "@/components/forms/ConsentField";
import { FormStatus } from "@/components/forms/FormStatus";
import { useCrmSubmission } from "@/hooks/useCrmSubmission";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { LeadInterest, LeadSubmission } from "@/services/crmApi";
import "@/styles/invest.css";

const FloatingLines = lazy(() => import("@/components/effects/FloatingLines"));

const leadInterests = ["precious_metals_ira", "gold", "silver", "rollover_guidance", "general_information"] as const;

const valueItems = [
  { title: "Understand the option", text: "Learn how a precious-metals IRA works, what may be eligible, and where the key decisions sit." },
  { title: "Coordinate the details", text: "Get help understanding rollover paperwork and the roles of the custodian, dealer, and depository." },
  { title: "Choose with context", text: "Compare physical gold and silver options with room to ask questions before taking a next step." },
];

const processSteps = [
  { title: "Share what you are exploring", text: "Tell us where you are today and what you want to understand about physical precious metals." },
  { title: "Speak with a specialist", text: "Have a direct conversation about your goals, account type, and the practical details involved." },
  { title: "Review your next steps", text: "If the approach fits, you will know which conversations and documents come next—without pressure." },
];

function isLeadInterest(value: string): value is LeadInterest {
  return leadInterests.some((interest) => interest === value);
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m4.5 10.5 3.2 3.2 7.8-8" /></svg>;
}

export function InvestPage() {
  const submission = useCrmSubmission("lead-submissions");
  usePageMeta("Invest in Precious Metals | Oaksors", "Explore precious metals for retirement and request a conversation with an Oaksors specialist.");
  useScrollReveal();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const interest = String(data.get("interest") ?? "");
    if (!isLeadInterest(interest)) {
      submission.setClientErrors({ interest: "Select what you would like to explore." });
      return;
    }

    const message = String(data.get("message") ?? "").trim();
    const payload: LeadSubmission = {
      firstName: String(data.get("firstName") ?? "").trim(),
      lastName: String(data.get("lastName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      interest,
      ...(message ? { message } : {}),
      sourcePage: "invest",
      privacyConsent: true,
    };

    if (await submission.submit(payload)) form.reset();
  }

  return (
    <main className="invest-page">
      <section className="invest-hero">
        <video className="invest-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/assets/videos/page-hero-background.mp4" type="video/mp4" />
        </video>
        <img className="invest-hero-metals" src="/assets/images/hero-gold-stack.png" alt="" aria-hidden="true" />
        <div className="container invest-hero-grid">
          <div className="invest-hero-copy">
            <h1>A more tangible path for your retirement.</h1>
            <p>Explore how eligible retirement savings can move into physical precious metals, with clear guidance at every step.</p>
            <ul className="invest-hero-points" aria-label="How Oaksors can help">
              <li><CheckIcon /> Rollover paperwork guidance</li>
              <li><CheckIcon /> Custodian coordination</li>
              <li><CheckIcon /> Physical gold and silver options</li>
            </ul>
          </div>

          <div className="mp-form-card invest-form-card">
            {submission.phase === "success" ? (
              <FormStatus phase="success" successTitle="Your request has been received." onReset={submission.clearFeedback} />
            ) : (
              <form id="invest-lead-form" aria-label="Request precious metals information" onSubmit={handleSubmit} onInvalid={submission.handleInvalid} onInput={submission.handleInput}>
                <fieldset disabled={submission.isSubmitting}>
                  <div className="invest-form-heading">
                    <h2>Start with a conversation.</h2>
                    <p>Tell us what you are exploring. An Oaksors specialist will follow up.</p>
                  </div>
                  <p className="mp-required-hint"><span className="mp-required-mark" aria-hidden="true" /> Required fields</p>
                  <div className="mp-form-grid">
                    <FormField label="First name" name="firstName" autoComplete="given-name" required error={submission.fieldErrors.firstName} />
                    <FormField label="Last name" name="lastName" autoComplete="family-name" required error={submission.fieldErrors.lastName} />
                    <FormField label="Email address" name="email" type="email" autoComplete="email" required error={submission.fieldErrors.email} />
                    <FormField label="Cell phone" name="phone" type="tel" autoComplete="tel" maxLength={30} required error={submission.fieldErrors.phone} />
                    <FormField label="What would you like to explore?" name="interest" full required error={submission.fieldErrors.interest}>
                      <select id="interest" name="interest" defaultValue="" required aria-invalid={Boolean(submission.fieldErrors.interest)} aria-describedby={submission.fieldErrors.interest ? "interest-error" : undefined}>
                        <option value="">Select an option</option>
                        <option value="precious_metals_ira">Precious metals IRA</option>
                        <option value="rollover_guidance">Rollover guidance</option>
                        <option value="gold">Physical gold</option>
                        <option value="silver">Physical silver</option>
                        <option value="general_information">General information</option>
                      </select>
                    </FormField>
                    <TextAreaField label="Anything else we should know? (optional)" name="message" rows={3} maxLength={2000} error={submission.fieldErrors.message} />
                    <ConsentField error={submission.fieldErrors.privacyConsent} />
                  </div>
                  <FormStatus phase={submission.phase} />
                  <button type="submit" className="btn btn-primary btn-lg form-submit-button invest-submit-button">{submission.isSubmitting ? "Sending…" : "Request information"}<ArrowIcon /></button>
                  <p className="invest-form-note">Submitting this form starts a conversation. It does not open or transfer an account.</p>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="invest-trust" aria-label="Trusted industry partners">
        <div className="container invest-trust-inner">
          <p>Trusted by industry leaders</p>
          <div className="invest-trust-logos">
            <img src="/assets/images/delaware-depository.webp" alt="Delaware Depository" />
            <img src="/assets/images/veteran.png" alt="Veteran Owned Business" />
            <img src="/assets/images/trustpilot.png" alt="Trustpilot" />
          </div>
        </div>
      </section>

      <section className="invest-value">
        <div className="container invest-value-grid">
          <div className="scroll-reveal invest-value-intro">
            <h2>Guidance built around your next move.</h2>
            <p>Precious metals can feel unfamiliar. Oaksors helps make the people, paperwork, and decisions easier to understand.</p>
            <a href="/precious-metals-ira/" className="invest-inline-link">Learn about precious metals IRAs <ArrowIcon /></a>
          </div>
          <div className="invest-value-list">
            {valueItems.map((item) => (
              <article className="scroll-reveal" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="invest-process">
        <div className="invest-process-background" aria-hidden="true">
          <Suspense fallback={null}>
            <FloatingLines
              enabledWaves={["bottom", "top", "middle"]}
              lineCount={[10, 15, 20]}
              lineDistance={33}
              bendRadius={10.5}
              bendStrength={1}
              interactive
              parallax
              linesGradient={["#05666a", "#043022", "#026544"]}
            />
          </Suspense>
        </div>
        <div className="container invest-process-content">
          <div className="scroll-reveal invest-process-heading">
            <h2>A clear path from questions to next steps.</h2>
            <p>The first conversation is about understanding your situation—not rushing a decision.</p>
          </div>
          <ol className="invest-process-list">
            {processSteps.map((step, index) => (
              <li className="scroll-reveal" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="invest-metals">
        <div className="container invest-metals-grid">
          <div className="scroll-reveal invest-metals-visual">
            <div className="invest-metals-image-frame">
              <img src="/assets/images/news-gold-bullion.jpg" alt="Stacked gold bullion bars" />
            </div>
            <div className="invest-metals-note">
              Eligible physical gold and silver can be held in a precious-metals IRA through an approved custodian and depository.
            </div>
          </div>
          <div className="scroll-reveal invest-metals-copy">
            <h2>Put something tangible behind the plan.</h2>
            <div className="invest-metals-details">
              <article>
                <span>01</span>
                <div><h3>Physical assets</h3><p>Choose from eligible physical gold and silver products for the account.</p></div>
              </article>
              <article>
                <span>02</span>
                <div><h3>Secure storage</h3><p>Approved depositories hold IRA-owned metals according to the account structure.</p></div>
              </article>
              <article>
                <span>03</span>
                <div><h3>Retirement-account structure</h3><p>Custodian coordination keeps the process connected to the eligible retirement account.</p></div>
              </article>
            </div>
            <a href="#invest-lead-form" className="invest-inline-link">Ask a specialist <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="invest-final-cta">
        <div className="container invest-final-cta-inner scroll-reveal">
          <h2>Start with the questions you have today.</h2>
          <p>Tell us what you are considering, and an Oaksors specialist will help you understand what comes next.</p>
          <a className="btn btn-primary btn-lg" href="#invest-lead-form">Start the conversation <ArrowIcon /></a>
        </div>
      </section>
    </main>
  );
}
