import { render, screen, within } from "@testing-library/react";
import { IraJourney } from "@/components/sections/IraJourney";

describe("IraJourney", () => {
  it("presents only the client's three-step precious-metals journey", () => {
    render(<IraJourney />);

    const journey = screen.getByRole("region", { name: "Your precious metals IRA journey" });
    const steps = within(journey).getAllByRole("listitem");

    expect(steps).toHaveLength(3);
    expect(within(steps[0]).getByRole("heading", { name: "Open SD IRA" })).toBeInTheDocument();
    expect(within(steps[1]).getByRole("heading", { name: "Fund The Account" })).toBeInTheDocument();
    expect(within(steps[2]).getByRole("heading", { name: "Wealth Preservation Begins" })).toBeInTheDocument();
    expect(journey.querySelectorAll(".ira-journey-connector")).toHaveLength(2);
    expect(journey.querySelector(".ira-journey-rail")).toBeNull();
    expect(within(journey).queryByText(/^start$/i)).not.toBeInTheDocument();
    expect(within(journey).queryByText(/^finish$/i)).not.toBeInTheDocument();
  });
});
