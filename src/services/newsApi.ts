import type { NewsArticle, NewsArticleSummary, NewsListResult, NewsPagination } from "@/data/news";
import { ApiError } from "@/services/apiError";
import { PUBLIC_API_BASE } from "@/services/publicApiBase";

export { ApiError } from "@/services/apiError";

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string") throw new ApiError(`News response is missing ${field}.`, { code: "invalid_response" });
  return value;
}

function parseSummary(value: unknown): NewsArticleSummary {
  if (!isObject(value)) throw new ApiError("News response contains an invalid article.", { code: "invalid_response" });
  return {
    slug: requiredString(value.slug, "slug"), title: requiredString(value.title, "title"), excerpt: requiredString(value.excerpt, "excerpt"),
    publishedAt: requiredString(value.publishedAt, "publishedAt"), category: requiredString(value.category, "category"),
    image: requiredString(value.image, "image"), imageAlt: requiredString(value.imageAlt, "imageAlt"), readTime: requiredString(value.readTime, "readTime"),
    featured: value.featured === true,
    ...(value.sourceType === "wordpress" || value.sourceType === "crm" ? { sourceType: value.sourceType } : {}),
    ...(typeof value.remoteId === "string" || typeof value.remoteId === "number" ? { remoteId: value.remoteId } : {}),
  };
}

function parsePagination(value: unknown): NewsPagination {
  if (!isObject(value) || ![value.page, value.limit, value.total, value.totalPages].every((item) => typeof item === "number")) throw new ApiError("News response contains invalid pagination.", { code: "invalid_response" });
  return { page: value.page as number, limit: value.limit as number, total: value.total as number, totalPages: value.totalPages as number };
}

function parseArticle(value: unknown): NewsArticle {
  if (!isObject(value)) throw new ApiError("News response contains an invalid article.", { code: "invalid_response" });
  const article: NewsArticle = { ...parseSummary(value), body: requiredString(value.body, "body") };
  if (isObject(value.source) && typeof value.source.label === "string" && typeof value.source.url === "string") article.source = { label: value.source.label, url: value.source.url };
  return article;
}

async function request(path: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try { response = await fetch(`${PUBLIC_API_BASE}${path}`, { headers: { Accept: "application/json" }, signal }); }
  catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("Unable to reach the news service. Please try again.");
  }
  if (!response.ok) throw new ApiError("The requested news could not be loaded.", { status: response.status, code: response.status === 404 ? "not_found" : "request_failed" });
  try { return await response.json(); } catch { throw new ApiError("News service returned an invalid response.", { status: response.status, code: "invalid_response" }); }
}

const pendingArticleLists = new Map<string, Promise<NewsListResult>>();

async function loadArticles(page: number, limit: number, signal?: AbortSignal): Promise<NewsListResult> {
  const data = await request(`/api/news?page=${page}&limit=${limit}`, signal);
  if (!isObject(data) || !Array.isArray(data.articles)) throw new ApiError("News service returned an invalid list.", { code: "invalid_response" });
  return { articles: data.articles.map(parseSummary), pagination: parsePagination(data.pagination) };
}

export function getArticles(options: { page?: number; limit?: number; signal?: AbortSignal } = {}): Promise<NewsListResult> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, options.limit ?? 20);
  if (options.signal) return loadArticles(page, limit, options.signal);

  const key = `${page}:${limit}`;
  const pending = pendingArticleLists.get(key);
  if (pending) return pending;

  const requestPromise = loadArticles(page, limit);
  pendingArticleLists.set(key, requestPromise);
  const clearPending = () => { if (pendingArticleLists.get(key) === requestPromise) pendingArticleLists.delete(key); };
  void requestPromise.then(clearPending, clearPending);
  return requestPromise;
}

export async function getArticle(slug: string, options: { signal?: AbortSignal } = {}): Promise<NewsArticle> {
  const data = await request(`/api/news/${encodeURIComponent(slug)}`, options.signal);
  return parseArticle(isObject(data) && "article" in data ? data.article : data);
}
