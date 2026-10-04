# Database

MongoDB via Mongoose. The production target is MongoDB Atlas. The connection is configured only through `MONGODB_URI` (see `backend/.env.example`). No credentials are stored in the repository.

## Database name

The database name is the path segment of `MONGODB_URI`. The recommended name for NFPC is `nfpc`:

```text
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nfpc
```

This project must not use another project's database. Local development, tests, and the seed script each take their database name from the URI they receive.

## Atlas setup (not yet done)

These steps need the church's account and cannot be completed from the repository. Atlas production readiness is **not verified**: every automated test in this repo uses an ephemeral in-memory MongoDB, and no Atlas cluster has been connected.

1. Create a MongoDB Atlas account and a cluster.
2. Create a database user with a strong password. Grant read/write on the `nfpc` database only.
3. Under network access, allow the hosting provider's address range.
4. Put the connection string in `backend/.env` (local) or the hosting provider's environment settings (production). Never commit it.
5. Create the admin account (see below).

Until `MONGODB_URI` points at a reachable cluster, the server refuses to start with a clear error, and `/api/health` reports `disconnected`.

## Startup behavior

- `backend/src/config/env.ts` validates every environment variable at boot. A missing or invalid value stops startup and names the variable. `JWT_SECRET` must be at least 32 characters.
- `backend/src/config/db.ts` connects once at startup. A failed connection stops the process. The connection string is never logged.
- SIGINT and SIGTERM close the HTTP server and disconnect cleanly.

## Admin account

The admin account is created from the command line, never from source code:

```bash
cd backend
ADMIN_EMAIL=... ADMIN_NAME="..." ADMIN_PASSWORD=... npm run create-admin
```

Run it again with the same email to reset the password; that also signs out existing sessions. `ADMIN_PASSWORD` must be at least 12 characters. Remove the variables from your shell afterward.

## Models

All models live in `backend/src/models/`. Each public content model has `isPublished` (default `false`). A JSON transform removes `_id`, `__v`, and `isPublished` from public output and adds `id`. Admin responses keep `isPublished` through a separate view (`adminJson`), and only authenticated routes use it.

| Model | Purpose | Key fields | Indexes |
|---|---|---|---|
| `AdminUser` | The single admin account | email (unique), name, passwordHash (never selected by default), tokenVersion | email (unique) |
| `Sermon` | Sermon library | title, slug (unique), description, speaker, date, category, thumbnail, videoUrl, audioUrl | slug (unique), `isPublished`, `{isPublished, date}` |
| `Event` | Events | title, slug (unique), description, date, endDate, startTime, endTime, category, location, rsvpUrl, image | slug (unique), `{isPublished, date}` |
| `Announcement` | Announcements | title, slug (unique), content, image, publishedAt, isArchived | slug (unique), `{isPublished, isArchived, publishedAt}` |
| `Ministry` | Broad areas of church life | name, slug (unique), shortDescription, description, image, meetingInfo, contactInfo, displayOrder | slug (unique), `isPublished` |
| `ServiceSession` | One recurring gathering (for example a Tuesday Bible study) | name, slug (unique), dayOfWeek, startTime, endTime, platform, locationName, meetingUrl, description, displayOrder | slug (unique), `{isPublished, displayOrder}` |
| `ServiceUnit` | Smaller operational teams, optionally linked to a Ministry | name, slug (unique), description, ministry (ref), image | slug (unique), `isPublished` |
| `GalleryItem` | Photos | imageUrl, altText (required), title, caption, category, displayOrder | `category`, `displayOrder`, `isPublished` |
| `LeadershipMember` | Team and leadership | name, role, bio, image, socialLinks, displayOrder | `displayOrder`, `isPublished` |
| `ContactSubmission` | Contact-form messages (never publicly readable) | name, email, phone, subject, message, status (`new`, `read`, `archived`) | `status` |
| `SiteSetting` | Singleton with church-wide settings | key (`default`), churchName, motto, description, email, phone, address, footerNote, socials, serviceTimes (legacy, not edited), logoUrl | `key` (unique) |

