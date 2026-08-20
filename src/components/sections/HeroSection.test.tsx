import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { HeroSection } from "@/components/sections/HeroSection";

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

describe("HeroSection variants", () => {
  it("switches only the background while keeping the gold bars visible", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );

    const originalButton = screen.getByRole("button", { name: "Original" });
    const v1Button = screen.getByRole("button", { name: "V1" });

    expect(originalButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("hero-original-background")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gold bars and coins" })).toBeInTheDocument();

    fireEvent.click(v1Button);

    expect(v1Button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("hero-scanner-background")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-original-background")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gold bars and coins" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Roll over your IRA into precious metals." })).toBeInTheDocument();
  });

  it("shows the floating lines background for V2", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "V2" }));

    expect(screen.getByRole("button", { name: "V2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("hero-floating-lines-background")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-original-background")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gold bars and coins" })).toBeInTheDocument();
  });

});
