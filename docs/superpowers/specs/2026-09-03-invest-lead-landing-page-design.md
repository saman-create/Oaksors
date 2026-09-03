# Invest Lead Landing Page Design

## Purpose

Create a dedicated `/invest` marketing page for first-time visitors arriving from campaigns. The page explains Oaksors at a glance, earns enough trust for a visitor to request a conversation, and creates a lead through a short form without collecting retirement-account credentials or identity documents.

## Experience

The page extends the existing Oaksors “Tangible Reserve” design system. Its first viewport uses a dark, high-contrast composition with physical precious-metals imagery, direct marketing copy, concise service proof, and a paper-colored lead form. Emerald is reserved for direction, confirmation, and focus states.

The page contains:

1. A split hero with the primary message, a short list of established Oaksors service capabilities, and the lead form.
2. A compact trust strip using existing approved partner logos.
3. A three-part value section covering guidance, coordination, and ongoing support.
4. A three-step process: share goals, speak with a specialist, review next steps.
5. A precious-metals education band using existing gold and silver imagery.
6. A final call to action linking back to the hero form.

The page must not invent testimonials, returns, guarantees, customer counts, ratings, or investment outcomes.

## Lead Form

Required fields:

- `firstName`
- `lastName`
- `email`
- `phone`
- `interest`: `precious_metals_ira`, `gold`, `silver`, `rollover_guidance`, or `general_information`
- `privacyConsent`: `true`

Optional field:

- `message`

The frontend submits JSON to `POST /api/crm/lead-submissions` with `sourcePage: "invest"`, `Content-Type: application/json`, and an `Idempotency-Key`. Client and server validation errors appear beside their fields. Duplicate, rate-limited, network-failure, submitting, and success states use the existing CRM form conventions.

## Routing and SEO

Register `/invest` in React Router under the existing site shell. The route must be refresh-safe under current hosting rewrites. Use a unique page title and description aimed at precious-metals education and specialist contact.

## Responsive and Accessible Behavior

The hero becomes a single column below the existing tablet breakpoint, with marketing content before the form. All controls retain visible labels, keyboard focus, semantic validation, and at least 44px touch targets. Decorative media is hidden from assistive technology and motion respects reduced-motion preferences.

## Backend Handoff

Provide a concise developer-facing contract for the new endpoint, including request fields, validation, idempotency, successful response, and field-error response shape. Existing public CRM endpoints remain unchanged.
