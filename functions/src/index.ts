import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { listNewsArticles } from "./news/store.js";
import { syncWordPressNews as sync } from "./news/sync.js";

initializeApp();
setGlobalOptions({ preserveExternalChanges: true });

export const getNews = onRequest(async (request, response) => {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    response.set("Access-Control-Allow-Origin", "*");
    let articles = await listNewsArticles();
    const needsImageRefresh = articles.some((article) => article.sourceType === "wordpress" && article.image === "/assets/images/news-gold-bullion.jpg");
    if (!articles.length || needsImageRefresh) {
      await sync();
      articles = await listNewsArticles();
    }
    response.json({ articles });
  } catch (error) {
    console.error("Unable to read news", error);
    response.status(500).json({ error: "Unable to load news" });
  }
});

export const syncWordPressNews = onRequest(async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Use POST to start a sync" });
    return;
  }
  try {
    response.json(await sync());
  } catch (error) {
    console.error("Unable to sync WordPress news", error);
    response.status(502).json({ error: "Unable to sync WordPress news" });
  }
});

export const syncWordPressNewsDaily = onSchedule("every 24 hours", async () => {
  await sync();
});
