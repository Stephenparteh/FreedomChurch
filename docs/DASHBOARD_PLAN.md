# Dashboard Plan (Milestone 4 — implemented)

The administration dashboard is implemented. This document describes the screens and how they map to the API. It replaces the Milestone 1 placeholder description.

## Screens

| Route | Purpose |
|---|---|
| `/admin/login` | Sign in. Unauthenticated visitors to any `/admin` page are sent here and returned afterward. |
| `/admin` | Dashboard: counts for each section, unread messages, recent messages. |
| `/admin/messages` | Contact-form inbox: filter by status, read/unread, archive, delete (with confirmation). |
| `/admin/sermons` | Sermons: title, slug, preacher, date, category, description, thumbnail upload, video and audio links, publish/hide, delete. |
| `/admin/events` | Events: title, slug, date, start and end time, category, location, RSVP link, image upload, description, publish/hide, delete. |
| `/admin/gallery` | Photos: image upload, alt text, title, caption, category, display order, publish/hide, delete. |
| `/admin/ministries` | Ministries: name, slug, short and full description, image, meeting info, contact info, display order, publish/hide, delete. |
| `/admin/service-sessions` | Recurring sessions (for example Tuesday Bible study, Saturday debate): day, start and end time, platform, location, meeting link, notes, display order, publish/hide, delete. |
| `/admin/announcements` | Announcements: title, slug, date to show, content, image, publish/hide, archive, delete. |
| `/admin/team` | Team and leadership: name, role, biography, photo, social links, display order, publish/hide, delete. |
| `/admin/settings` | Church name, motto, description, email, phone, address, footer note, social links. |

Every list shows status (Published or Draft, and Archived where it applies). Deleting asks for confirmation inline. Forms show server validation messages and success feedback.

## How it's built

- One generic list-and-form screen (`CrudPage`) is configured per resource in `frontend/src/pages/admin/resourceConfigs.ts`. Adding a field is a one-line change.
- Date and time inputs are native `date`, `datetime-local`, and `time` controls.
- Category and day fields are dropdowns whose options match the API's fixed lists.
- Image fields upload immediately through `/api/admin/uploads`; see [API.md](API.md).
- Authorization is enforced by the API. Hiding a link in the UI is not a security boundary.

## Not included in Milestone 4

- Multiple admin accounts or roles. There is one admin account, created from the command line.
- Password change or reset screens. Use `npm run create-admin` to reset the password.
- Drag-and-drop reordering. Ordering uses a numeric display order field.
- Pagination controls in the dashboard. Lists show up to 100 records.
- A separate public announcements page. Announcements appear on the homepage.
- Deleting uploaded files when their record is deleted (see [DATABASE.md](DATABASE.md)).
- Admin screens for `ServiceUnit`. The model and public read endpoints exist, but nothing is managed for them yet, and the church has not confirmed that service units are a separate concept from ministries.

## Original goals (for reference)

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
