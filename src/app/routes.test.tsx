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
    const article = {
      slug: "will-gold-prices-hit-all-time-highs-again-in-2026",
      title: "Will gold prices hit all-time highs again in 2026?",
      excerpt: "Gold market outlook",
      publishedAt: "2026-08-06T18:08:03Z",
      category: "Market outlook",
      image: "https://images.example.com/gold.jpg",
      imageAlt: "Gold bars",
      readTime: "4 min read",
      body: "Gold market context.",
      featured: false,
      sourceType: "crm",
    };
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ article }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ articles: [], pagination: { page: 1, limit: 4, total: 0, totalPages: 0 } }), { status: 200 })));
    renderAt("/news/will-gold-prices-hit-all-time-highs-again-in-2026/");
    expect(await screen.findByRole("heading", { level: 1, name: /will gold prices hit all-time highs again/i })).toBeInTheDocument();
    expect(screen.queryByText(/key takeaways/i)).not.toBeInTheDocument();
  });

  it("renders the active contact email form", () => {
    renderAt("/contact-us/");
    const form = screen.getByRole("form", { name: /contact email form/i });
    expect(form.querySelector("fieldset")).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
  });

  it("renders the active retirement intake with the required SSN control", () => {
    renderAt("/get-started-now/");
    const form = screen.getByRole("form", { name: /retirement account intake form/i });
    expect(form.querySelector("fieldset")).not.toBeDisabled();
    expect(screen.getByLabelText("Social Security number")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Social Security number")).toBeRequired();
    expect(document.querySelector('input[type="file"]')).toBeNull();
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
