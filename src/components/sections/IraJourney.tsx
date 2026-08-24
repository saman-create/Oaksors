import { useEffect, useRef, useState } from "react";

const journeySteps = [
  {
    title: "Open the IRA",
    text: "Establish a self-directed IRA with an approved custodian and complete the account paperwork.",
  },
  {
    title: "Fund the account",
    text: "Coordinate an eligible transfer, rollover, or cash contribution into the new account.",
  },
  {
    title: "Choose eligible metals",
    text: "Review IRA-eligible products, pricing, and risk before selecting what fits your strategy.",
  },
  {
    title: "Confirm secure storage",
    text: "Select an approved depository and complete the required storage elections.",
  },
  {
    title: "Authorize the purchase",
    text: "Review and sign the purchase direction and supporting transaction paperwork.",
  },
  {
    title: "Settle and record",
    text: "The custodian coordinates payment while the dealer and depository complete delivery and verification.",
  },
] as const;

function FinishMark() {
  return (
    <svg viewBox="0 0 72 54" aria-hidden="true">
      <path d="M13 38h46l-7 11H20l-7-11Z" />
      <path d="M23 24h26l5 14H18l5-14Z" />
      <path d="M36 4v10M19 10l6 8M53 10l-6 8" />
    </svg>
  );
}

function shouldShowWithoutObserver() {
  if (typeof window === "undefined") return false;

  const prefersReducedMotion = typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return prefersReducedMotion || typeof window.IntersectionObserver !== "function";
}

export function IraJourney() {
  const journeyRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(shouldShowWithoutObserver);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey || isVisible) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setIsVisible(true);
      observer.disconnect();
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });

    observer.observe(journey);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      ref={journeyRef}
      className={`ira-journey${isVisible ? " is-visible" : ""}`}
      aria-label="Your precious metals IRA journey"
    >
      <div className="ira-journey-start">
        <span>Start</span>
        <p>Six coordinated steps</p>
      </div>

      <div className="ira-journey-track">
        <span className="ira-journey-rail" aria-hidden="true"><i /></span>
        <ol className="ira-journey-list">
          {journeySteps.map((step, index) => (
            <li className="ira-journey-step" key={step.title}>
              <span className="ira-journey-node" aria-hidden="true">{index + 1}</span>
              <div>
                <span className="ira-journey-label">Step {index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="ira-journey-finish">
        <div className="ira-journey-finish-mark"><FinishMark /></div>
        <div>
          <span>Finish</span>
          <h3>Your metals are held within your IRA.</h3>
          <p>The custodian maintains the account record while an approved depository safeguards the physical assets.</p>
        </div>
      </div>
    </section>
  );
}
