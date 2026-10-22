# API

Base path: `/api`. Implemented in `backend/src/`. All responses are JSON.

## Response envelope

Success:

```json
{ "success": true, "data": { } }
```

Paginated lists add `pagination`:

```json
{ "success": true, "data": [], "pagination": { "page": 1, "limit": 12, "total": 0, "totalPages": 1 } }
```

Errors:

```json
{ "success": false, "error": { "message": "Sermon not found.", "code": "NOT_FOUND" } }
```

Error codes in use: `VALIDATION_ERROR` (400), `INVALID_ID` (400), `INVALID_PARAM` (400), `INVALID_JSON` (400), `UNSUPPORTED_FILE` (400), `NO_FILE` (400), `UNAUTHORIZED` (401), `INVALID_CREDENTIALS` (401), `NOT_FOUND` (404), `ROUTE_NOT_FOUND` (404), `FILE_TOO_LARGE` (413), `PAYLOAD_TOO_LARGE` (413), `DUPLICATE_KEY` (409), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500). Stack traces and internal messages are never returned in production.

## Public endpoints (no authentication)

These return only published content. Internal fields (`isPublished`, `isArchived`, `__v`, `_id`) are removed; each document exposes `id`.

| Method | Path | Paginated | Notes |
|---|---|---|---|
| GET | `/api/health` | — | 200 when the database is connected, 503 otherwise |
| GET | `/api/sermons` | yes | `?category=`, by `date` descending |
| GET | `/api/sermons/:slug` | — | 404 if missing or unpublished |
| GET | `/api/events` | yes | `?upcoming=true` returns events on/after now, ascending |
| GET | `/api/events/:slug` | — | |
| GET | `/api/announcements` | yes | published and not archived, by `publishedAt` descending |
| GET | `/api/announcements/:slug` | — | |
| GET | `/api/ministries` | no | by `displayOrder`, then `name` |
| GET | `/api/ministries/:slug` | — | |
| GET | `/api/service-sessions` | no | recurring sessions, by `displayOrder`, then `name` |
| GET | `/api/service-units` | no | `?ministry=<ministry-slug>`; unknown slug returns `[]` |
| GET | `/api/service-units/:slug` | — | |
| GET | `/api/gallery` | yes | `?category=`, by `displayOrder`, then `createdAt` descending |
| GET | `/api/leadership` | no | by `displayOrder` |
| GET | `/api/site-settings` | — | singleton |
| POST | `/api/contact` | — | creates a contact submission; rate limited (5 per IP per 15 minutes) |

Pagination query parameters: `page` (default 1), `limit` (default 12, max 100).

Contact body: `name` (2–120 characters, required), `email` (required), `message` (10–5000 characters, required), `phone` (optional, max 40), `subject` (optional, max 200). Success returns `201` with `{ "received": true, "id": "…" }`.

Uploaded media paths (`/uploads/…`) are returned as relative paths. Clients resolve them against the API origin. Seeded NFPC photos use `/photos/…` and are served by the frontend.

## Authentication

Admin access uses a bearer token.

1. `POST /api/auth/login` with `{ "email", "password" }`. Returns `{ "token", "user": { "id", "email", "name" } }`. Unknown emails and wrong passwords return the same `401 INVALID_CREDENTIALS` response. Login is rate limited to 10 attempts per IP per 15 minutes.
2. Send `Authorization: Bearer <token>` on every admin request.
3. Tokens are HS256 JWTs signed with `JWT_SECRET`, valid for `JWT_EXPIRES_IN` (default 8 hours). The server rechecks each token against the account's `tokenVersion` on every request.
4. `GET /api/auth/me` returns the signed-in user.
5. `POST /api/auth/logout` increments `tokenVersion`. Every token issued before that point stops working immediately, on the server, not just in the browser. Because the app has a single admin account, this signs out all sessions for that account.

Passwords are hashed with bcrypt (cost 12). Hashes and token versions are never returned by any endpoint.

## Admin endpoints

Every route under `/api/admin` requires a valid session. Without one, the response is `401 UNAUTHORIZED` before any handler runs.

