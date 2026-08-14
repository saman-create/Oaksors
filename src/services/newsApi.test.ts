import { describe, expect, it, vi } from "vitest";
import { fallbackArticles } from "@/data/news";
import { getArticles } from "@/services/newsApi";

describe("news API", () => {
  it("uses the local article when the remote endpoint is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(getArticles()).resolves.toEqual(fallbackArticles);
  });
});
