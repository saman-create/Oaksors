import { useEffect, useRef, useState } from "react";

const journeySteps = [
  {
    title: "Open SD IRA",
    text: "Establish a self-directed IRA with an approved custodian and complete the account paperwork.",
  },
  {
    title: "Fund The Account",
    text: "Coordinate an eligible transfer, rollover, or cash contribution into the new account.",
  },
  {
    title: "Wealth Preservation Begins",
    text: "Use the funded account to acquire eligible precious metals held in approved secure storage for your long-term strategy.",
  },
] as const;

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
      <div className="ira-journey-track">
        <ol className="ira-journey-list">
          {journeySteps.map((step, index) => (
            <li className="ira-journey-step" key={step.title}>
              {index < journeySteps.length - 1 && <span className="ira-journey-connector" aria-hidden="true"><i /></span>}
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
    </section>
  );
}