Each content resource supports the same operations:

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/admin/<resource>?page&limit` | all records, including drafts and archived; paginated (max 100) |
| GET | `/api/admin/<resource>/:id` | one record |
| POST | `/api/admin/<resource>` | create; `201`. Slug is generated from the title or name when omitted |
| PATCH | `/api/admin/<resource>/:id` | partial update; omitted fields are unchanged |
| DELETE | `/api/admin/<resource>/:id` | delete; returns `{ "deleted": true, "id" }` |

Resources (`<resource>`): `sermons`, `events`, `gallery`, `ministries`, `service-sessions`, `announcements`, `leadership`.

Clearing a value: on PATCH, send an empty string (or `null`) for an optional field to clear it (for example `"rsvpUrl": ""`). Slugs and enums can't be cleared this way; enums accept `""` to mean "none".

Publishing: `isPublished: true` makes a record visible on the website. Announcements also take `isArchived: true`, which hides them from the website and keeps the record.

### Field rules (summary)

| Resource | Required on create | Notes |
|---|---|---|
| sermons | title, description, speaker, date | `category` from a fixed list; `thumbnail` (media); `videoUrl`, `audioUrl` (http/https URLs) |
| events | title, description, date | `startTime`, `endTime` as `HH:MM`; `category` from a fixed list; `rsvpUrl` (http/https URL, clearable); `image`; `location` |
| gallery | imageUrl, altText | `category`, `title`, `caption`, `displayOrder` |
| ministries | name, shortDescription, description | `image`, `meetingInfo`, `contactInfo`, `displayOrder` |
| service-sessions | name, dayOfWeek, startTime | `dayOfWeek` is a weekday name; `endTime` optional; `platform` (`in-person`, `online`, `hybrid`); `locationName`; `meetingUrl` (clearable); `description`; `displayOrder` |
| announcements | title, content | `publishedAt`, `image`, `isArchived` |
| leadership | name, role | `bio`, `image`, `socialLinks` (`facebook`, `instagram`, `twitter`, `website`; each clearable), `displayOrder` |

Media fields accept an http(s) URL, a path returned by the upload endpoint (`/uploads/…`), or a seeded `/photos/…` path. Anything else is rejected.

### Media upload

`POST /api/admin/uploads` with `multipart/form-data`, one file in the `file` field.

- Allowed types: JPEG, PNG, GIF, WebP.
- Maximum size: 5 MB.
- The file's leading bytes must match its declared type. Mismatched files are deleted and rejected.
- Stored in MongoDB GridFS under a random server-chosen name; the client filename is never used. Deleting the last record that uses a file deletes the file; a file still used elsewhere is kept, and a replaced image is removed when nothing else uses it.
- Returns `201` with `{ "url": "/uploads/<name>", "mimeType", "size" }`.
- Served from `GET /uploads/<name>` (public, read-only) with `X-Content-Type-Options: nosniff`, a cross-origin resource policy so the website can display them, and a one-year immutable cache. Only server-generated names are served.

### Contact messages (admin)

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/admin/messages?status=new\|read\|archived&page&limit` | newest first |
| GET | `/api/admin/messages/:id` | one message |
| PATCH | `/api/admin/messages/:id` | body `{ "status": "new" \| "read" \| "archived" }`. `new` is unread |
| DELETE | `/api/admin/messages/:id` | permanent delete |

### Site settings (admin)

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/admin/settings` | the singleton |
| PATCH | `/api/admin/settings` | partial update. Empty strings clear a value. `churchName` cannot be cleared. `email` must be a valid address. `socials` takes `facebook`, `instagram`, `twitter` URLs |

Settings covers church name, motto, description, aboutDescription, email, phone, address, footer note, and social links. `description` feeds the homepage hero; `aboutDescription` is the independent copy for the homepage's brief About section. Service times are managed as service sessions, not in settings.

## Health

`GET /api/health` returns `{ success, data: { status, environment, database, uptimeSeconds } }`. `status` is `ok` or `degraded`; `database` is `connected` or `disconnected`.

## Security headers and CORS

Helmet is applied to all responses. CORS allows only the origin in `FRONTEND_URL`. No wildcard.

## Frontend client

The frontend calls this API only through `frontend/src/lib/api/`: `client.ts` is the single `fetch` wrapper (it attaches the token and turns a `401` into a signed-out state), `resources.ts` has the public functions, and `admin.ts` has the admin functions. Base URL comes from `VITE_API_URL`.
