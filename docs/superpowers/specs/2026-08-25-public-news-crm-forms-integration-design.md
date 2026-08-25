# Public News and CRM Forms Integration Design

Date: 2026-08-25

## Objective

Connect the Oaksors public React website to the existing public CRM APIs for live news and three public form placements. The frontend consumes the APIs only. This work must not modify the CRM, Firebase Functions, Firestore, authentication, Firebase Hosting configuration, or any backend code.

## API Boundary

Default public API base URL:

`https://oaksorscrm.web.app`

The frontend may expose a Vite environment override for local or staging use, but production behavior must work with the default URL and no authentication token.

### News endpoints

- `GET /api/news?page={page}&limit=20`
- `GET /api/news/{slug}`

### Form endpoints

- Homepage qualification: `POST /api/crm/qualification-submissions`
- Contact email: `POST /api/crm/email-submissions`
- Get Started retirement intake: `POST /api/crm/retirement-intake-submissions`

Every form request uses `Content-Type: application/json` and an `Idempotency-Key` header. The retirement intake omits file upload, Tax ID, and SSN.

## Architecture

### News service

Replace the current failure-swallowing news service with a typed public API client that:

- returns `{ articles, pagination }` for list requests;
- requests article details directly by slug rather than searching a downloaded list;
- accepts the documented `{ article }` detail envelope and a direct article object defensively;
- validates the minimum runtime response shape before exposing data to pages;
- throws typed HTTP errors so empty, unavailable, rate-limited, and not-found states remain distinguishable;
- accepts an `AbortSignal` so stale page and slug requests can be cancelled.

Article summaries contain `slug`, `title`, `excerpt`, `publishedAt`, `category`, `image`, `imageAlt`, `readTime`, and `featured`. Detail records add `body`. `sourceType`, `remoteId`, and `source` are optional frontend fields because the user-provided live listing contract does not require them.

### CRM service

Create a typed CRM submission client shared by all three forms. It will:

- serialize JSON without logging request bodies;
- set `Content-Type: application/json` and `Idempotency-Key`;
- parse standard success, validation-error, duplicate, rate-limit, and generic error responses;
- expose safe field-level messages only when supplied by the backend;
- retain one idempotency key for an unchanged failed submission and generate a new key when the payload changes or a successful form is reset.

No secrets, Firebase SDK, Firebase Admin SDK, Firestore access, or authentication code belongs in this client.

### UI state

Use page-local state and small reusable form helpers rather than adding a data-fetching or form dependency. Existing design-system components and CSS conventions remain authoritative.

## News Experience

### Listing page

- Read `page` from the URL query string, normalize invalid values to page 1, and request 20 records.
- Keep the current hero and editorial structure.
- Display a distinct featured treatment only for an item whose API value is `featured: true`.
- Render remaining articles in the responsive card grid.
- Render accessible loading skeletons, a valid empty state, and a request-error state with a retry action.
- Show pagination controls only when `totalPages > 1`; controls update the URL and preserve refresh behavior.
- Never use production fallback articles or merge hardcoded data.

### Article page

- Keep `/news/:slug/` and the existing legacy date-shaped route, using only the slug for the detail request.
- Render loading, not-found, request-error/retry, and success states separately.
- Split the documented plain-text body on blank lines and render paragraphs without injecting HTML.
- Fetch a small current listing for related articles; failure of related content must not fail the main article.
- Set the document title and description from the selected article.
- Use a shared image component that replaces failed or missing images with a branded, non-article-specific visual fallback and suitable alternative text.

Existing Firebase Hosting already has a catch-all SPA rewrite. This work will rely on it and will not modify `firebase.json`.

## Form Experience

All forms use native semantic controls, visible required indicators, inline errors connected with `aria-describedby`, a required consent checkbox linking to `/privacy-notice/`, and a status region for submitting, success, duplicate, and failure feedback. Controls are disabled only while a request is in flight. Values remain after failure and clear after confirmed success.

### Homepage qualification

