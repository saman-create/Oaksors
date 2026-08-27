export type NewsArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  image: string;
  imageAlt: string;
  readTime: string;
  featured: boolean;
  sourceType?: "wordpress" | "crm";
  remoteId?: number | string;
};

export type NewsArticle = NewsArticleSummary & {
  body: string;
  source?: { label: string; url: string };
};

export type NewsPagination = { page: number; limit: number; total: number; totalPages: number };
export type NewsListResult = { articles: NewsArticleSummary[]; pagination: NewsPagination };
