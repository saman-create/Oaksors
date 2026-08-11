import { getPublishedPrivacyNotice } from "./privacyNotice";

const publishedNotice = `
  <div class="outer">
    <div data-custom-class="body">
      <div><h1>PRIVACY NOTICE</h1></div>
      <p>Current legal wording.</p>
      <ul><li>Visible list item</li></ul>
      <a href="https://example.com/legal">Legal link</a>
      <div>
        <div id="toc"><h2>TABLE OF CONTENTS</h2></div>
        <div><a href="#section-one">1. FIRST SECTION</a></div>
        <div id="section-one"><h2>1. FIRST SECTION</h2></div>
        <p>First section wording.</p>
        <div id="section-two"><h2>2. SECOND SECTION</h2></div>
        <p>Second section wording.</p>
      </div>
      <table><tbody><tr><td>Legal table</td></tr></tbody></table>
    </div>
  </div>
`;

describe("getPublishedPrivacyNotice", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("separates the published title from the unchanged legal document body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ content: { rendered: publishedNotice } }],
    }));

    const notice = await getPublishedPrivacyNotice();

    expect(notice.title).toBe("PRIVACY NOTICE");
    expect(notice.html).not.toContain("<h1");
    expect(notice.html).toContain("Current legal wording.");
    expect(notice.html).toContain('<a href="https://example.com/legal">Legal link</a>');
    expect(notice.html).toContain("<table>");
    expect(notice.html).not.toContain("TABLE OF CONTENTS");
    expect(notice.html).not.toContain('href="#section-one">1. FIRST SECTION');
    expect(notice.html).toContain("First section wording.");
    expect(notice.navigation).toEqual([
      { id: "section-one", label: "1. FIRST SECTION" },
      { id: "section-two", label: "2. SECOND SECTION" },
    ]);
  });
});
