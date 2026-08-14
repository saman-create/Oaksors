import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowIcon } from "@/components/common/ArrowIcon";
import { NewsCard } from "@/components/common/NewsCard";
import { fallbackArticles, sampleArticle, type NewsArticle } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getArticle } from "@/services/newsApi";
import { BrandPromise } from "@/components/common/BrandPromise";

function ArticleContent({ article }: { article: NewsArticle }) {
  return article.body.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

export function ArticlePage() {
  const { slug = sampleArticle.slug } = useParams();
  const [result, setResult] = useState<{ slug: string; article: NewsArticle | null; loading: boolean }>({
    slug,
    article: slug === sampleArticle.slug ? sampleArticle : null,
    loading: slug !== sampleArticle.slug,
  });
  const article = result.slug === slug ? result.article : null;
  const loading = result.slug !== slug || result.loading;
  usePageMeta(article ? `${article.title} | Oaksors` : "Market Insight | Oaksors", article?.excerpt ?? "Read the latest precious-metals market insight from Oaksors.");

  useEffect(() => {
    let active = true;
    void getArticle(slug).then((nextArticle) => {
      if (active) setResult({ slug, article: nextArticle, loading: false });
    });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <main className="article-status"><div className="container"><p>Loading article…</p></div></main>;
  if (!article) return <main className="article-status"><div className="container"><p className="page-eyebrow">Article unavailable</p><h1>We couldn't find that story.</h1><Link to="/news/" className="text-link">Return to news <ArrowIcon /></Link></div></main>;

  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(article.publishedAt));

  return (
    <main>
      <article className="article-page">
        <header className="article-hero">
          <div className="container article-hero-inner">
            <Link to="/news/" className="article-back">← Back to news</Link>
            <div className="article-meta"><span>{article.category}</span><time dateTime={article.publishedAt}>{date}</time><span>{article.readTime}</span></div>
            <BrandPromise />
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
          </div>
        </header>
        <figure className="container article-image-wrap"><img src={article.image} alt={article.imageAlt} /></figure>
        <div className="container article-layout">
          <aside className="article-aside">
            <p>Share this perspective</p>
            <div className="article-share">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">in</a>
              <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`} aria-label="Share by email">@</a>
            </div>
          </aside>
          <div className="article-body">
            <ArticleContent article={article} />
            {article.source && <div className="article-source"><span>Original research</span><a href={article.source.url} target="_blank" rel="noreferrer">{article.source.label} <ArrowIcon /></a></div>}
          </div>
        </div>
      </article>
      <section className="mp-section mp-section--soft related-news">
        <div className="container"><div className="related-news-heading"><p className="page-eyebrow">Continue reading</p><h2>More market perspective</h2></div><div className="news-grid">{fallbackArticles.map((relatedArticle) => <NewsCard key={relatedArticle.slug} article={relatedArticle} />)}</div></div>
      </section>
    </main>
  );
}
