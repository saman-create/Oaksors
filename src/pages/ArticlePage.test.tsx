import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ArticlePage } from "@/pages/ArticlePage";

afterEach(() => vi.unstubAllGlobals());
const article = { slug: "gold-outlook", title: "The gold outlook", excerpt: "Market perspective.", publishedAt: "2026-08-20T10:00:00Z", category: "Markets", image: "image.jpg", imageAlt: "Gold bars", readTime: "4 min read", featured: false, body: "First paragraph.\n\nSecond paragraph." };

function renderArticle() {
  return render(<MemoryRouter initialEntries={["/news/gold-outlook"]}><Routes><Route path="/news/:slug" element={<ArticlePage />} /></Routes></MemoryRouter>);
}

describe("ArticlePage", () => {
  it("loads the direct slug endpoint, renders body paragraphs, and updates metadata", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ article }), { status: 200 }))
      .mockRejectedValueOnce(new TypeError("related unavailable"));
    vi.stubGlobal("fetch", fetchMock);
    renderArticle();
    expect(await screen.findByRole("heading", { level: 1, name: "The gold outlook" })).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("https://oaksorscrm.web.app/api/news/gold-outlook", expect.any(Object));
    await waitFor(() => expect(document.title).toBe("The gold outlook | Oaksors"));
  });

  it("shows a not-found state for a 404 detail response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));
    renderArticle();
    expect(await screen.findByRole("heading", { name: /couldn't find that story/i })).toBeInTheDocument();
  });
});
