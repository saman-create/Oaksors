import { Link } from "react-router-dom";
import type { NewsArticleSummary } from "@/data/news";
import { ArrowIcon } from "@/components/common/ArrowIcon";
import { NewsImage } from "@/components/common/NewsImage";

export function NewsCard({ article }: { article: NewsArticleSummary }) {
  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(article.publishedAt));
  return (
    <article className={`news-card${article.featured ? " news-featured" : ""}`} aria-label={`${article.featured ? "Featured: " : ""}${article.title}`}>
      <Link to={`/news/${article.slug}/`} className="news-card-image" aria-label={`Read ${article.title}`}>
        <NewsImage key={article.image} src={article.image} alt={article.imageAlt} title={article.title} />
      </Link>
      <div className="news-card-body">
        <div className="news-card-meta"><span>{article.featured ? "Featured · " : ""}{article.category}</span><time dateTime={article.publishedAt}>{date}</time><span>{article.readTime}</span></div>
        <h2><Link to={`/news/${article.slug}/`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        <Link to={`/news/${article.slug}/`} className="text-link">Read article <ArrowIcon /></Link>
      </div>
    </article>
  );
}
