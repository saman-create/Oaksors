# Public News and CRM Forms Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consume the existing public Oaksors CRM news and form APIs from the public React website with production loading, validation, error, success, pagination, SEO, and fallback behavior.

**Architecture:** A typed fetch boundary separates API contracts from pages. News pages consume list/detail functions with abort support, while three form placements share one CRM submission client and one state hook for idempotency and response handling. Existing React Router, page structure, components, and CSS remain in place.

**Tech Stack:** React 19, TypeScript 5.9, React Router 7, native Fetch API, Vitest, Testing Library, Vite.

**Spec:** `docs/superpowers/specs/2026-08-25-public-news-crm-forms-integration-design.md`

## Global Constraints

- Do not modify CRM, Firebase Functions, Firestore, authentication, Firebase Hosting configuration, or backend code.
- Default API base is exactly `https://oaksorscrm.web.app` with no authentication token.
- Production contains no mock or hardcoded news records.
- Never send passwords, Tax IDs, SSNs, account statements, or uploads.
- Every form POST uses JSON and a unique `Idempotency-Key` per logical submission.
- Keep existing design-system and routing conventions.
- Preserve the unrelated `.firebase/hosting.ZGlzdA.cache` working-tree change.

---

### Task 1: Typed public API services

**Files:**
- Modify: `src/data/news.ts`
- Modify: `src/services/newsApi.ts`
- Modify: `src/services/newsApi.test.ts`
- Create: `src/services/crmApi.ts`
- Create: `src/services/crmApi.test.ts`

**Interfaces:**
- Produces: `getArticles({ page, limit, signal }): Promise<NewsListResult>`
- Produces: `getArticle(slug, { signal }): Promise<NewsArticle>`
- Produces: `ApiError` with `status`, `code`, and `fieldErrors`
- Produces: `submitCrmForm(endpoint, payload, idempotencyKey): Promise<SubmissionReceipt>`
- Produces payload types `QualificationSubmission`, `EmailSubmission`, and `RetirementIntakeSubmission`

- [ ] **Step 1: Write failing news service tests**

Cover the exact list URL, pagination parsing, direct encoded slug URL, wrapped and direct detail objects, 404, malformed data, and abort propagation. The core expectations are:

```ts
await getArticles({ page: 2, limit: 20 });
expect(fetch).toHaveBeenCalledWith(
  "https://oaksorscrm.web.app/api/news?page=2&limit=20",
  expect.objectContaining({ headers: { Accept: "application/json" } }),
);

await getArticle("market outlook");
expect(fetch).toHaveBeenCalledWith(
  "https://oaksorscrm.web.app/api/news/market%20outlook",
  expect.any(Object),
);
```

- [ ] **Step 2: Run the news service test and verify RED**

Run: `npm test -- src/services/newsApi.test.ts`

Expected: failures because pagination and direct detail requests are not implemented.

- [ ] **Step 3: Implement typed news contracts and requests**

Use this public surface:

```ts
export type NewsArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  image: string;
  imageAlt: string;
  readTime: string;
  featured: boolean;
  sourceType?: "wordpress" | "crm";
  remoteId?: number | string;
};

export type NewsArticle = NewsArticleSummary & {
  body: string;
  source?: { label: string; url: string };
};

export type NewsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
```

`ApiError` must retain HTTP status without including response bodies or submitted data in its message.

- [ ] **Step 4: Run the news service test and verify GREEN**

Run: `npm test -- src/services/newsApi.test.ts`

Expected: all news service tests pass.

- [ ] **Step 5: Write failing CRM service tests**

Verify JSON transport, idempotency header, 201 parsing, field errors from 422, duplicate 409, 429, 5xx, and network failure.

```ts
await submitCrmForm("email-submissions", payload, "request-123");
expect(fetch).toHaveBeenCalledWith(
  "https://oaksorscrm.web.app/api/crm/email-submissions",
  expect.objectContaining({
    method: "POST",
    headers: expect.objectContaining({
      "Content-Type": "application/json",
      "Idempotency-Key": "request-123",
    }),
  }),
);
```

- [ ] **Step 6: Run the CRM service test and verify RED**

Run: `npm test -- src/services/crmApi.test.ts`

Expected: failure because the CRM client does not exist.

- [ ] **Step 7: Implement the CRM client and payload types**

Export:

```ts
export type CrmEndpoint =
  | "qualification-submissions"
  | "email-submissions"
  | "retirement-intake-submissions";

export async function submitCrmForm<T extends Record<string, unknown>>(
  endpoint: CrmEndpoint,
  payload: T,
  idempotencyKey: string,
): Promise<SubmissionReceipt>;
```

