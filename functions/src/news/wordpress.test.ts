import { describe, expect, it } from "vitest";
import { fetchAllWordPressArticles, normalizeWordPressPost } from "./wordpress.js";

const post = (id: number, date: string) => ({
  id,
  date,
  slug: `article-${id}`,
  link: `https://www.oaksorsllc.com/article-${id}/`,
  title: { rendered: `<strong>Article ${id}</strong>` },
  excerpt: { rendered: `<p>Excerpt ${id}</p>` },
  content: { rendered: `<p>Body ${id}</p><script>alert('x')</script>` },
  _embedded: { "wp:featuredmedia": [{ source_url: `https://image/${id}.jpg`, alt_text: `Image ${id}` }], "wp:term": [{ name: "Market outlook" }] },
});

describe("WordPress news adapter", () => {
  it("normalizes post content and metadata", () => {
    const article = normalizeWordPressPost(post(1, "2026-08-06T18:08:03Z"));
    expect(article).toMatchObject({ slug: "article-1", title: "Article 1", excerpt: "Excerpt 1", category: "Market outlook", sourceType: "wordpress", remoteId: 1 });
    expect(article.body).toBe("Body 1");
  });

  it("follows all reported API pages", async () => {
    const fetcher = async (url: string) => {
      const page = new URL(url).searchParams.get("page");
      return new Response(JSON.stringify(page === "1" ? [post(1, "2026-08-06")] : [post(2, "2026-08-05")]), { status: 200, headers: { "X-WP-TotalPages": "2" } });
    };
    const articles = await fetchAllWordPressArticles(fetcher);
    expect(articles.map((article) => article.remoteId)).toEqual([1, 2]);
  });
});
