import { render, screen } from "@testing-library/react";
import { PartnerLogosSection } from "./PartnerLogosSection";

describe("PartnerLogosSection", () => {
  it("uses the supplied local depository and custodian logos", () => {
    render(<PartnerLogosSection />);

    expect(screen.getByRole("img", { name: "Delaware Depository" })).toHaveAttribute("src", "/assets/images/delaware-depository.webp");
    expect(screen.getByRole("img", { name: "Preferred Trust Company" })).toHaveAttribute("src", "/assets/images/preferred-trust.webp");
  });
});
