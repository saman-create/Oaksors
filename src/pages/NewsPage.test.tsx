import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewsPage } from "@/pages/NewsPage";

const article = { slug: "gold-outlook", title: "The gold outlook", excerpt: "Market perspective.", publishedAt: "2026-08-20T10:00:00Z", category: "Markets", image: "bad-image", imageAlt: "Gold bars", readTime: "4 min read", featured: true };
afterEach(() => vi.unstubAllGlobals());

function renderNews(path = "/news") {
  return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/news" element={<NewsPage />} /></Routes></MemoryRouter>);
}

describe("NewsPage", () => {
  it("loads the URL page, highlights featured content, and links by slug", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ articles: [article], pagination: { page: 2, limit: 20, total: 21, totalPages: 2 } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    renderNews("/news?page=2");
    expect(screen.getByRole("status", { name: /loading news/i })).toBeInTheDocument();
    const card = await screen.findByRole("article", { name: /featured: the gold outlook/i });
    expect(card).toHaveClass("news-featured");
    expect(screen.getByRole("link", { name: /read the gold outlook/i })).toHaveAttribute("href", "/news/gold-outlook/");
    expect(fetchMock).toHaveBeenCalledWith("https://oaksorscrm.web.app/api/news?page=2&limit=20", expect.any(Object));
  });

  it("distinguishes empty data from errors and can retry", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ articles: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    renderNews();
    await user.click(await screen.findByRole("button", { name: /try again/i }));
    expect(await screen.findByText(/no published articles yet/i)).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("shows a local fallback when an article image fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ articles: [article], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }), { status: 200 })));
    renderNews();
    const image = await screen.findByRole("img", { name: "Gold bars" });
    image.dispatchEvent(new Event("error"));
    expect(await screen.findByRole("img", { name: /image unavailable for the gold outlook/i })).toBeInTheDocument();
  });
});
