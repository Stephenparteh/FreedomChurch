# Dashboard Plan (Milestone 4 — not implemented yet)

This document is the vision for the church administration dashboard. Route shells exist today (`/admin/login`, `/admin/dashboard`, `/admin/sermons`, `/admin/events`, `/admin/gallery`, `/admin/ministries`, `/admin/announcements`, `/admin/settings`) so the navigation structure is real, but every one of them currently renders a "planned for Milestone 4" placeholder (`AdminComingSoon`). No authentication, no data tables, no forms exist yet.

## Goal

Let a non-technical church administrator manage everything on the public site — sermons, events, ministries, gallery, announcements, site settings — without touching code or asking a developer to redeploy.

## Access

- `/admin/login` — the only unauthenticated admin route. Everything else under `/admin/*` will be guarded by a route-level auth check once real authentication exists (see [BACKEND_PLAN.md](BACKEND_PLAN.md)'s auth strategy — session cookie, single `AdminUser` role).
- The admin app shares the frontend's design system (same Tailwind theme, same `Button`/`Card` primitives) but uses its own `AdminLayout` (sidebar navigation) instead of the public site's `SiteLayout` (top nav + footer) — already built and in place.

## Dashboard overview (`/admin/dashboard`)

At-a-glance summary once wired to real data:

- Recent sermons (last N added)
- Upcoming events (next N by date)
- Recent announcements
- Unread contact submissions count
- Quick-action shortcuts (e.g. "Add sermon", "Add event")

## Sermons (`/admin/sermons`)

- List (table or card grid) with publish-state filter (draft/published).
- Create/edit form: title, preacher, date, series, description, thumbnail upload, video/audio link.
- Delete (with confirmation — this is a destructive action).
- Publish/unpublish toggle, separate from delete (see `SiteSetting`/content model note in BACKEND_PLAN.md about soft publish-state).

## Events (`/admin/events`)

- Create/edit: title, date, time, location, description, image.
- Publish/unpublish, delete.
- List view distinguishing upcoming vs. past (derived from date, not a separate manual field).

## Gallery (`/admin/gallery`)

- Add images (with the eventual upload pipeline from BACKEND_PLAN.md).
- Delete images.
- Categorize (freeform tag or fixed category list — decide with church input in Milestone 4).
- Captions.

## Ministries (`/admin/ministries`)

- Create/edit/delete: name, description, image, meeting information.

## Announcements (`/admin/announcements`)

- Create/edit, publish, archive (archive ≠ delete — kept for record, hidden from public site).

## Site settings (`/admin/settings`)

- Church info: name, mission/vision copy.
- Contact information: email, phone, address — this is the single authoritative source that replaces the legacy site's conflicting per-page contact details (see [LEGACY_AUDIT.md](LEGACY_AUDIT.md)).
- Social links.
- Service times.
- Footer information.

This maps directly onto the `SiteSetting` model in [BACKEND_PLAN.md](BACKEND_PLAN.md) and is what `src/data/site.ts`'s `TODO_CONFIRM_*` placeholders in the frontend get replaced by once this exists.

## Explicitly out of scope for Milestone 4

- Multiple permission tiers / roles beyond a single admin role (see BACKEND_PLAN.md's authorization note) — only build this if the church actually has multiple staff members who need restricted access.
- Any payment/donation management UI — the `Give` page's real functionality is out of scope for the entire V2 rebuild per the milestone brief, not just this dashboard.
- Bulk import/export tooling — not requested, would be speculative.

## Why this exists now, unbuilt

Defining the field-level shape of each admin screen up front means Milestone 3's backend models (BACKEND_PLAN.md) and Milestone 4's actual dashboard UI are designed against the same target, instead of the backend being built first and the dashboard discovering gaps in it later.
