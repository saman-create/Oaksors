import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  it("provides the investment landing page link in the footer", () => {
    render(<MemoryRouter><SiteFooter /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /invest with oaksors/i })).toHaveAttribute("href", "/invest/");
  });
});
