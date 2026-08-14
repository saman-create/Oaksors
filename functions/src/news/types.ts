export type NewsSource = "wordpress" | "crm";

export type NormalizedNewsArticle = {
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
  sourceType: NewsSource;
  remoteId: number | string;
};

export type WordPressPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    [key: string]: Array<{ source_url?: string; alt_text?: string; name?: string }>;
  };
};