Parse only safe response metadata and structured `error.fields`. Never log request or response bodies.

- [ ] **Step 8: Run both service test files and verify GREEN**

Run: `npm test -- src/services/newsApi.test.ts src/services/crmApi.test.ts`

Expected: all tests pass.

### Task 2: Reusable submission state and form primitives

**Files:**
- Create: `src/hooks/useCrmSubmission.ts`
- Create: `src/hooks/useCrmSubmission.test.tsx`
- Create: `src/components/forms/FormStatus.tsx`
- Modify: `src/components/forms/FormField.tsx`
- Modify: `src/styles/pages.css`

**Interfaces:**
- Consumes: `submitCrmForm`, `ApiError`, and `CrmEndpoint`
- Produces: `useCrmSubmission(endpoint)` with `phase`, `fieldErrors`, `submit`, `setClientErrors`, `clearFeedback`, and `isSubmitting`
- Produces: form fields accepting `error` and `required`

- [ ] **Step 1: Write failing idempotency and state tests**

The hook test must prove that an unchanged failed retry reuses its key, a changed payload gets a new key, 201 becomes success, 409 becomes duplicate, and 422 exposes field messages.

```ts
expect(firstHeaders["Idempotency-Key"]).toBe(secondHeaders["Idempotency-Key"]);
expect(thirdHeaders["Idempotency-Key"]).not.toBe(secondHeaders["Idempotency-Key"]);
```

- [ ] **Step 2: Run the hook test and verify RED**

Run: `npm test -- src/hooks/useCrmSubmission.test.tsx`

Expected: failure because the hook does not exist.

- [ ] **Step 3: Implement submission state**

Use `crypto.randomUUID()` with a `crypto.getRandomValues()` UUID fallback. Fingerprint payloads with stable JSON serialization. Do not persist payloads or keys outside component memory and do not auto-retry POST requests.

- [ ] **Step 4: Add accessible field and status presentation**

`FormField` and `TextAreaField` receive `error?: string`; error text uses `{id}-error` and controls receive `aria-invalid` and `aria-describedby`. `FormStatus` maps phases to safe fixed copy.

- [ ] **Step 5: Run the hook and UI tests and verify GREEN**

Run: `npm test -- src/hooks/useCrmSubmission.test.tsx`

Expected: all tests pass.

### Task 3: Live news listing and article detail

**Files:**
- Create: `src/components/common/NewsImage.tsx`
- Modify: `src/components/common/NewsCard.tsx`
- Modify: `src/pages/NewsPage.tsx`
- Modify: `src/pages/ArticlePage.tsx`
- Create: `src/pages/NewsPage.test.tsx`
- Create: `src/pages/ArticlePage.test.tsx`
- Modify: `src/app/routes.test.tsx`
- Modify: `src/styles/pages.css`

**Interfaces:**
- Consumes: `getArticles`, `getArticle`, `NewsArticleSummary`, and `NewsArticle`
- Produces: URL-driven news pagination, direct detail loading, and `NewsImage`

- [ ] **Step 1: Write failing listing behavior tests**

Cover loading, valid empty, network error with retry, featured styling, image fallback, query-string pagination, and card slug links.

```ts
expect(fetch).toHaveBeenCalledWith(
  "https://oaksorscrm.web.app/api/news?page=2&limit=20",
  expect.any(Object),
);
expect(screen.getByRole("article", { name: /featured/i })).toHaveClass("news-featured");
```

- [ ] **Step 2: Run the listing test and verify RED**

Run: `npm test -- src/pages/NewsPage.test.tsx`

Expected: failures because errors, featured layout, and pagination are missing.

- [ ] **Step 3: Implement the listing and fallback image**

Use `useSearchParams`, abort stale requests, separate `loading | success | empty | error`, place the actual featured record first, and render accessible pagination links/buttons only for more than one page.

- [ ] **Step 4: Run the listing test and verify GREEN**

Run: `npm test -- src/pages/NewsPage.test.tsx`

Expected: all listing tests pass.

- [ ] **Step 5: Write failing article behavior tests**

Cover direct slug URL, loading, 404, network error/retry, plain-text paragraphs, metadata, related-news failure isolation, and image fallback.

- [ ] **Step 6: Run the article test and verify RED**

Run: `npm test -- src/pages/ArticlePage.test.tsx`

Expected: failures because the page currently downloads the list to find detail content.

- [ ] **Step 7: Implement direct detail and related requests**

The main detail request controls article status. The related list request is optional and never replaces a successful article with an error. Update `usePageMeta` from the loaded article.

