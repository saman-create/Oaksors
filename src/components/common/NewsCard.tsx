import { Link } from "react-router-dom";
import type { NewsArticle } from "@/data/news";
import { ArrowIcon } from "@/components/common/ArrowIcon";

export function NewsCard({ article }: { article: NewsArticle }) {
  const date = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(article.publishedAt));
  return (
    <article className="news-card">
      <Link to={`/news/${article.slug}/`} className="news-card-image" aria-label={`Read ${article.title}`}>
        <img src={article.image} alt={article.imageAlt} />
      </Link>
      <div className="news-card-body">
        <div className="news-card-meta"><span>{article.category}</span><time dateTime={article.publishedAt}>{date}</time></div>
        <h2><Link to={`/news/${article.slug}/`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        <Link to={`/news/${article.slug}/`} className="text-link">Read article <ArrowIcon /></Link>
      </div>
    </article>
  );
}
