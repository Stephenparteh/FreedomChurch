# Architecture

## Overview

```text
NFPC V2
│
├── legacy/            Original static site — preserved as-is, not served, kept for reference/migration
│
├── frontend/           React + TypeScript + Vite + Tailwind CSS + React Router
│
├── backend/             Node.js + Express + TypeScript + Mongoose — public read API (Milestone 3)
│
├── database              MongoDB Atlas (content and uploaded images, GridFS) — not verified against a live cluster
│
└── docs/               Planning documents for this and future milestones
```

This is a monorepo with independently deployable frontend and backend applications, not a single coupled codebase. The frontend talks to the backend exclusively over a versioned REST API (see [BACKEND_PLAN.md](BACKEND_PLAN.md)) — it never talks to MongoDB directly, and it has no server-side rendering step in this milestone.

## Why a repo-root `frontend/` directory (not an in-place rewrite)

The legacy site was 9 loose HTML files at the repo root with no build tooling. Rewriting in place risked half-migrated states where old and new markup coexist ambiguously. Instead:

- `legacy/` holds the original site untouched (moved with `git mv`, so history is preserved).
- `frontend/` is a clean Vite scaffold, free to adopt modern tooling without fighting legacy file layout.
- `backend/` is its own top-level directory, sibling to `frontend/`, with its own `package.json`, dependency tree, and deploy target.

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
│   ├── shared/          PageHero, StateMessage, Reveal — cross-page composite patterns
│   └── sections/        Hero, ServiceInfo, AboutPreview, MinistriesPreview, SermonsPreview,
│                        EventsPreview, GalleryPreview, CTASection — homepage building blocks
├── pages/               One component per route; admin pages under pages/admin/
├── routes/              router.tsx — the single source of truth for the route tree
├── hooks/               usePageMeta, useScrolled, and future data-fetching hooks (M3)
├── lib/                cn() and other framework-agnostic helpers
├── types/               content.ts — shapes mirroring the future backend models
├── data/               site.ts (nav/site config), placeholders.ts (sample sermons/events/ministries),
│                        gallery.ts (the two verified real photos)
└── styles/             (reserved — everything currently lives in index.css)
```

`components/sections` was populated in Milestone 2 per the "meaningful UI concepts, not one giant page component" principle: `Home.tsx` composes 8 section components rather than containing the homepage inline. `styles/` remains an empty placeholder — nothing has yet justified splitting styles out of `index.css`.

### Data flow (current vs. future)

Public pages now read content from the API through `frontend/src/lib/api/` and the `useApi` / `useSiteSettings` hooks. Components render the same `Sermon`/`ChurchEvent`/`Ministry`/etc. types defined in `src/types/content.ts`, which mirror the backend models field-for-field:

```text
Milestone 1:  src/data/placeholders.ts  →  page component
MongoDB → Express API (`/api`) → `lib/api` client → `useApi` hook → `AsyncList` / page component
```

### Environment variables

Frontend env vars must be prefixed `VITE_` to be exposed to client code (Vite convention). See [`.env.example`](../.env.example) and [`frontend/.env.example`](../frontend/.env.example). `VITE_API_URL` is used by the API client (default `http://localhost:5000/api`).

## Backend (Milestone 3)

Node.js + Express 5 + TypeScript + Mongoose, exposing an unversioned public REST API under `/api`. Endpoints are listed in [API.md](API.md); database models and setup in [DATABASE.md](DATABASE.md). Milestone 4 adds bearer-token admin authentication and authenticated CMS endpoints under `/api/admin`, plus media uploads served from `/uploads`. The `/api/v1` prefix described in BACKEND_PLAN.md is deferred — the API is currently unversioned.

## Database (Milestone 3)

MongoDB Atlas. Connection string via `MONGODB_URI` (see `.env.example`), never committed. No cluster has been provisioned as part of this milestone.

## Admin dashboard (Milestone 4)

A protected route subtree (`/admin/*`) inside the same frontend app. It shares the design system and uses `AdminLayout` (sidebar on large screens, a collapsible menu on small ones) instead of `SiteLayout`. `RequireAuth` redirects anonymous visitors to `/admin/login` and returns them to the page they asked for.

Every admin screen goes through the same centralized API client. Content sections (sermons, events, gallery, ministries, service sessions, announcements, team) share one generic `CrudPage` driven by a per-resource config (`src/pages/admin/resourceConfigs.ts`). Authorization is enforced by the API (`requireAuth` on `/api/admin`), not by hiding routes. See [DASHBOARD_PLAN.md](DASHBOARD_PLAN.md) for the screens and [API.md](API.md) for the endpoints.

## Deployment (not yet configured)

No CI/CD or hosting has been set up. The likely target shape — a static frontend build deployed to a CDN/static host, an Express API deployed as a Node service, MongoDB Atlas as managed database — is deferred to Milestone 5 ("Integration + production hardening + deployment") per [PROJECT_PLAN.md](../PROJECT_PLAN.md).

## Media storage (Milestone 5)

Uploaded images are stored in the MongoDB database (GridFS), not on the API server's disk. Most hosting platforms discard local disk on redeploy, so disk storage would lose images. Keeping them in the same database as the content adds no new vendor or credential and keeps the existing `/uploads/<name>` URLs that the CMS and website already use. Files are validated before storage and cleaned up when no record references them. See [DATABASE.md](DATABASE.md) and [DEPLOYMENT.md](DEPLOYMENT.md).

## Deployment (Milestone 5)

No hosting provider is chosen or configured by this repository. [DEPLOYMENT.md](DEPLOYMENT.md) lists what each part needs and the steps that require the church's own accounts.
