import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { App } from "./App";

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("Oaksors routed pages", () => {
  afterEach(() => { window.history.pushState({}, "", "/"); vi.unstubAllGlobals(); });

  it("renders the reusable article template at the API slug route", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ articles: [{
      slug: "will-gold-prices-hit-all-time-highs-again-in-2026",
      title: "Will gold prices hit all-time highs again in 2026?",
      excerpt: "Gold market outlook",
      publishedAt: "2026-08-06T18:08:03Z",
      category: "Market outlook",
      image: "https://images.example.com/gold.jpg",
      imageAlt: "Gold bars",
      readTime: "4 min read",
      body: "Gold market context.",
      sourceType: "wordpress",
    }] }))));
    renderAt("/news/will-gold-prices-hit-all-time-highs-again-in-2026/");
    expect(await screen.findByRole("heading", { level: 1, name: /will gold prices hit all-time highs again/i })).toBeInTheDocument();
    expect(screen.queryByText(/key takeaways/i)).not.toBeInTheDocument();
  });

  it("keeps the contact qualification form disabled", () => {
    renderAt("/contact-us/");
    const form = screen.getByRole("form", { name: /disabled account qualification form/i });
    expect(form.querySelector("fieldset")).toBeDisabled();
    expect(screen.getByText(/no information entered here is collected/i)).toBeInTheDocument();
  });

  it("keeps the sensitive onboarding form disabled", () => {
    renderAt("/get-started-now/");
    const form = screen.getByRole("form", { name: /disabled retirement account intake form/i });
    expect(form.querySelector("fieldset")).toBeDisabled();
    expect(screen.getByRole("button", { name: /secure submission unavailable/i })).toBeDisabled();
  });

  it("routes every homepage Get Started Now CTA to the onboarding page", () => {
    renderAt("/");

    expect(screen.getAllByRole("link", { name: /get started now/i })).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: /get started now/i }).every((link) => link.getAttribute("href") === "/get-started-now/")).toBe(true);
  });

  it("re-registers homepage reveal sections after navigating away and back", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(screen.getAllByRole("link", { name: "News" })[0]);
    await user.click(screen.getAllByRole("link", { name: "Home" })[0]);

    const revealElement = document.querySelector<HTMLElement>(".scroll-reveal");
    expect(revealElement).not.toBeNull();
    expect(revealElement).toHaveClass("visible");
  });
});
