# Architecture

## Overview

```text
NFPC V2
│
├── legacy/            Original static site — preserved as-is, not served, kept for reference/migration
│
├── frontend/           React + TypeScript + Vite + Tailwind CSS + React Router
│
├── backend/             (Milestone 3) Node.js + Express + TypeScript + Mongoose — not implemented yet
│
├── database              MongoDB Atlas — not provisioned yet
│
└── docs/               Planning documents for this and future milestones
```

This is a monorepo with independently deployable frontend and backend applications, not a single coupled codebase. The frontend talks to the backend exclusively over a versioned REST API (see [BACKEND_PLAN.md](BACKEND_PLAN.md)) — it never talks to MongoDB directly, and it has no server-side rendering step in this milestone.

## Why a repo-root `frontend/` directory (not an in-place rewrite)

The legacy site was 9 loose HTML files at the repo root with no build tooling. Rewriting in place risked half-migrated states where old and new markup coexist ambiguously. Instead:

- `legacy/` holds the original site untouched (moved with `git mv`, so history is preserved).
- `frontend/` is a clean Vite scaffold, free to adopt modern tooling without fighting legacy file layout.
- `backend/` will be added as its own top-level directory in Milestone 3, sibling to `frontend/`, so each app has its own `package.json`, dependency tree, and deploy target.

## Frontend

- **React 19 + TypeScript** — component model and type safety.
- **Vite** — dev server and build tool. Chosen over Create React App (unmaintained) or Next.js (SSR/routing conventions not needed yet; the site has no requirement for server rendering in this milestone, and adopting Next later remains possible if SEO needs grow).
- **Tailwind CSS v4** — utility-first styling via the CSS-first `@theme` config (see [`frontend/src/index.css`](../frontend/src/index.css)), which is also where the design tokens in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) live as CSS custom properties.
- **React Router v7** (`createBrowserRouter`) — client-side routing, with the public site and the future admin dashboard as separate route subtrees under separate layouts (`SiteLayout`, `AdminLayout`).
- **Self-hosted variable fonts** (`@fontsource-variable/*`) instead of a Google Fonts `<link>` — avoids a third-party runtime request and keeps the app functional offline in dev.

### Folder structure

```text
frontend/src/
├── assets/            Static assets imported by components (none yet — legacy media not migrated in M1)
├── components/
│   ├── layout/         Header, Footer, SiteLayout, AdminLayout — structural, page-independent
│   ├── ui/              Button, Card, Container, Section — the design-system primitives
│   ├── shared/          PageHero, StateMessage — cross-page composite patterns
│   └── sections/        (reserved for M2 — homepage/landing-specific section components)
├── pages/               One component per route; admin pages under pages/admin/
├── routes/              router.tsx — the single source of truth for the route tree
├── hooks/               usePageMeta, and future data-fetching hooks (M3)
├── lib/                cn() and other framework-agnostic helpers
├── types/               content.ts — shapes mirroring the future backend models
├── data/               site.ts (nav/site config), placeholders.ts (sample content, deleted once the API exists)
└── styles/             (reserved — currently everything lives in index.css)
```

`components/sections` and `styles/` are placeholder directories for Milestone 2, kept empty rather than populated speculatively, per the instruction not to build ahead of the current milestone.

### Data flow (current vs. future)

Milestone 1 pages import typed placeholder data directly from `src/data/placeholders.ts`. Every page component is written against the same `Sermon`/`ChurchEvent`/`Ministry`/etc. types defined in `src/types/content.ts` that the backend will eventually return, so swapping `import { placeholderSermons } from '@/data/placeholders'` for a `useSermons()` API hook in Milestone 3 is a data-source change, not a component rewrite:

```text
Milestone 1:  src/data/placeholders.ts  →  page component
Milestone 3+: MongoDB → Express API → frontend fetch hook → page component
```

### Environment variables

Frontend env vars must be prefixed `VITE_` to be exposed to client code (Vite convention). See [`.env.example`](../.env.example) and [`frontend/.env.example`](../frontend/.env.example). Only `VITE_API_URL` is defined so far, and it is unused until Milestone 3 wires up real data fetching.

## Backend (planned, Milestone 3)

Node.js + Express + TypeScript + Mongoose, exposing a versioned REST API (`/api/v1/...`). Full detail in [BACKEND_PLAN.md](BACKEND_PLAN.md). Not implemented in this milestone — no `backend/` directory exists yet.

## Database (planned, Milestone 3)

MongoDB Atlas. Connection string via `MONGODB_URI` (see `.env.example`), never committed. No cluster has been provisioned as part of this milestone.

## Admin dashboard (planned, Milestone 4)

A protected route subtree (`/admin/*`) inside the same frontend app, sharing the design system but using `AdminLayout` instead of `SiteLayout`. Route shells and navigation already exist (`/admin/login`, `/admin/dashboard`, `/admin/sermons`, etc.) so the route architecture doesn't need to change when real functionality lands — only the page components behind each route do. Detail in [DASHBOARD_PLAN.md](DASHBOARD_PLAN.md).

## Deployment (not yet configured)

No CI/CD or hosting has been set up. The likely target shape — a static frontend build deployed to a CDN/static host, an Express API deployed as a Node service, MongoDB Atlas as managed database — is deferred to Milestone 5 ("Integration + production hardening + deployment") per [PROJECT_PLAN.md](../PROJECT_PLAN.md).
