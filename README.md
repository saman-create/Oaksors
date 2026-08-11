# Oaksors

Oaksors' precious-metals IRA website, built with React, Vite, TypeScript, Tailwind CSS, React Aria Components, and selectively adopted Untitled UI foundations.

## Development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

## Routes

- `/` — redesigned homepage
- `/precious-metals-ira/` — IRA education and live-metal reference widgets
- `/news/` — API-ready news index
- `/news/:slug/` — reusable article template
- `/:year/:month/:day/:slug/` — compatibility route for existing article URLs
- `/contact-us/` — company details and disabled qualification form
- `/get-started-now/` — onboarding preview with disabled sensitive-data form
- `/privacy-notice/` — structured privacy notice

## News API contract

Set `VITE_NEWS_API_URL` to connect a dedicated API. When it is omitted or unavailable, the site renders the local example article from `src/data/news.ts`.

The frontend calls:

- `GET {VITE_NEWS_API_URL}/articles`
- `GET {VITE_NEWS_API_URL}/articles/{slug}`

Both endpoints use this article shape:

```ts
type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  image: string;
  imageAlt: string;
  readTime: string;
  source?: { label: string; url: string };
  body: string; // Plain CRM textarea content; blank lines create paragraphs.
};
```

## Form safety

The contact and onboarding forms are intentionally disabled. They do not collect, store, upload, email, or transmit entered information. Connect them only after a reviewed secure backend is available.

## Project structure

- `src/app` — routing and application composition
- `src/pages` — route-level page components
- `src/components/layout` — shared navigation, header, footer, and loading UI
- `src/components/common` — reusable page and editorial components
- `src/components/forms` — accessible, disabled form presentation components
- `src/components/sections` — homepage sections
- `src/components/ui` — owned UI primitives adapted from Untitled UI architecture
- `src/data` — local structured fallback content
- `src/services` — external API boundaries
- `src/styles` — design tokens and responsive site styles
- `assets` — local fonts, imagery, and video
