export function NewsListLoadingState() {
  return (
    <div className="news-loading-grid" role="status" aria-label="Loading news articles">
      {Array.from({ length: 3 }, (_, index) => <article className="news-card news-card--skeleton" key={index} aria-hidden="true">
        <div className="news-skeleton-block news-skeleton-image" />
        <div className="news-card-body">
          <div className="news-skeleton-block news-skeleton-meta" />
          <div className="news-skeleton-block news-skeleton-title" />
          <div className="news-skeleton-block news-skeleton-title news-skeleton-title--short" />
          <div className="news-skeleton-block news-skeleton-copy" />
          <div className="news-skeleton-block news-skeleton-copy news-skeleton-copy--short" />
        </div>
      </article>)}
      <span className="sr-only">Loading the latest news articles</span>
    </div>
  );
}

export function ArticleLoadingState() {
  return (
    <main className="article-loading" role="status" aria-label="Loading article">
      <div className="article-loading-hero">
        <div className="container article-loading-inner">
          <div className="news-skeleton-block article-skeleton-back" />
          <div className="news-skeleton-block article-skeleton-meta" />
          <div className="news-skeleton-block article-skeleton-promise" />
          <div className="news-skeleton-block article-skeleton-heading" />
          <div className="news-skeleton-block article-skeleton-heading article-skeleton-heading--short" />
          <div className="news-skeleton-block article-skeleton-excerpt" />
        </div>
      </div>
      <div className="container article-loading-content">
        <div className="news-skeleton-block article-skeleton-image" />
        <div className="article-skeleton-lines">
          <div className="news-skeleton-block" />
          <div className="news-skeleton-block" />
          <div className="news-skeleton-block article-skeleton-line--short" />
        </div>
      </div>
      <span className="sr-only">Loading the article</span>
    </main>
  );
}
