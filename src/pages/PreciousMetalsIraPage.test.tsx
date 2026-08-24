import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PreciousMetalsIraPage } from "./PreciousMetalsIraPage";

describe("PreciousMetalsIraPage", () => {
  it("replaces the Preferred Trust promotion with a six-step IRA journey", () => {
    render(
      <MemoryRouter>
        <PreciousMetalsIraPage />
      </MemoryRouter>,
    );

    const journey = screen.getByRole("region", { name: "Your precious metals IRA journey" });
    expect(within(journey).getAllByRole("listitem")).toHaveLength(6);
    expect(within(journey).getByText("Open the IRA")).toBeInTheDocument();
    expect(within(journey).getByText("Authorize the purchase")).toBeInTheDocument();
    expect(within(journey).getByText("Your metals are held within your IRA.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /preferred trust/i })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gold bars arranged on a dark surface" })).toHaveAttribute(
      "src",
      "/assets/images/hero-right-transparent.png",
    );
  });
});
