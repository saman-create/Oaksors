# Automated News Source Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically import all current Oaksors WordPress articles into the project and expose a source-aware news API that can later merge CRM articles.

**Architecture:** A Firebase Functions HTTP endpoint and scheduled sync will use a WordPress adapter to fetch and normalize paginated posts. Normalized records will be stored in Firestore under a source-aware key; the frontend will request the API and retain its local fallback when the backend is unavailable.

**Tech Stack:** Firebase Functions, Firestore, TypeScript, WordPress REST API, React/Vite, Vitest.

## Global Constraints

- Preserve existing uncommitted UI/assets changes.
- Do not require WordPress credentials; the public REST API is the source.
- Keep the frontend `NewsArticle` shape stable for existing cards and article pages.
- Add a `source` discriminator so WordPress and future CRM records can coexist.
- Never erase stored articles after a partial sync failure.

---

### Task 1: Create the Firebase Functions workspace

**Files:**
- Create: `functions/package.json`
- Create: `functions/tsconfig.json`
- Create: `functions/src/index.ts`
- Modify: `firebase.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces Firebase Functions exports `getNews` and `syncWordPressNews`.
- `getNews` returns `{ articles: NewsArticle[] }` over HTTP.
- `syncWordPressNews` is a scheduled function and is also callable from an authenticated/admin trigger for initial import.

- [ ] Add Functions dependencies for `firebase-admin`, `firebase-functions`, and TypeScript build scripts.
- [ ] Configure Firebase to deploy the Functions source alongside the existing Hosting target.
- [ ] Add build output and local environment files to the existing ignore rules.
- [ ] Run `npm install` inside `functions` and verify the Functions TypeScript build.

### Task 2: Define the source-aware article contract

**Files:**
- Create: `functions/src/news/types.ts`
- Modify: `src/data/news.ts`
- Modify: `src/services/newsApi.ts`

**Interfaces:**
- `NewsSource = "wordpress" | "crm"`.
- `NewsArticle.source: NewsSource`.
- `WordPressPost` captures `id`, `date`, `slug`, `link`, `title.rendered`, `excerpt.rendered`, `content.rendered`, `featured_media`, and optional `_embedded` media/category data.
- `normalizeWordPressPost(post: WordPressPost): NewsArticle` returns a complete normalized article.

- [ ] Add `source` to the shared frontend type and mark the existing fallback article as `wordpress`.
- [ ] Keep the existing API fallback behavior and support `{ articles }` response envelopes.
- [ ] Add a normalization test fixture covering missing excerpt, image, and category fields.

### Task 3: Implement the WordPress adapter and sync

**Files:**
- Create: `functions/src/news/wordpress.ts`
- Create: `functions/src/news/wordpress.test.ts`
- Create: `functions/src/news/sync.ts`

**Interfaces:**
- `fetchWordPressPosts(fetcher, page): Promise<{ posts: WordPressPost[]; totalPages: number }>`.
- `normalizeWordPressPost(post): NewsArticle`.
- `syncWordPressNews(): Promise<{ imported: number; pages: number }>`.

- [ ] Fetch `https://www.oaksorsllc.com/wp-json/wp/v2/posts` with `_embed`, `_fields`, and `per_page=100`.
- [ ] Read `X-WP-TotalPages`, follow every page, and stop on an empty page or the reported page count.
- [ ] Convert WordPress HTML title/excerpt to text and retain article body HTML only after sanitizing unsafe tags/attributes.
- [ ] Resolve the embedded featured image URL and alt text, use the post link as the source link, and derive a read-time label from plain-text body length.
- [ ] Upsert each record into `newsArticles/{source}_{remoteId}` with `source`, `remoteId`, and `updatedAt` fields.
- [ ] Ensure a failed request rejects before any destructive operation and never deletes existing records.
- [ ] Test pagination, mapping, image fallback, read-time calculation, and partial failure behavior.

### Task 4: Add the Firestore API and scheduled trigger

**Files:**
- Modify: `functions/src/index.ts`
- Create: `functions/src/news/api.ts`
- Create: `functions/src/news/api.test.ts`

**Interfaces:**
- `listNewsArticles(): Promise<NewsArticle[]>` reads published records and sorts descending by `publishedAt`.
- `getNews` responds with `{ articles }` and appropriate JSON/error status codes.
- `syncWordPressNews` runs on a daily schedule and invokes the sync adapter.

- [ ] Query Firestore records, map them to the frontend contract, and sort newest first.
- [ ] Add CORS handling for the configured Hosting origin and return JSON for `GET` requests.
- [ ] Return an empty-but-valid article envelope if Firestore has no records yet, allowing frontend fallback.
- [ ] Export the scheduled sync and HTTP endpoint from the Functions entry point.
- [ ] Test sorting, response envelope, method handling, and empty-store behavior.

### Task 5: Connect the frontend and preserve fallback behavior

**Files:**
- Modify: `src/services/newsApi.ts`
- Modify: `.env.example`
- Modify: `src/pages/NewsPage.tsx`
- Modify: `src/pages/ArticlePage.tsx`

**Interfaces:**
- `getArticles(): Promise<NewsArticle[]>` calls the configured Firebase endpoint and falls back to local data.
- `getArticle(slug): Promise<NewsArticle | null>` resolves from the API result or local fallback.

- [ ] Configure the production endpoint through `VITE_NEWS_API_URL` and document the expected URL.
- [ ] Accept both the new `{ articles }` response and the existing direct-array shape during transition.
- [ ] Resolve article detail pages from fetched articles before using the local fallback.
- [ ] Make related-news cards use the fetched collection rather than only the single hardcoded article.
- [ ] Add frontend tests for API envelope parsing, API failure fallback, and article lookup.

### Task 6: Verify locally and document deployment

**Files:**
- Modify: `README.md`
- Modify: `.env.example`

- [ ] Run the Functions tests and frontend tests.
- [ ] Run frontend typecheck, lint, and production build.
- [ ] Run the Functions build and Firebase emulator smoke check where available.
- [ ] Document the one-time deployment sequence: enable Firestore, deploy Functions, set `VITE_NEWS_API_URL`, rebuild, and deploy Hosting.
- [ ] Confirm the existing UI/assets changes remain intact in `git diff`.

