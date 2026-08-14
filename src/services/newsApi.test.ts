import { describe, expect, it, vi } from "vitest";
import { getArticles } from "@/services/newsApi";

describe("news API", () => {
  it("returns no articles when the remote endpoint is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(getArticles()).resolves.toEqual([]);
  });
});
