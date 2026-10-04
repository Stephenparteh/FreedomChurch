# NFPC V2 — Project Plan

National Freedom Pentecostal Church's website is being rebuilt from a static, beginner-era HTML/CSS/Bootstrap site into a modern, maintainable platform: a public website, a REST API, MongoDB Atlas, and a church-administration dashboard. The rebuild happens across five milestones. This document tracks all five at a glance; each milestone's detailed output lives in [`docs/`](docs/).

## Milestone 1 — Repository audit, architecture & modern frontend foundation ✅ (this milestone)

- Audited the entire legacy site: every page, asset, and piece of functionality ([`docs/LEGACY_AUDIT.md`](docs/LEGACY_AUDIT.md)).
- Preserved the legacy site untouched under [`legacy/`](legacy/) (moved via `git mv`, history intact).
- Established the target architecture ([`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).
- Scaffolded the new frontend: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router, with a scalable folder structure, routing for every planned public page plus admin route shells, and a starter design system (tokens, typography, `Button`/`Card`/`Container`/`Section` primitives) — see [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- Documented the future backend ([`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md)) and admin dashboard ([`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md)) without building either.
- Documented exactly what was and wasn't migrated ([`docs/MIGRATION_NOTES.md`](docs/MIGRATION_NOTES.md)), including facts left unconfirmed rather than invented.
- Verified the app builds, typechecks, lints clean, and renders correctly in a real browser.

## Milestone 2 — Modern public website ✅

- Rebuilt the homepage as a composition of 8 section components (`Hero`, `ServiceInfo`, `AboutPreview`, `MinistriesPreview`, `SermonsPreview`, `EventsPreview`, `GalleryPreview`, `CTASection`) instead of one page-level file.
- Rebuilt About, Ministries, Sermons, Events, Gallery, and Contact with production-quality layout — intentional composition (alternating ministry rows, functional sermon search/filter, honest empty states) instead of uniform card grids.
- Verified, migrated, and optimized real NFPC assets discovered by actually opening the legacy images: the genuine church crest/logo and motto ("You Must Be Free"), and two genuine congregation photos — now used in the header, footer, homepage hero, About page, and `/gallery`. Also *excluded* `church.jpg` after confirming it depicts a different, non-NFPC building — see [`docs/LEGACY_AUDIT.md`](docs/LEGACY_AUDIT.md).
- Added scroll-aware header behavior (transparent-over-hero on the homepage, solid elsewhere/on-scroll), a mobile nav panel with a backdrop and scroll lock, and a reduced-motion-respecting `Reveal` scroll-entrance primitive — no new animation dependency.
- Did not fabricate leadership names, service times, contact details, ministry copy, sermons, events, or testimonials — every unconfirmed fact is a visible `TODO_CONFIRM_*` string, catalogued in [`docs/MISSING_CONTENT.md`](docs/MISSING_CONTENT.md).
- No backend or admin-dashboard functionality was built — out of scope per the milestone brief.
- Verified: clean build, clean lint, zero browser console errors across all 8 public pages at desktop (1440px) and mobile (390px) viewports, real-browser screenshots reviewed.

## Milestone 3 — Backend + MongoDB + dynamic content (complete pending review)

- Express 5 + TypeScript API in `backend/`, Mongoose models for all nine content/config collections, central error handling, zod validation, Helmet, restricted CORS, and rate limiting on `POST /api/contact`.
- Public read endpoints for sermons, events, announcements, ministries, service units, gallery, leadership, and site settings — published content only. See [`docs/API.md`](docs/API.md).
- Frontend public pages fetch through a centralized client (`frontend/src/lib/api/`); the static placeholder data files were removed. Loading, empty, and error states are implemented.
- Integration tests (vitest + supertest + an ephemeral MongoDB) cover the public API and error paths.
- Still required from the church: a MongoDB Atlas cluster and `MONGODB_URI`, and verified contact details, service times, leadership, and content. See [`docs/DATABASE.md`](docs/DATABASE.md) and [`docs/MISSING_CONTENT.md`](docs/MISSING_CONTENT.md).

Implement the Express + TypeScript + Mongoose API against MongoDB Atlas, following [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md): all content models (Sermon, Event, Ministry, Announcement, GalleryItem, LeadershipMember, ContactSubmission, SiteSetting), public read endpoints, and the contact form actually submitting somewhere real. Wire the Milestone 2 frontend pages to fetch from this API instead of static data.

## Milestone 4 — Church administration dashboard (complete pending review)

- Bearer-token admin authentication with bcrypt password hashing, server-side logout, and login rate limiting. The admin account is created from the command line.
- Protected `/api/admin` endpoints for sermons, events, gallery, ministries, service sessions, announcements, team, contact messages, site settings, and image uploads. Unauthenticated requests are rejected at the API layer.
- Image uploads validated by type, size, and file contents, and stored under server-chosen names.
- Admin dashboard at `/admin/*` with login, a protected layout, and every CMS section. Changes appear on the public site.
- Service and Bible study sessions are data, not code: each session is its own record.
- Verified in automated tests (backend) and in a real browser (desktop and mobile). See [`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md).
- Not verified: Atlas production connection, persistent upload storage on the hosting platform. Both are Milestone 5 items.

Implement real authentication/authorization and the full admin UI described in [`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md) behind the `/admin/*` route shells already in place: CRUD for every content type, publish/unpublish workflows, site settings management, contact-submission inbox.

## Milestone 5 — Integration + production hardening + deployment

End-to-end integration testing, performance and accessibility passes, real SEO metadata across all pages, error monitoring, CI/CD, and deployment (frontend to a static host/CDN, backend as a Node service, MongoDB Atlas as the managed production database). Real environment variables and secrets provisioned outside the repository.

---

Each milestone builds strictly on the last — no milestone skips ahead into a later one's scope (e.g. no payment integration, no full CMS, no production credentials until Milestone 5).