Endpoint: `/api/crm/qualification-submissions`

Payload:

```json
{
  "firstName": "Jordan",
  "lastName": "Taylor",
  "phone": "+15625550123",
  "email": "jordan@example.com",
  "retired": "not_retired",
  "dob": "1965-05-14",
  "portfolio": "Traditional IRA and employer 401(k).",
  "concerns": "Inflation and retirement diversification.",
  "sourcePage": "home",
  "privacyConsent": true
}
```

The existing retired labels map to `retired` and `not_retired`.

### Contact email

Replace the existing qualification-style Contact form with the user-requested email form.

Endpoint: `/api/crm/email-submissions`

Payload:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+15551234567",
  "subject": "Request for information",
  "message": "I would like to learn more.",
  "sourcePage": "contact",
  "privacyConsent": true
}
```

Phone is optional. The remaining documented fields are required.

### Get Started retirement intake

Endpoint: `/api/crm/retirement-intake-submissions`

Payload:

```json
{
  "firstName": "Jordan",
  "lastName": "Taylor",
  "dob": "1965-05-14",
  "phone": "+15625550123",
  "email": "jordan@example.com",
  "address": "111 Example Street, Long Beach, CA 90802",
  "married": "married",
  "portfolioValue": "250000-500000",
  "accountTypes": ["Traditional IRA", "401(k)"],
  "notes": "Please contact me during weekday afternoons.",
  "privacyConsent": true
}
```

The public form must remove the Tax ID / SSN control and statement upload. Portfolio value becomes a select using the identifiers `under-100000`, `100000-250000`, `250000-500000`, `500000-1000000`, and `1000000-plus`; these follow the PDF's numeric range format and can be changed in one frontend constant if the live API rejects a value. The form maps marital values to `married` or `not_married` and requires at least one account type. Notes remain optional.

## Validation and Response Handling

Client validation provides immediate convenience but does not replace backend validation.

- Required text values are trimmed.
- Email uses browser validation plus a conservative format check.
- Phone is normalized by removing presentation punctuation while preserving an explicit leading `+`; qualification and retirement phone values are required, contact phone is optional.
- Date of birth must be a valid past date.
- Qualification `portfolio` and `concerns`, retirement `notes`, and contact `message` enforce documented maximum lengths.
- Consent must be true.

Status handling:

- `201`: show received confirmation and clear the form.
- `409`: show an already-received message and prevent accidental resubmission.
- `422`: map backend `error.fields` to matching controls and show the safe summary message.
- `429`: preserve values and show a wait-and-retry message.
- Network, `400`, and `5xx`: preserve values and show a generic retryable failure without reflecting submitted content.

## Security and Privacy

- Never send or retain passwords, Tax IDs, SSNs, account statements, or uploads.
- Do not put personal data into URLs, console logs, analytics events, exceptions, or client persistence.
- Do not automatically retry POST requests in the background.
- Keep response diagnostics generic and expose only backend-provided safe field messages.
- Use the same idempotency key only for an unchanged logical retry.

## Testing and Verification

Automated tests use fetch fixtures only within test files; production has no mock news or form data.

Coverage includes:

- typed list pagination and direct article detail requests;
- list loading, empty, error/retry, featured, pagination, and broken-image behavior;
- article loading, not-found, error/retry, body rendering, and metadata updates;
- payload mapping for all three forms;
- required, field-level backend, duplicate, rate-limit, success, and network-failure states;
- idempotency-key reuse for unchanged retries and regeneration for changed payloads;
- confirmation that SSN and file controls are absent;
- route refresh behavior through the existing SPA configuration.

Final verification runs the full test suite, lint, type checking, production build, and bounded desktop/mobile browser checks for news and all three form placements.

## Out of Scope

- CRM changes
- Firebase Functions or Firestore changes
- Authentication
- Firebase Hosting or rewrite changes
- Backend validation, rate limiting, bot controls, storage, or monitoring
- WordPress fallback content
- Rich article HTML
- Retirement statement upload
- Tax ID or SSN collection
