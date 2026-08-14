import { fallbackArticles, sampleArticle, type NewsArticle } from "@/data/news";

const API_URL = (import.meta.env.VITE_NEWS_API_URL || "/api/news").replace(/\/$/, "");

type NewsResponse = NewsArticle[] | { articles?: NewsArticle[] };

async function request<T>(path: string): Promise<T> {
  if (!API_URL) throw new Error("News API is not configured");
  const response = await fetch(`${API_URL}${path}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`News API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getArticles(): Promise<NewsArticle[]> {
  if (!API_URL) return fallbackArticles;
  try {
    const result = await request<NewsResponse>("");
    const articles = Array.isArray(result) ? result : result.articles ?? [];
    return articles.length ? articles : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export async function getArticle(slug: string): Promise<NewsArticle | null> {
  try {
    const articles = await getArticles();
    return articles.find((article) => article.slug === slug) ?? null;
  } catch {
    return slug === sampleArticle.slug ? sampleArticle : null;
  }
}
