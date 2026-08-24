import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { PageHero } from "@/components/common/PageHero";

describe("PageHero", () => {
  it("uses the landing-page composition for both compact and image heroes", () => {
    const compact = render(
      <MemoryRouter>
        <PageHero compact eyebrow="News" title="Latest news" />
      </MemoryRouter>,
    );

    expect(compact.container.firstElementChild).toHaveClass("page-hero--landing-composition");

    compact.unmount();

    const withImage = render(
      <MemoryRouter>
        <PageHero eyebrow="IRA" title="Precious metals" image="/metals.png" imageAlt="Metals" />
      </MemoryRouter>,
    );

    expect(withImage.container.firstElementChild).toHaveClass("page-hero--landing-composition");
  });
});
