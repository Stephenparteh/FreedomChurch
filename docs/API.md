# API

Base path: `/api`. Implemented in `backend/src/`. All responses are JSON.

## Response envelope

Success:

```json
{ "success": true, "data": { } }
```

List endpoints that paginate add a `pagination` object:

```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 12, "total": 0, "totalPages": 1 }
}
```

Error:

```json
{ "success": false, "error": { "message": "Sermon not found.", "code": "NOT_FOUND" } }
```

Error codes in use: `VALIDATION_ERROR` (400), `INVALID_ID` (400), `INVALID_PARAM` (400), `NOT_FOUND` (404), `ROUTE_NOT_FOUND` (404), `DUPLICATE_KEY` (409), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500). Stack traces and internal messages are not returned in production.

Public content endpoints only return documents with `isPublished: true`. Internal fields (`isPublished`, `__v`, `_id`) are not returned; each document exposes `id` instead.

## Endpoints

| Method | Path | Paginated | Notes |
|---|---|---|---|
| GET | `/api/health` | — | 200 when the database is connected, 503 otherwise |
| GET | `/api/sermons` | yes | `?category=`, sorted by `date` descending |
| GET | `/api/sermons/:slug` | — | 404 if missing or unpublished |
| GET | `/api/events` | yes | `?upcoming=true` returns events on/after now, ascending; otherwise descending |
| GET | `/api/events/:slug` | — | |
| GET | `/api/announcements` | yes | sorted by `publishedAt` descending |
| GET | `/api/announcements/:slug` | — | |
| GET | `/api/ministries` | no | full published list, sorted by `displayOrder` then `name` |
| GET | `/api/ministries/:slug` | — | |
| GET | `/api/service-units` | no | `?ministry=<ministry-slug>`; unknown slug returns `[]` |
| GET | `/api/service-units/:slug` | — | |
| GET | `/api/gallery` | yes | `?category=`, sorted by `displayOrder` then `createdAt` descending |
| GET | `/api/leadership` | no | sorted by `displayOrder` |
| GET | `/api/site-settings` | — | singleton; created on first request with verified defaults only |
| POST | `/api/contact` | — | the only public write endpoint; rate limited |

Pagination query parameters: `page` (default 1), `limit` (default 12, max 100). Invalid values fall back to the defaults.

## Contact submission

`POST /api/contact` with a JSON body:

| Field | Required | Rules |
|---|---|---|
| `name` | yes | 2–120 characters |
| `email` | yes | valid email, max 200 |
| `message` | yes | 10–5000 characters |
| `phone` | no | max 40 |
| `subject` | no | max 200 |

Success returns `201` with `{ "received": true, "id": "<id>" }`. The stored submission is not returned and is not readable through any public endpoint. Limit: 5 requests per IP per 15 minutes (`429`, `RATE_LIMITED`). Request bodies are capped at 100 KB.

## Health

`GET /api/health` returns `{ success, data: { status, environment, database, uptimeSeconds } }`. `status` is `ok` or `degraded`; `database` is `connected` or `disconnected`. No connection string or secret is included.

## Security headers and CORS

Helmet is applied to all responses. CORS allows only the origin in `FRONTEND_URL` (no wildcard).

## Frontend client

The frontend calls this API only through `frontend/src/lib/api/` (`client.ts` for the fetch wrapper, `resources.ts` for typed functions) and the `useApi` / `useSiteSettings` hooks. Base URL comes from `VITE_API_URL`.