- [ ] **Step 8: Run news and route tests and verify GREEN**

Run: `npm test -- src/pages/NewsPage.test.tsx src/pages/ArticlePage.test.tsx src/app/routes.test.tsx`

Expected: all tests pass.

### Task 4: Homepage qualification and Contact email forms

**Files:**
- Modify: `src/components/sections/QualificationSection.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Create: `src/components/sections/QualificationSection.test.tsx`
- Create: `src/pages/ContactPage.test.tsx`
- Modify: `src/styles/pages.css`

**Interfaces:**
- Consumes: `useCrmSubmission`, qualification/email payload types, `FormStatus`, and enhanced fields
- Produces: active homepage qualification and Contact email submission flows

- [ ] **Step 1: Write failing homepage payload and state tests**

Submit representative safe values and assert `sourcePage: "home"`, enum mapping, consent, headers, submitting state, 201 success, 422 field error, 409 duplicate, and preserved values after failure.

- [ ] **Step 2: Run the homepage form test and verify RED**

Run: `npm test -- src/components/sections/QualificationSection.test.tsx`

Expected: failure because the fieldset is disabled.

- [ ] **Step 3: Activate the qualification form**

Remove the preview notice, use a submit button, add required attributes and consent, map `Retired` to `retired` and `Not retired` to `not_retired`, and call `submit` without logging values.

- [ ] **Step 4: Run the homepage form test and verify GREEN**

Run: `npm test -- src/components/sections/QualificationSection.test.tsx`

Expected: all homepage tests pass.

- [ ] **Step 5: Write failing Contact email tests**

Assert the Contact page contains first name, last name, email, optional phone, subject, message, consent, and no retirement/DOB/portfolio controls; then verify `sourcePage: "contact"` and endpoint mapping.

- [ ] **Step 6: Run the Contact test and verify RED**

Run: `npm test -- src/pages/ContactPage.test.tsx`

Expected: failure because the current page still renders a disabled qualification form.

- [ ] **Step 7: Replace Contact form with active email form**

Keep contact cards and layout unchanged. Replace only the form card and update page metadata/description to remove preview wording.

- [ ] **Step 8: Run both form tests and verify GREEN**

Run: `npm test -- src/components/sections/QualificationSection.test.tsx src/pages/ContactPage.test.tsx`

Expected: all tests pass.

### Task 5: Safe retirement intake

**Files:**
- Modify: `src/pages/GetStartedPage.tsx`
- Create: `src/pages/GetStartedPage.test.tsx`
- Modify: `src/app/routes.test.tsx`
- Modify: `src/styles/pages.css`

**Interfaces:**
- Consumes: `useCrmSubmission`, retirement payload type, `FormStatus`, and enhanced fields
- Produces: active JSON retirement intake without SSN or upload controls

- [ ] **Step 1: Write failing safe-intake tests**

Assert the absence of Tax ID, SSN, password, and file inputs. Submit safe fields and assert marital/range/account mappings, consent, the retirement endpoint, and JSON transport.

- [ ] **Step 2: Run the intake test and verify RED**

Run: `npm test -- src/pages/GetStartedPage.test.tsx`

Expected: failure because sensitive controls exist and the form is disabled.

- [ ] **Step 3: Implement the safe intake**

Remove the sensitive controls and preview notice. Add portfolio range select values `under-100000`, `100000-250000`, `250000-500000`, `500000-1000000`, `1000000-plus`; set account checkbox values/names; validate one selection; add consent and active submission states.

- [ ] **Step 4: Run intake and route tests and verify GREEN**

Run: `npm test -- src/pages/GetStartedPage.test.tsx src/app/routes.test.tsx`

Expected: all tests pass and old disabled-form assertions are replaced.

### Task 6: Full verification and rendered QA

**Files:**
- Modify only defects discovered in the files above

**Interfaces:**
- Consumes: all completed tasks
- Produces: verified production frontend integration

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: zero test failures, lint errors, type errors, or build errors.

- [ ] **Step 2: Run bounded browser checks**

At desktop and mobile sizes, inspect News empty/error behavior against the currently empty live API, article not-found behavior, and all three active forms. Do not submit personal or fabricated production records during browser QA.

- [ ] **Step 3: Run the Impeccable detector once**

Run the detector only on changed UI targets. Fix findings introduced by this work; leave unrelated pre-existing findings outside scope.

- [ ] **Step 4: Review the final diff**

Confirm no changes exist under `functions/`, Firebase configuration, authentication, Firestore, or CRM code, and confirm `.firebase/hosting.ZGlzdA.cache` remains untouched.
