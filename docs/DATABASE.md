# Database

MongoDB via Mongoose. Production target is MongoDB Atlas. Connection is configured only through the `MONGODB_URI` environment variable (see `backend/.env.example`). No credentials are stored in the repository.

## Database name

The database name is the path segment of `MONGODB_URI`. The recommended name for NFPC is `nfpc`:

```text
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nfpc
```

This project must not use another project's database. Local development, tests, and the seed script each take their database name from the URI they are given.

## Setting up Atlas (action required by the church's technical contact)

1. Create a free MongoDB Atlas account and cluster.
2. Create a database user with a strong password. Grant it read/write on the `nfpc` database only.
3. Under network access, allow the hosting provider's address range (or `0.0.0.0/0` only temporarily during setup).
4. Copy the connection string and set it as `MONGODB_URI` in `backend/.env` (local) or the hosting provider's environment settings (production). Never commit it.

Until `MONGODB_URI` is set to a reachable cluster, the server refuses to start with a clear error, and `/api/health` reports `disconnected`.

## Startup behavior

- `backend/src/config/env.ts` validates all environment variables at boot. A missing or invalid variable stops startup with a message naming the variable.
- `backend/src/config/db.ts` connects once at startup. A failed connection stops the process. The connection string is never logged.
- SIGINT/SIGTERM close the HTTP server and disconnect cleanly.

## Models

All models live in `backend/src/models/`. Each public-content model has `isPublished` (default `false`) and a JSON transform that removes `_id`, `__v`, and `isPublished` from output and adds `id`.

| Model | Purpose | Key fields | Indexes |
|---|---|---|---|
| `Sermon` | Sermon library | title, slug (unique), description, speaker, date, category, thumbnail, videoUrl, audioUrl | slug (unique), `isPublished`, `{isPublished, date}` |
| `Event` | Events | title, slug (unique), description, date, endDate, time, location, image | slug (unique), `isPublished`, `{isPublished, date}` |
| `Announcement` | Announcements | title, slug (unique), content, image, publishedAt | slug (unique), `isPublished`, `{isPublished, publishedAt}` |
| `Ministry` | Broad areas of church life | name, slug (unique), shortDescription, description, image, meetingInfo, contactInfo, displayOrder | slug (unique), `isPublished` |
| `ServiceUnit` | Smaller operational teams, optionally linked to a Ministry | name, slug (unique), description, ministry (ref), image | slug (unique), `isPublished` |
| `GalleryItem` | Photos | imageUrl, altText (required), caption, category, displayOrder | `category`, `displayOrder`, `isPublished` |
| `LeadershipMember` | Leadership | name, role, bio, image, displayOrder | `displayOrder`, `isPublished` |
| `ContactSubmission` | Contact form messages (never publicly readable) | name, email, phone, subject, message, status (`new`/`read`/`archived`) | `status` |
| `SiteSetting` | Singleton with church-wide settings | key (`default`), churchName, motto, description, email, phone, address, serviceTimes[], socials, logoUrl | `key` (unique) |

Ministry vs. service unit: a ministry is a public-facing area of church life. A service unit is a smaller team that may sit within or across ministries. The legacy site does not show NFPC organizing itself this way, so `ServiceUnit` ships with no data. Confirm during Milestone 4 whether the concept is used.

## Singleton: SiteSetting

`getOrCreateSiteSettings()` upserts the `default` document. On first creation only verified values are written: `churchName` ("National Freedom Pentecostal Church") and `motto` ("You Must Be Free"). Every other field is unset. The frontend shows `TODO_CONFIRM_*` text for unset contact fields, and an honest empty state for service times.

## Seed data

`npm run seed` (run from `backend/`) is optional and never runs on server start. It is idempotent (upserts by slug/key).

- Writes the `SiteSetting` singleton.
- Writes the three ministry names (Worship, Children's, Outreach) as published records. Their descriptions are `TODO_CONFIRM_DESCRIPTION` and short descriptions are `TODO_CONFIRM_SHORT_DESCRIPTION`.
- Writes the two verified congregation photos as published gallery items, pointing at `/photos/…` paths in `frontend/public/`.
- Writes records whose titles begin with `[DEV]` (a sample sermon, event, announcement, leader, and service unit). These are for exercising list rendering only and must not be presented as church content. Remove them from a real database before launch.

No sermons, events, leadership, or testimonies are seeded as real content.

## Tests

Integration tests use `mongodb-memory-server`: one real, ephemeral `mongod` per test run (`vitest.globalSetup.ts`), and one logical database per test file so parallel files do not interfere. Tests never touch Atlas and need no credentials.

## Indexing rationale

Indexes exist on `slug` (public lookups), `isPublished` (every public query filters on it), and the sort/filter fields used by list endpoints (`date`, `publishedAt`, `displayOrder`, `category`, `status`). Compound indexes lead with `isPublished` because every list query includes it. Free-text fields are not indexed; search is not part of the API.
