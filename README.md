# National Freedom Pentecostal Church — V2

A rebuild of NFPC's website: from a static, beginner-era HTML/CSS/Bootstrap site into a modern public website, a REST API, MongoDB Atlas, and a church-administration dashboard. See [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for the full five-milestone roadmap.

## Repository layout

```text
legacy/     The original site, preserved as-is for reference (see docs/LEGACY_AUDIT.md)
frontend/   React + TypeScript + Vite + Tailwind CSS + React Router (see frontend/README.md)
docs/       Architecture, design system, backend/dashboard plans, migration notes
```

`backend/` is the Express + Mongoose public API. See [`docs/API.md`](docs/API.md) and [`docs/DATABASE.md`](docs/DATABASE.md).

## Where to start reading

- [`PROJECT_PLAN.md`](PROJECT_PLAN.md) — the five milestones, what's done and what's next.
- [`docs/LEGACY_AUDIT.md`](docs/LEGACY_AUDIT.md) — what existed in the original site and what it means for the rebuild.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the pieces fit together, and why.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — typography, color, and component conventions.
- [`docs/API.md`](docs/API.md) / [`docs/DATABASE.md`](docs/DATABASE.md) — the implemented public API and data models.
- [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md) / [`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md) — backend architecture and the planned admin dashboard (Milestone 4).
- [`docs/MIGRATION_NOTES.md`](docs/MIGRATION_NOTES.md) — exactly what moved, what didn't, and what's still pending confirmation from church leadership.

## Running the backend and the admin dashboard

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI, JWT_SECRET, FRONTEND_URL
npm run dev            # API on http://localhost:5000/api
```

Create the admin account once (values come from your shell, never from a file):

```bash
ADMIN_EMAIL=you@example.org ADMIN_NAME="Your Name" ADMIN_PASSWORD="at least 12 characters" npm run create-admin
```

Then open http://localhost:5173/admin/login. See [`docs/API.md`](docs/API.md) for the endpoints and [`docs/DATABASE.md`](docs/DATABASE.md) for setup, including Atlas, which is not yet verified.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

See [`frontend/README.md`](frontend/README.md) for build/lint/typecheck commands.

## Environment variables

Copy [`.env.example`](.env.example) to a real `.env` (never committed — see `.gitignore`). Frontend-specific variables also have a scoped example at [`frontend/.env.example`](frontend/.env.example).

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). The repository does not deploy anything by itself. Atlas and hosting steps need the church's accounts and are listed there as remaining work.
