# National Freedom Pentecostal Church — V2

A rebuild of NFPC's website: from a static, beginner-era HTML/CSS/Bootstrap site into a modern public website, a REST API, MongoDB Atlas, and a church-administration dashboard. See [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for the full five-milestone roadmap.

## Repository layout

```text
legacy/     The original site, preserved as-is for reference (see docs/LEGACY_AUDIT.md)
frontend/   React + TypeScript + Vite + Tailwind CSS + React Router (see frontend/README.md)
docs/       Architecture, design system, backend/dashboard plans, migration notes
```

`backend/` does not exist yet — it's planned for Milestone 3 ([`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md)).

## Where to start reading

- [`PROJECT_PLAN.md`](PROJECT_PLAN.md) — the five milestones, what's done and what's next.
- [`docs/LEGACY_AUDIT.md`](docs/LEGACY_AUDIT.md) — what existed in the original site and what it means for the rebuild.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the pieces fit together, and why.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — typography, color, and component conventions.
- [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md) / [`docs/DASHBOARD_PLAN.md`](docs/DASHBOARD_PLAN.md) — the plan for the not-yet-built API and admin dashboard.
- [`docs/MIGRATION_NOTES.md`](docs/MIGRATION_NOTES.md) — exactly what moved, what didn't, and what's still pending confirmation from church leadership.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

See [`frontend/README.md`](frontend/README.md) for build/lint/typecheck commands.

## Environment variables

Copy [`.env.example`](.env.example) to a real `.env` (never committed — see `.gitignore`). Frontend-specific variables also have a scoped example at [`frontend/.env.example`](frontend/.env.example).
