# Invest Lead Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive `/invest` marketing page that submits qualified contact leads through a new public CRM endpoint.

**Architecture:** Add one routed React page and a page-specific stylesheet while reusing the existing site shell, form components, submission hook, visual assets, and CRM error contract. Extend the CRM endpoint union with a typed lead payload; do not change existing endpoint behavior.

**Tech Stack:** React 19, TypeScript, React Router, CSS, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-09-03-invest-lead-landing-page-design.md`

## Global Constraints

- Route: `/invest`.
- Endpoint: `POST /api/crm/lead-submissions`.
- JSON includes `firstName`, `lastName`, `email`, `phone`, `interest`, optional `message`, `sourcePage: "invest"`, and `privacyConsent: true`.
- Do not invent testimonials, returns, guarantees, ratings, or customer counts.
- Preserve all existing routes and CRM endpoint behavior.

---

### Task 1: Route and Lead API Contract

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/services/crmApi.ts`
- Modify: `src/app/routes.test.tsx`
- Modify: `src/services/crmApi.test.ts`

**Interfaces:**
- Produces: `LeadSubmission` and the `lead-submissions` endpoint option.

- [ ] Write failing tests that `/invest` renders and `submitCrmForm("lead-submissions", payload, key)` sends the existing JSON headers and body.
- [ ] Run `npm test -- --run src/app/routes.test.tsx src/services/crmApi.test.ts` and confirm the missing route/type behavior fails.
- [ ] Add the endpoint/type and register `InvestPage` without changing existing routes.
- [ ] Rerun the focused tests and confirm they pass.

### Task 2: Landing Page and Lead Form

**Files:**
- Create: `src/pages/InvestPage.tsx`
- Create: `src/pages/InvestPage.test.tsx`
- Create: `src/styles/invest.css`

**Interfaces:**
- Consumes: `useCrmSubmission("lead-submissions")`, `LeadSubmission`, shared form/status components, existing assets.

- [ ] Write failing tests for required fields, the exact JSON payload, submitting/success behavior, and inline server field errors.
- [ ] Run `npm test -- --run src/pages/InvestPage.test.tsx` and confirm the page is missing.
- [ ] Implement the campaign-focused sections and form using semantic headings, labels, and anchor navigation.
- [ ] Implement responsive desktop/mobile styling and reduced-motion behavior in `src/styles/invest.css`.
- [ ] Rerun the page tests and confirm they pass.

### Task 3: Backend Handoff and Verification

**Files:**
- Create: `docs/invest-lead-api-handoff.md`

**Interfaces:**
- Documents: the public JSON request and existing CRM response/error shapes.

- [ ] Write the backend handoff with the exact endpoint, field types, validation rules, idempotency behavior, and response examples.
- [ ] Run the Impeccable detector once across the finished page and stylesheet.
- [ ] Inspect desktop and mobile renderings in one browser pass and batch-fix material defects.
- [ ] Run `npm test -- --run`, `npm run lint`, `npm run build`, and `git diff --check`.
