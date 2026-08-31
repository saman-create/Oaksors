import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowIcon } from "@/components/common/ArrowIcon";
import { NewsCard } from "@/components/common/NewsCard";
import { ArticleLoadingState } from "@/components/common/NewsLoadingState";
import type { NewsArticle, NewsArticleSummary } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getArticle, getArticles } from "@/services/newsApi";
import { BrandPromise } from "@/components/common/BrandPromise";
import { NewsImage } from "@/components/common/NewsImage";
import { ApiError } from "@/services/newsApi";

const urlPattern = /https?:\/\/[^\s<>"']+/gi;
const trailingUrlPunctuation = /[.,!?;:)\]}]+$/;

function formatUrlLabel(url: string) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const pathname = decodeURI(parsed.pathname).replace(/\/$/, "");
    return `${hostname}${pathname}`;
  } catch {
    return url;
  }
}

function linkifyText(text: string): ReactNode[] {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(urlPattern)) {
    const matchedUrl = match[0];
    const start = match.index ?? cursor;
    const url = matchedUrl.replace(trailingUrlPunctuation, "");

    content.push(text.slice(cursor, start));
    content.push(<a key={`${start}-${url}`} href={url} target="_blank" rel="noreferrer" title={url}>{formatUrlLabel(url)}</a>);
    content.push(matchedUrl.slice(url.length));
    cursor = start + matchedUrl.length;
  }

  content.push(text.slice(cursor));
  return content;
}

function ArticleContent({ article }: { article: NewsArticle }) {
  return article.body.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{linkifyText(paragraph)}</p>);
}

export function ArticlePage() {
  const { slug = "" } = useParams();
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<{ slug: string; reload: number; phase: "loading" | "success" | "not-found" | "error"; article?: NewsArticle }>({ slug, reload, phase: "loading" });
  const [relatedArticles, setRelatedArticles] = useState<NewsArticleSummary[]>([]);
  const currentResult = result.slug === slug && result.reload === reload;
  const article = currentResult ? result.article : undefined;
  const loading = !currentResult || result.phase === "loading";
  usePageMeta(article ? `${article.title} | Oaksors` : "Market Insight | Oaksors", article?.excerpt ?? "Read the latest precious-metals market insight from Oaksors.");

  useEffect(() => {
    const controller = new AbortController();
    void getArticle(slug, { signal: controller.signal }).then((nextArticle) => setResult({ slug, reload, phase: "success", article: nextArticle })).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setResult({ slug, reload, phase: error instanceof ApiError && error.status === 404 ? "not-found" : "error" });
    });
    return () => controller.abort();
  }, [slug, reload]);

  useEffect(() => {
    const controller = new AbortController();
    void getArticles({ page: 1, limit: 4, signal: controller.signal }).then(({ articles }) => setRelatedArticles(articles.filter((candidate) => candidate.slug !== slug).slice(0, 3))).catch(() => setRelatedArticles([]));
    return () => controller.abort();
  }, [slug]);

  if (loading) return <ArticleLoadingState />;
  if (!article) return <main className="article-status"><div className="container"><h1>{result.phase === "not-found" ? "We couldn't find that story." : "We couldn't load this story."}</h1><p>{result.phase === "not-found" ? "It may have moved or is no longer published." : "Check your connection and try again."}</p>{result.phase === "error" && <button type="button" className="text-link" onClick={() => setReload((value) => value + 1)}>Try again</button>}<Link to="/news/" className="text-link">Return to news <ArrowIcon /></Link></div></main>;

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
        <figure className="container article-image-wrap"><NewsImage key={article.image} src={article.image} alt={article.imageAlt} title={article.title} /></figure>
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
        <div className="container"><div className="related-news-heading"><p className="page-eyebrow">Continue reading</p><h2>More market perspective</h2></div><div className="news-grid">{relatedArticles.map((relatedArticle) => <NewsCard key={relatedArticle.slug} article={relatedArticle} />)}</div></div>
      </section>
    </main>
  );
}
