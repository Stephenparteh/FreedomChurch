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

## Milestone 2 — Modern public website

Build out the real public pages against the foundation from Milestone 1: full homepage, About, Ministries, Sermons, Events, Gallery, Give, and Contact pages with production-quality layout, imagery, and copy (once church leadership confirms the `TODO_CONFIRM_*` facts flagged in Milestone 1). Still content-static at this point — pages render placeholder/confirmed content directly, not yet fetched from a live API.

## Milestone 3 — Backend + MongoDB + dynamic content

Implement the Express + TypeScript + Mongoose API against MongoDB Atlas, following [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md): all content models (Sermon, Event, Ministry, Announcement, GalleryItem, LeadershipMember, ContactSubmission, SiteSetting), public read endpoints, and the contact form actually submitting somewhere real. Wire the Milestone 2 frontend pages to fetch from this API instead of static data.

## Milestone 4 — Church administration dashboard

Implement real authentication/authorization and the full admin UI described in [`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md) behind the `/admin/*` route shells already in place: CRUD for every content type, publish/unpublish workflows, site settings management, contact-submission inbox.

## Milestone 5 — Integration + production hardening + deployment

End-to-end integration testing, performance and accessibility passes, real SEO metadata across all pages, error monitoring, CI/CD, and deployment (frontend to a static host/CDN, backend as a Node service, MongoDB Atlas as the managed production database). Real environment variables and secrets provisioned outside the repository.

---

Each milestone builds strictly on the last — no milestone skips ahead into a later one's scope (e.g. no payment integration, no full CMS, no production credentials until Milestone 5).