### Changes made in Milestone 4

- `Event`: the free-text `time` field is replaced by `startTime` and `endTime` (`HH:MM`). The public site never displayed `time`, so no visible data is lost. `category` (fixed list) and `rsvpUrl` are new.
- `Announcement`: `isArchived` is new. Archived announcements are excluded from the public list.
- `LeadershipMember`: `socialLinks` is new.
- `SiteSetting`: `footerNote` is new. Service times are now `ServiceSession` records. The old `serviceTimes` array is still present in the API for compatibility but is not shown on the website.
- `ServiceSession` and `AdminUser`: new.

### Default event image

No default event image exists in the schema, the seed data, or the code. `Event.image` is unset unless an admin uploads one.

## Verified content and placeholders

- `SiteSetting` is created with two verified values only: the church name and the motto "You Must Be Free". All other fields are unset. The website shows the unset contact details as `TODO_CONFIRM_*` text.
- Ministries seeded from the legacy site have the verified names. Their descriptions and short descriptions are `TODO_CONFIRM_*` placeholders until the church supplies text.
- `LeadershipMember` is empty. No names, roles, bios, or photos are invented.
- `ServiceSession` is empty. No meeting times or links are invented.

## Seed data

`npm run seed` (run from `backend/`) is optional. It is never run on server start. It is idempotent (it upserts by slug or key).

- Writes the `SiteSetting` singleton.
- Writes the three ministry names as published records, with `TODO_CONFIRM_*` descriptions.
- Writes the two verified congregation photos as published gallery items, pointing at `/photos/…` in `frontend/public/`.
- Writes records whose titles begin with `[DEV]`: a sample sermon, event, announcement, leader, and service unit. These exercise list rendering only and are not church content. Remove them before launch.

## Uploaded media

Uploaded images are stored in the same Atlas database, in a GridFS bucket named `uploads` (collections `uploads.files` and `uploads.chunks`). They persist across API restarts and redeploys, and they need no storage credential beyond `MONGODB_URI`. They are served from `/uploads/<name>`.

Deletion is safe by design:

- Deleting a record, or replacing its image, deletes the stored file only when no other record still references it.
- Seeded `/photos/…` files live in the frontend and are never touched.

Storage size counts against the cluster's storage limit. The free shared tier is small (512 MB), which is enough for a limited number of photos but should be checked against the expected library size before launch. Images are capped at 5 MB each.

## Backups

Data to protect: every collection in the `nfpc` database, including `uploads.files` and `uploads.chunks`, which hold the uploaded photos.

- **Atlas plan:** managed backups (snapshots) depend on the cluster tier. Free shared clusters do not include them. Confirm the backup feature for the chosen tier **[church account]** before launch.
- **Restore test:** a backup nobody has restored is not verified. Restore one to a scratch cluster before relying on it.
- **Manual export (if managed backups are unavailable):** `mongodump --uri "$MONGODB_URI" --out <folder>` on a schedule, stored somewhere outside the cluster. This was not run or verified in this repository.
- **Before any deployment that changes data:** take a fresh backup.

Nothing in the repository depends on a backup being in place; backups are an operations responsibility.

## Tests

Integration tests use `mongodb-memory-server`: one real, ephemeral `mongod` per test run (`vitest.globalSetup.ts`), and one logical database per test file, so parallel files do not interfere. Tests never touch Atlas and need no credentials. Upload tests write to a temporary directory.

## Indexing rationale

Indexes exist on `slug` (public lookups), `isPublished` (every public query filters on it), and the sort and filter fields used by list endpoints (`date`, `publishedAt`, `displayOrder`, `category`, `status`). Compound indexes lead with `isPublished` because every public list query includes it. Free-text fields are not indexed; search is not part of the API.
