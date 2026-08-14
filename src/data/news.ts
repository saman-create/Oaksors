export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  image: string;
  imageAlt: string;
  readTime: string;
  source?: { label: string; url: string };
  body: string;
  sourceType: "wordpress" | "crm";
  remoteId?: number | string;
};
