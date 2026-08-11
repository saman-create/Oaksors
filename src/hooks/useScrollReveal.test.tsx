import { render, screen } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

class IdleIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function RevealFixture() {
  useScrollReveal();
  return <div className="scroll-reveal" data-testid="reveal-target" />;
}

describe("useScrollReveal", () => {
  it("reveals visible content on scroll even when IntersectionObserver misses the transition", () => {
    vi.stubGlobal("IntersectionObserver", IdleIntersectionObserver);
    render(<RevealFixture />);

    const target = screen.getByTestId("reveal-target");
    target.getBoundingClientRect = () => ({
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });

    window.dispatchEvent(new Event("scroll"));

    expect(target).toHaveClass("visible");
    vi.unstubAllGlobals();
  });
});
