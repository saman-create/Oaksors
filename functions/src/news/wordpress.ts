import type { NormalizedNewsArticle, WordPressPost } from "./types.js";

const WORDPRESS_URL = "https://www.oaksorsllc.com/wp-json/wp/v2/posts";

export type WordPressFetcher = (url: string) => Promise<Response>;

const namedEntities: Record<string, string> = {
  amp: "&", apos: "'", gt: ">", hellip: "…", ldquo: "“", lpar: "(", lt: "<", mdash: "—", nbsp: " ", ndash: "–", quot: '"', rdquo: "”", rpar: ")",
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z][\da-z]+));/gi, (match, decimal, hexadecimal, named) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
    return namedEntities[named.toLowerCase()] ?? match;
  });
}

export function stripHtml(value = ""): string {
  return decodeHtmlEntities(value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function readTime(body: string): string {
  return `${Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220))} min read`;
}

export function normalizeWordPressPost(post: WordPressPost): NormalizedNewsArticle {
  const body = stripHtml(post.content?.rendered);
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.find((term) => term.name)?.name ?? "Market insight";
  return {
    slug: post.slug,
    title: stripHtml(post.title?.rendered) || "Oaksors market insight",
    excerpt: stripHtml(post.excerpt?.rendered) || body.slice(0, 220),
    publishedAt: post.date,
    category,
    image: image?.source_url || "/assets/images/news-gold-bullion.jpg",
    imageAlt: image?.alt_text || "Precious metals market insight",
    readTime: readTime(body),
    source: { label: "Oaksors", url: post.link },
    body,
    sourceType: "wordpress",
    remoteId: post.id,
  };
}

export async function fetchWordPressPosts(fetcher: WordPressFetcher = (url) => fetch(url), page = 1) {
  const url = `${WORDPRESS_URL}?page=${page}&per_page=100&_embed=1`;
  const response = await fetcher(url);
  if (!response.ok) throw new Error(`WordPress returned ${response.status}`);
  const posts = await response.json() as WordPressPost[];
  return { posts, totalPages: Number(response.headers.get("X-WP-TotalPages") || page) };
}

export async function fetchAllWordPressArticles(fetcher: WordPressFetcher = (url) => fetch(url)) {
  const articles: NormalizedNewsArticle[] = [];
  let page = 1;
  let totalPages: number;
  do {
    const result = await fetchWordPressPosts(fetcher, page);
    articles.push(...result.posts.map(normalizeWordPressPost));
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);
  return articles;
}
