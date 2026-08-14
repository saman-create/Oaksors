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

export const sampleArticle: NewsArticle = {
  slug: "will-gold-prices-hit-all-time-highs-again-in-2026",
  title: "Will gold prices hit all-time highs again in 2026?",
  excerpt: "Gold's outlook remains elevated, but future demand and price stability depend on central-bank buying, geopolitical developments, and Federal Reserve policy.",
  publishedAt: "2026-08-06T12:00:00-07:00",
  category: "Market outlook",
  image: "/assets/images/news-gold-bullion.jpg",
  imageAlt: "A pile of gold bullion bars and coins",
  readTime: "4 min read",
  source: { label: "J.P. Morgan Global Research", url: "https://www.jpmorgan.com/insights/global-research/commodities/gold-prices" },
  body: "The 2026 and 2027 outlook for gold prices remains ahead of current levels, with J.P. Morgan Global Research analysts expecting gold to push $6,000 per ounce by year end and identifying $6,300 per ounce as a possibility for 2027.\n\nHowever, future demand and price stability appear to depend on the resolution of ongoing geopolitical conflicts and on Federal Reserve policy—neither of which is certain at this time.\n\nCentral-bank demand for gold, which drove much of the precious metal's rise over the past year, appears to have cooled—though a closer look at the data tells a more complex story.",
  sourceType: "wordpress",
};

export const fallbackArticles = [sampleArticle];
