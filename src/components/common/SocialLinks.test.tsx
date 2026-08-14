import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialLinks } from "@/components/common/SocialLinks";

describe("SocialLinks", () => {
  it("renders every Oaksors social profile as an external link", () => {
    render(<SocialLinks />);

    expect(screen.getAllByRole("link")).toHaveLength(7);
    expect(screen.getByRole("link", { name: "TikTok" })).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@oaksors?_r=1&_t=ZP-98qW6FHedCg",
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/oaksors/",
    );
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/oaksorsllc",
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      "https://www.facebook.com/profile.php?id=61593248879622",
    );
    expect(screen.getByRole("link", { name: "Reddit" })).toHaveAttribute(
      "href",
      "https://www.reddit.com/user/oaksors/",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/oaksors-investments-270954429/",
    );
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      "https://youtube.com/@oaksors",
    );
    expect(screen.getAllByRole("link").every((link) => link.getAttribute("target") === "_blank")).toBe(true);
  });
});
