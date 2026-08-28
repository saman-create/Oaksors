import { getPublishedPrivacyNotice } from "./privacyNotice";

describe("getPublishedPrivacyNotice", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the captured privacy notice without making a network request", async () => {
    vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Privacy notice must not use the network"); }));

    const notice = await getPublishedPrivacyNotice();

    expect(notice.title).toBe("PRIVACY NOTICE");
    expect(notice.html).toContain("Last updated November 04, 2025");
    expect(notice.html).toContain("This Privacy Notice for Oaksors LLC");
    expect(notice.html).toContain("13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?");
    expect(notice.navigation).toEqual(expect.arrayContaining([
      { id: "infocollect", label: "1. WHAT INFORMATION DO WE COLLECT?" },
      { id: "request", label: "13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?" },
    ]));
    expect(fetch).not.toHaveBeenCalled();
  });
});
