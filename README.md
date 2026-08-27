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

## News article contract

The frontend reads `{ articles: NewsArticle[] }` from the Firebase `/api/news` endpoint. When it is unavailable, the site renders the local example article from `src/data/news.ts`.

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
  body: string;
  sourceType: "wordpress" | "crm";
  remoteId?: number | string;
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
## Public CRM API

The public website reads published news and submits its three visitor forms through the existing public CRM API at `https://oaksorscrm.web.app`. No Firebase Admin SDK, Firestore access, or authentication token is used by the frontend.

The default API base can be changed for another public environment with `VITE_PUBLIC_API_BASE_URL`. The frontend consumes:

- `GET /api/news?page=1&limit=20`
- `GET /api/news/:slug`
- `POST /api/crm/qualification-submissions`
- `POST /api/crm/email-submissions`
- `POST /api/crm/retirement-intake-submissions`

Every form request sends JSON and a per-submission `Idempotency-Key`. Retirement intake intentionally excludes SSNs, Tax IDs, passwords, and document uploads.

During `npm run dev`, Vite proxies `/crm-api` to the same public API so local browser testing works with the API's production-only CORS policy. Production builds call `https://oaksorscrm.web.app` directly.
