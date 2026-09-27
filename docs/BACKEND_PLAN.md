# Backend Plan (Milestone 3 — not implemented yet)

This document is the architecture and contract the backend will follow when it's built. No `backend/` directory, API server, or database connection exists yet — this milestone establishes the plan only, per the milestone brief's explicit instruction not to build the API prematurely.

## Structure

```text
backend/
├── src/
│   ├── config/          env loading, DB connection setup
│   ├── models/           Mongoose schemas (one file per model below)
│   ├── routes/           Express routers, one per resource
│   ├── controllers/     request handlers (thin — validate, call service, respond)
│   ├── middleware/     auth guard, error handler, request validation
│   ├── services/         business logic, decoupled from Express req/res
│   └── app.ts            Express app assembly
├── package.json
└── tsconfig.json
```

Node.js + Express + TypeScript + Mongoose. Express over a heavier framework (NestJS, etc.) because the API surface is modest (content CRUD + auth) and doesn't need dependency-injection machinery; Mongoose over the native MongoDB driver for schema validation and a familiar model layer.

## API architecture

- REST, JSON, versioned under `/api/v1/...` from day one so breaking changes later don't require a new base path negotiation.
- Public read endpoints (sermons, events, ministries, announcements, gallery, published leadership/settings) require no authentication.
- Write endpoints (create/update/delete on any resource, plus reading contact submissions) require an authenticated admin session.
- Frontend consumes this API over `VITE_API_URL` (see `.env.example`) — never talks to MongoDB directly.

## Authentication & authorization strategy

- Single role for Milestone 3/4: `AdminUser`. No public user accounts are planned (the site has no member-facing login) — only church staff authenticate, to manage content.
- Session approach: HTTP-only, signed cookie holding a JWT (or an opaque session id backed by a `sessions` collection — final choice made in Milestone 4 alongside the actual login UI). HTTP-only avoids exposing the token to client-side JS (XSS mitigation).
- Passwords hashed with `bcrypt` (or `argon2`) — never stored or logged in plaintext.
- `AUTH_SECRET` env var signs tokens; generated once, rotated only with a deliberate re-auth plan (not done casually, since it invalidates all sessions).
- Authorization is currently a single tier (any authenticated admin can manage any content). Per-resource roles (e.g. an editor who can't touch Settings) are **not** planned for Milestone 3/4 — flagged here as a possible Milestone 5+ enhancement only if the church actually needs multiple staff accounts with different permissions.

## Mongoose / MongoDB strategy

- One collection per model below, connected via `MONGODB_URI` (MongoDB Atlas, never a local/embedded DB in production).
- Timestamps (`createdAt`/`updatedAt`) on every schema via Mongoose's built-in `timestamps: true`.
- Soft "publish state" (`draft` | `published`) on content models rather than hard delete for anything an admin might want to unpublish-then-restore (sermons, events, announcements). Hard delete remains available but is a distinct action from unpublishing.
- No relational joins beyond simple ObjectId references (e.g. a `Sermon` may reference a `LeadershipMember` as preacher) — resolved with `.populate()` where the frontend needs the nested data, not denormalized copies.

## Expected collections/models

| Model | Purpose | Key fields | Public read? | Auth required to write? |
|---|---|---|---|---|
| `AdminUser` | Church staff accounts | email, passwordHash, name, createdAt | No | Yes (admin-only, no public signup) |
| `Sermon` | Sermon library entries | title, preacher, date, series, description, thumbnailUrl, videoUrl, status | Yes (published only) | Yes |
| `Event` | Upcoming/past events | title, date, time, location, description, imageUrl, status | Yes (published only) | Yes |
| `Announcement` | Site announcements | title, body, publishedAt, status | Yes (published only) | Yes |
| `Ministry` | Ministry pages | name, summary, description, imageUrl, meetingInfo, status | Yes (published only) | Yes |
| `ServiceUnit` | Sub-groups within a ministry (if needed — confirm with church whether this granularity is real) | name, ministryId, description | Yes | Yes |
| `GalleryItem` | Photo gallery entries | imageUrl, caption, category | Yes | Yes |
| `LeadershipMember` | Leadership/staff bios | name, role, bio, photoUrl, order | Yes | Yes |
| `ContactSubmission` | Messages from the public contact form | name, email, phone, message, read (bool), createdAt | No (write-only from public; read is admin-only) | Read: yes. Create: no auth (public form) |
| `SiteSetting` | Singleton-ish document for church info, service times, social links, footer content | address, phone, email, serviceTimes[], socialLinks{}, updatedAt | Yes | Yes |

This mirrors the frontend's placeholder types in [`frontend/src/types/content.ts`](../frontend/src/types/content.ts) — those types were written to already match this shape so the eventual switch from placeholder data to live API data is a source swap, not a rewrite (see [ARCHITECTURE.md](ARCHITECTURE.md)).

## API versioning strategy

Prefix everything `/api/v1/`. Additive changes (new fields, new endpoints) don't bump the version; breaking changes (removed/renamed fields, changed auth requirements) would ship under `/api/v2/` with `v1` kept running until the frontend fully migrates — though in practice, since frontend and backend deploy together from the same team, a hard cutover is more likely than running both versions long-term.

## Error handling strategy

- A single Express error-handling middleware returns a consistent shape: `{ error: { message, code } }` with an appropriate HTTP status.
- Validation errors return `400` with field-level detail; auth failures `401`/`403`; not-found `404`; unexpected errors `500` with the raw error logged server-side but never leaked to the client response.
- No stack traces or internal error messages reach the client in production.

## Validation strategy

- Request bodies validated at the route boundary (likely `zod`, given it pairs naturally with TypeScript inference) before reaching controllers — controllers can trust their input is already shaped correctly.
- Mongoose schema-level validation (`required`, enums for `status`, string length limits) acts as a second line of defense, not the only one.

## Environment variables

Documented in [`.env.example`](../.env.example):

```env
MONGODB_URI=
PORT=4000
AUTH_SECRET=
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

No real values are committed anywhere in this repository.

## Explicitly out of scope for Milestone 3

- Payment/donation processing (the `Give` page's actual money-movement functionality) — the milestone brief excludes this entirely; `ContactSubmission`-style intake for giving inquiries is the most this backend plan covers.
- File/image upload pipeline (e.g. S3-compatible storage for sermon thumbnails and gallery photos) — needed eventually, but the exact provider isn't chosen yet; flagged for a decision at the start of Milestone 3 rather than guessed at here.
- Search (full-text sermon search) — the legacy site's search UI was already non-functional decoration; real search is a nice-to-have layered on top of the CRUD API later, not a Milestone 3 requirement.
