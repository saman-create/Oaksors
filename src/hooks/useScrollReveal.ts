import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".scroll-reveal");

    const revealVisibleElements = () => {
      elements.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top <= window.innerHeight * 0.9 && bounds.bottom >= 0) {
          element.classList.add("visible");
        }
      });
    };

    const supportsIntersectionObserver = typeof window.IntersectionObserver === "function";

    if (!supportsIntersectionObserver) {
      revealVisibleElements();
      window.addEventListener("scroll", revealVisibleElements, { passive: true });
      return () => window.removeEventListener("scroll", revealVisibleElements);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));
    revealVisibleElements();
    window.addEventListener("scroll", revealVisibleElements, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealVisibleElements);
    };
  }, []);
}
