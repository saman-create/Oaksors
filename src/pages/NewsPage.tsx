import { useEffect, useState } from "react";
import { PageHero } from "@/components/common/PageHero";
import { NewsCard } from "@/components/common/NewsCard";
import { fallbackArticles, type NewsArticle } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getArticles } from "@/services/newsApi";

export function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackArticles);
  usePageMeta("News & Market Insights | Oaksors", "Read precious-metals and retirement-market perspectives from Oaksors.");

  useEffect(() => {
    void getArticles().then(setArticles);
  }, []);

  return (
    <main>
      <PageHero compact eyebrow="News & insights" title={<>Perspective for markets that <em>keep moving.</em></>} description="Research, market context, and retirement-focused reading selected to help you ask better questions before making a decision." />
      <section className="mp-section mp-section--light news-index">
        <div className="container">
          <div className="news-index-toolbar">
            <div><p className="page-eyebrow">Latest analysis</p><h2>From the Oaksors desk</h2></div>
            <p>One flexible article system, ready to connect to your dedicated news API.</p>
          </div>
          <div className="news-grid">
            {articles.map((article) => <NewsCard key={article.slug} article={article} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
