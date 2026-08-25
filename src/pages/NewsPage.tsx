import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { NewsCard } from "@/components/common/NewsCard";
import { NewsListLoadingState } from "@/components/common/NewsLoadingState";
import type { NewsListResult } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getArticles } from "@/services/newsApi";

export function NewsPage() {
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [reload, setReload] = useState(0);
  const [state, setState] = useState<{ page: number; reload: number; phase: "loading" | "success" | "error"; result?: NewsListResult }>({ page, reload, phase: "loading" });
  usePageMeta("News & Market Insights | Oaksors", "Read precious-metals and retirement-market perspectives from Oaksors.");

  useEffect(() => {
    let active = true;
    void getArticles({ page, limit: 20 })
      .then((result) => { if (active) setState({ page, reload, phase: "success", result }); })
      .catch(() => { if (active) setState({ page, reload, phase: "error" }); });
    return () => { active = false; };
  }, [page, reload]);

  const phase = state.page === page && state.reload === reload ? state.phase : "loading";
  const articles = phase === "success" ? [...(state.result?.articles ?? [])].sort((a, b) => Number(b.featured) - Number(a.featured)) : [];

  return (
    <main>
      <PageHero compact eyebrow="News & insights" title={<>Perspective for markets that <em>keep moving.</em></>} description="Research, market context, and retirement-focused reading selected to help you ask better questions before making a decision." />
      <section className="mp-section mp-section--light news-index">
        <div className="container">
          <div className="news-index-toolbar">
            <div><p className="page-eyebrow">Latest analysis</p><h2>From the Oaksors desk</h2></div>
            <p>Live market context and retirement-focused perspectives from the Oaksors team.</p>
          </div>
          {phase === "loading" && <NewsListLoadingState />}
          {phase === "error" && <div className="news-empty news-error" role="alert"><p>We couldn't load the latest news.</p><button className="text-link" type="button" onClick={() => setReload((value) => value + 1)}>Try again</button></div>}
          {phase === "success" && !articles.length && <div className="news-empty" role="status">There are no published articles yet. Please check back soon.</div>}
          {phase === "success" && articles.length > 0 && <div className="news-grid">{articles.map((article) => <NewsCard key={article.slug} article={article} />)}</div>}
          {phase === "success" && (state.result?.pagination.totalPages ?? 0) > 1 && <nav className="news-pagination" aria-label="News pagination">
            {page > 1 && <Link to={`/news?page=${page - 1}`}>Previous</Link>}
            <span>Page {page} of {state.result?.pagination.totalPages}</span>
            {page < (state.result?.pagination.totalPages ?? 0) && <Link to={`/news?page=${page + 1}`}>Next</Link>}
          </nav>}
        </div>
      </section>
    </main>
  );
}
