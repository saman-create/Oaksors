import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("Oaksors routed pages", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("renders the reusable article template at the API slug route", async () => {
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
