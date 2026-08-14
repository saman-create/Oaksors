import { fetchAllWordPressArticles } from "./wordpress.js";
import { saveNewsArticles } from "./store.js";

export async function syncWordPressNews() {
  const articles = await fetchAllWordPressArticles();
  if (!articles.length) throw new Error("WordPress returned no articles");
  await saveNewsArticles(articles);
  return { imported: articles.length };
}
