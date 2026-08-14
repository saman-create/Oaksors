import { getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { NormalizedNewsArticle } from "./types.js";

const collection = () => getFirestore(getApp(), "oaksors-crm").collection("newsArticles");

export async function saveNewsArticles(articles: NormalizedNewsArticle[]) {
  const db = getFirestore(getApp(), "oaksors-crm");
  for (let index = 0; index < articles.length; index += 400) {
    const batch = db.batch();
    articles.slice(index, index + 400).forEach((article) => {
      const id = `${article.sourceType}_${article.remoteId}`;
      batch.set(collection().doc(id), { ...article, updatedAt: new Date().toISOString() }, { merge: true });
    });
    await batch.commit();
  }
}

export async function listNewsArticles() {
  const snapshot = await collection().get();
  return snapshot.docs.map((doc) => doc.data() as NormalizedNewsArticle).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
