import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroSection } from "@/components/sections/HeroSection";

const HERO_HEADING = "Roll over your IRA into precious metals.";
const NEUTRAL_VIDEO_TRANSFORM = "perspective(1200px) translate3d(0.00px, 0.00px, 0) rotateX(0.000deg) rotateY(0.000deg) scale(1.12)";

vi.mock("@/components/effects/Scanner", () => ({
  default: () => <div aria-hidden="true" />,
}));

vi.mock("@/components/effects/FloatingLines", () => ({
  default: () => <div aria-hidden="true" />,
}));

vi.mock("hls.js", () => ({
  default: class MockHls {
    static isSupported() {
      return false;
    }
  },
}));

function renderHero() {
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );

  const hero = screen.getByRole("heading", { name: HERO_HEADING }).closest("section");
  if (!hero) throw new Error("Expected the hero heading to be inside a section");

  Object.defineProperty(hero, "getBoundingClientRect", {
    value: () => ({
      x: 0,
      y: 0,
      top: 0,
      right: 1000,
      bottom: 800,
      left: 0,
      width: 1000,
      height: 800,
      toJSON: () => ({}),
    }),
  });

  return hero;
}

function installAnimationFrameQueue() {
  const animationFrames: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    animationFrames.push(callback);
    return animationFrames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  return animationFrames;
}

function installMatchMedia(matches: (media: string) => boolean) {
  vi.stubGlobal("matchMedia", (media: string): MediaQueryList => ({
    matches: matches(media),
    media,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("HeroSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the original hero while the alternate version controls are hidden", () => {
    renderHero();

    expect(screen.getByTestId("hero-original-background")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gold bars and coins" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: HERO_HEADING })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Hero version" })).not.toBeInTheDocument();
  });

  it("strongly pans the original video background toward the mouse", () => {
    const animationFrames = installAnimationFrameQueue();
    const hero = renderHero();

    fireEvent.mouseMove(hero, { clientX: 1000, clientY: 0 });
    expect(animationFrames).toHaveLength(1);
    animationFrames.shift()?.(0);

    const motionLayer = screen.getByTestId("hero-video-motion-layer");
    expect(motionLayer.style.transform).toContain("translate3d(5.40px, -3.00px, 0)");

    for (let frame = 1; frame <= 200 && animationFrames.length > 0; frame += 1) {
      animationFrames.shift()?.(frame * 16);
    }

    expect(motionLayer.style.transform).toBe(
      "perspective(1200px) translate3d(36.00px, -20.00px, 0) rotateX(2.700deg) rotateY(3.000deg) scale(1.12)",
    );
  });

  it("eases the video background back to center when the mouse leaves", () => {
    const animationFrames = installAnimationFrameQueue();
    const hero = renderHero();

    fireEvent.mouseMove(hero, { clientX: 1000, clientY: 0 });
    animationFrames.shift()?.(0);
    fireEvent.mouseLeave(hero);

    for (let frame = 1; frame <= 200 && animationFrames.length > 0; frame += 1) {
      animationFrames.shift()?.(frame * 16);
    }

    expect(screen.getByTestId("hero-video-motion-layer").style.transform).toBe(NEUTRAL_VIDEO_TRANSFORM);
  });

  it("keeps the video still when reduced motion is preferred", () => {
    const animationFrames = installAnimationFrameQueue();
    installMatchMedia((media) => media === "(prefers-reduced-motion: reduce)");
    const hero = renderHero();

    fireEvent.mouseMove(hero, { clientX: 1000, clientY: 0 });

    expect(animationFrames).toHaveLength(0);
    expect(screen.getByTestId("hero-video-motion-layer").style.transform).toBe("");
  });

  it("keeps the video still on devices without a fine hover pointer", () => {
    const animationFrames = installAnimationFrameQueue();
    installMatchMedia(() => false);
    const hero = renderHero();

    fireEvent.mouseMove(hero, { clientX: 1000, clientY: 0 });

    expect(animationFrames).toHaveLength(0);
    expect(screen.getByTestId("hero-video-motion-layer").style.transform).toBe("");
  });
});
