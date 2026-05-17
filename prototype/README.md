# KaamChor — runnable prototype

Mobile-first prototype of the **Workers-on-Wheels** platform for the Delhi NCR pilot. Three roles share a single login:

- **Job finder** — Tinder-style swipeable job deck, with accept / reject
- **Job lister** — post a job (title, description, skills, zone, duration, budget) and see your posts
- **Admin** — KPI dashboard with live charts (downloads, listings, acceptance vs rejection, jobs per zone, activity trend)

The nav bar lives at the **bottom of the screen** because the surface is mobile-first.

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+

## Install

```bash
cd prototype
npm install
```

## Run (API + web)

From `prototype/`:

```bash
npm run dev
```

- **API:** http://localhost:3001
- **Web UI:** http://localhost:5173 (proxied to the API)

Or run each workspace in its own terminal:

```bash
npm run dev -w api
npm run dev -w web
```

## Demo accounts

The API seeds these on first start. Password for all: **`demo1234`**.

| Role   | Email              | After login lands on                    |
| ------ | ------------------ | --------------------------------------- |
| finder | finder@demo.com    | Discover jobs (swipeable cards)         |
| lister | lister@demo.com    | Post a job (create + my posts)          |
| admin  | admin@demo.com     | Dashboard with charts                   |

You can also sign up as a finder or lister from the same login screen — role is picked during signup. Admin cannot self-signup (seeded only).

## API surface

Auth:

- `POST /api/v1/auth/signup` `{ email, password, name, role }` → `{ token, user }`
- `POST /api/v1/auth/login` `{ email, password }` → `{ token, user }`
- `GET  /api/v1/auth/me` (Bearer) → `{ user }`

Jobs (role-gated, Bearer):

- `GET  /api/v1/jobs/deck`     (finder) — open jobs you haven't swiped on
- `GET  /api/v1/jobs/accepted` (finder) — jobs you accepted
- `GET  /api/v1/jobs/mine`     (lister) — jobs you posted
- `POST /api/v1/jobs`          (lister) — create a job
- `POST /api/v1/jobs/:id/swipe` (finder) `{ action: "accept" | "reject" }`

Admin:

- `GET  /api/v1/admin/stats` (admin) — aggregated KPIs for the dashboard

## Data

- Zones: [shared/ncr-pilot-zones.geojson](shared/ncr-pilot-zones.geojson) (same file as the planning assets)
- Services: [shared/service-catalog.json](shared/service-catalog.json)

## Production build (smoke test)

```bash
npm run build -w api
npm run build -w web
```

Run API from `api/`: `npm start` (requires `npm run build -w api` first).

## Scope limits

- Users, jobs, and swipes are stored **in memory**; restarting the API clears everything (seeds re-run).
- JWT secret is a dev-only constant; override with `JWT_SECRET` env var in real deployments.
- No SMS/OTP, no payments, no worker geolocation, no push notifications yet.

Planning docs live in the parent folder: [../00-planning-handoff.md](../00-planning-handoff.md).
