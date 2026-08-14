# News Source Sync Design

## Goal

Automatically populate the project news area from the existing Oaksors WordPress articles while keeping the frontend ready to combine those articles with a future CRM source.

## Architecture

- A Firebase Functions backend owns external news retrieval and normalization.
- A scheduled function fetches all public WordPress posts through the WordPress REST API, follows pagination, and writes normalized articles to Firestore.
- An HTTP function returns the stored articles to the frontend through a same-origin-safe API boundary.
- The frontend keeps its current `NewsArticle` presentation model and uses the HTTP endpoint through `newsApi.ts`.
- Each normalized record includes a source identifier, initially `wordpress`, so future CRM records can be added and merged without changing the UI contract.

## Data flow

1. The scheduled sync requests WordPress posts in pages.
2. Each post is mapped to a stable slug, title, excerpt, publication date, category, image, image alt text, read time, source link, body, and source identifier.
3. The sync upserts records by source and remote post ID, preserving the latest content and avoiding duplicates.
4. The frontend endpoint reads published records, merges sources at the API boundary, and sorts newest first.
5. If the endpoint is unavailable, the existing local fallback remains available so the news page does not render empty.

## Error handling

- A failed page fetch does not erase existing stored articles.
- Missing WordPress fields receive safe defaults.
- Invalid or empty responses are rejected before writes.
- The frontend falls back to the current local article when the backend cannot be reached.
- Rendered article HTML is sanitized before being displayed in the browser.

## Future source compatibility

The source adapter boundary will separate retrieval from normalization. A future CRM adapter can return the same normalized article shape with `source: "crm"`; the endpoint can then merge WordPress and CRM records while the existing cards and article page remain unchanged.

## Verification

The implementation will include unit tests for post mapping, pagination behavior, source identifiers, sorting, and frontend fallback behavior. The project will also be checked with typecheck, lint, tests, and a production build.
