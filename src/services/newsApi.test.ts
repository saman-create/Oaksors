import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getArticle, getArticles } from "@/services/newsApi";

const summary = {
  slug: "market-outlook", title: "Market outlook", excerpt: "A current market perspective.",
  publishedAt: "2026-08-20T10:00:00.000Z", category: "Markets",
  image: "https://example.com/market.jpg", imageAlt: "Gold bars", readTime: "4 min read", featured: true,
};

afterEach(() => vi.unstubAllGlobals());

describe("news API", () => {
  it("requests and parses a paginated article list", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      articles: [summary], pagination: { page: 2, limit: 20, total: 23, totalPages: 2 },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getArticles({ page: 2, limit: 20 })).resolves.toEqual({
      articles: [summary], pagination: { page: 2, limit: 20, total: 23, totalPages: 2 },
    });
    expect(fetchMock).toHaveBeenCalledWith("https://oaksorscrm.web.app/api/news?page=2&limit=20", expect.objectContaining({ headers: { Accept: "application/json" } }));
  });

  it("hides WordPress articles from public news lists", async () => {
    const crmArticle = { ...summary, sourceType: "crm" };
    const wordpressArticle = { ...summary, slug: "legacy-wordpress-story", sourceType: "wordpress" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      articles: [wordpressArticle, crmArticle], pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    }), { status: 200 })));

    await expect(getArticles()).resolves.toMatchObject({ articles: [crmArticle] });
  });

  it("requests an encoded slug and accepts wrapped or direct detail", async () => {
    const article = { ...summary, body: "Article body" };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ article }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(article), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getArticle("market outlook")).resolves.toEqual(article);
    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://oaksorscrm.web.app/api/news/market%20outlook", expect.any(Object));
    await expect(getArticle(summary.slug)).resolves.toEqual(article);
  });

  it("treats direct WordPress article URLs as not found", async () => {
    const wordpressArticle = { ...summary, body: "Legacy article body", sourceType: "wordpress" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ article: wordpressArticle }), { status: 200 })));

    await expect(getArticle(wordpressArticle.slug)).rejects.toMatchObject({ status: 404, code: "not_found" });
  });

  it("throws an ApiError for HTTP and malformed-response failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("", { status: 404 })));
    await expect(getArticle("missing")).rejects.toMatchObject({ status: 404 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ articles: [{}], pagination: {} }), { status: 200 })));
    await expect(getArticles()).rejects.toBeInstanceOf(ApiError);
  });

  it("passes the abort signal through to fetch", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ articles: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await getArticles({ signal: controller.signal });
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ signal: controller.signal }));
  });
});
