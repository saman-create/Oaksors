import { render, screen } from "@testing-library/react";
import { PartnerLogosSection } from "./PartnerLogosSection";

describe("PartnerLogosSection", () => {
  it("shows the approved partner logos without Preferred Trust branding", () => {
    render(<PartnerLogosSection />);

    expect(screen.getByRole("img", { name: "Delaware Depository" })).toHaveAttribute("src", "/assets/images/delaware-depository.webp");
    expect(screen.getByRole("img", { name: "Veteran Owned Business" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Trustpilot" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Preferred Trust Company" })).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Preferred Trust Company BBB Accredited Business" })).not.toBeInTheDocument();
  });
});
