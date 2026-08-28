import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PreciousMetalsIraPage } from "./PreciousMetalsIraPage";

describe("PreciousMetalsIraPage", () => {
  it("replaces the Preferred Trust promotion with the three-step IRA journey", () => {
    render(
      <MemoryRouter>
        <PreciousMetalsIraPage />
      </MemoryRouter>,
    );

    const journey = screen.getByRole("region", { name: "Your precious metals IRA journey" });
    expect(within(journey).getAllByRole("listitem")).toHaveLength(3);
    expect(within(journey).getByText("Open SD IRA")).toBeInTheDocument();
    expect(within(journey).getByText("Fund The Account")).toBeInTheDocument();
    expect(within(journey).getByText("Wealth Preservation Begins")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /preferred trust/i })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gold bars arranged on a dark surface" })).toHaveAttribute(
      "src",
      "/assets/images/hero-right-transparent.png",
    );
  });
});
