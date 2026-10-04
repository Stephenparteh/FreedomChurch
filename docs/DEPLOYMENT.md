# Deployment

This document describes what a deployment needs. The repository does not deploy anything by itself, and no hosting provider is configured. Every step marked **[church account]** needs the church's own accounts, which were not available when this was prepared.

## What runs where

| Part | Build | Runs as | Needs |
|---|---|---|---|
| Website and admin (`frontend/`) | `npm run build` produces static files in `frontend/dist/` | Any static host | `VITE_API_URL` at build time; SPA fallback (see below) |
| API (`backend/`) | `npm run build` produces `backend/dist/` | `npm start` (`node dist/server.js`) on a Node host | Environment variables below |
| Database | — | MongoDB Atlas cluster **[church account]** | `MONGODB_URI` |
| Uploaded images | — | Stored inside the Atlas database (GridFS) | Nothing extra; they follow `MONGODB_URI` |

Verified in this repository: both builds succeed; the compiled API starts in production mode and refuses an insecure `FRONTEND_URL`; uploads survive a full API restart; the production frontend build passes browser QA against that API. **Not verified:** a real Atlas cluster, and any real hosting provider.

## API environment variables

Set these in the hosting provider's environment settings. Never commit them. Full descriptions are in `backend/.env.example`.

| Variable | Production value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | Usually set by the host; defaults to 5000 |
| `MONGODB_URI` | Atlas connection string for the `nfpc` database **[church account]** |
| `FRONTEND_URL` | The exact https origin of the website, e.g. `https://www.your-domain.example` (no trailing slash) |
| `JWT_SECRET` | At least 32 random characters: `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | Optional. Default `8h` |
| `TRUST_PROXY` | `1` when the host puts one proxy in front of the API (typical), otherwise `0` |

In production the API refuses to start if `FRONTEND_URL` is not `https://`, or if `JWT_SECRET` is shorter than 32 characters. Startup errors name the variable and never print its value.

## Website environment variables

| Variable | Value |
|---|---|
| `VITE_API_URL` | The API base URL including `/api`, e.g. `https://api.your-domain.example/api`. Set before running `npm run build`. |

Vite embeds `VITE_*` values in the public JavaScript. Only public values belong here.

## Creating the admin account (once per environment)

After the database exists and `MONGODB_URI` is set, from the `backend/` folder:

```bash
ADMIN_EMAIL=... ADMIN_NAME="..." ADMIN_PASSWORD="..." npm run create-admin
```

Choose the password yourself (at least 12 characters). It is hashed with bcrypt before storage and is never printed or stored in source. Running the command again with the same email resets the password and signs out existing sessions. Do not record the password in the repository.

## Required steps, in order

1. **[church account]** Create the Atlas cluster, a database user for `nfpc` only, and network access for the hosting provider. See [DATABASE.md](DATABASE.md).
2. Deploy the API with the environment variables above and run `npm run build` then `npm start`. Confirm `GET /api/health` returns `200` with `"database":"connected"`.
3. Run the admin-creation command once against that database.
4. Build and host the website with `VITE_API_URL` set. Configure the host so that every unknown path serves `index.html` (single-page-app fallback). Without this, `/admin/...` and deep links return 404 on refresh.
5. Confirm `FRONTEND_URL` matches the website's exact origin, then sign in at `/admin/login`.
6. Enter the church's confirmed content (see [MISSING_CONTENT.md](MISSING_CONTENT.md)). Remove any `[DEV]` sample records, which exist only if the seed script was run.
7. Check that no `TODO_CONFIRM_` text remains on the public website before going live.

## Security posture (summary)

- Admin routes are protected at the API. Unauthenticated writes, uploads, settings changes, and message access are rejected (tested).
- Sessions: bearer token, 8-hour default lifetime, invalidated server-side on logout. The token lives in `sessionStorage`. The trade-off is documented in [BACKEND_PLAN.md](BACKEND_PLAN.md).
- Login: 10 attempts per client per 15 minutes. This depends on `TRUST_PROXY` being set correctly on a hosted platform; otherwise all users share one limit.
- CORS allows only `FRONTEND_URL`. Helmet sets standard security headers.
- Uploads: JPEG, PNG, GIF, or WebP only; 5 MB maximum; file contents must match the declared type; stored under server-generated names; served with `nosniff`.
- Errors in production do not include stack traces or internal messages.
- Only `/api/health` and the public content endpoints are open. Contact messages are never public.

## Not yet done (Milestone 5 remainder, or church decisions)

- No real Atlas or hosting verification (see above).
- No automated deployment pipeline. Deploys are manual until one is set up.
- No monitoring or error-reporting service is configured.
- No sitemap. Add one once the final domain is known.
- Choose the Atlas tier with the backups you need (see [DATABASE.md](DATABASE.md)).
