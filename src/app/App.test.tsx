import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("Oaksors landing page", () => {
  it("renders every incumbent landing-page section as accessible React content", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /roll over your ira into precious metals/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Act Now to Protect Your Retirement Wealth" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /how do i start/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /built on integrity/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Precious Metals" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /about oaksors/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Protect Your Retirement Wealth" })).toBeInTheDocument();
  });

  it("opens and closes the mobile navigation without mutating document markup", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("dialog", { name: /mobile navigation/i })).toBeVisible();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("dialog", { name: /mobile navigation/i })).not.toBeInTheDocument();
  });
});
