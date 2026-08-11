# Oaksors

Oaksors’ precious-metals IRA marketing site, built with React, Vite, TypeScript, Tailwind CSS, and selectively adopted Untitled UI foundations.

## Development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run lint
npm run build
```

## Project structure

- `src/app` — application composition and integration tests
- `src/components/layout` — site-wide navigation, header, footer, and loading UI
- `src/components/sections` — one component per landing-page section
- `src/components/ui` — owned UI primitives adapted from the Untitled UI architecture
- `src/hooks` — reusable browser behavior such as header and reveal state
- `src/styles` — Oaksors design tokens, Tailwind theme, and incumbent visual styles
- `assets` — fonts, imagery, and video used by the landing page

Untitled UI components are added only as needed. The foundational button primitive uses React Aria Components and retains the existing Oaksors visual styling.
