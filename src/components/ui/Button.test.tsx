import { render, screen } from "@testing-library/react";
import { Button, ButtonLink } from "./Button";

describe("ButtonLink", () => {
  it("keeps Oaksors styling while exposing an accessible link contract", () => {
    render(
      <ButtonLink href="/get-started-now/" size="lg">
        Get Started Now
      </ButtonLink>,
    );

    const link = screen.getByRole("link", { name: "Get Started Now" });
    expect(link).toHaveAttribute("href", "/get-started-now/");
    expect(link).toHaveClass("btn", "btn-primary", "btn-lg");
  });

  it("renders a real submit button for the qualification form", () => {
    render(<Button type="submit">See if I qualify</Button>);

    expect(screen.getByRole("button", { name: /see if i qualify/i })).toHaveAttribute("type", "submit");
  });
});
