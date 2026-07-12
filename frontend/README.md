# Verdantis — Intelligence for Sustainable Enterprises

AI-powered ESG management platform frontend. Built with React + Vite, Tailwind CSS, React Router, Recharts, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 — the Dashboard is the default route (`/`).

## What's built so far

- Project scaffold (Vite + Tailwind + Router config)
- `MainLayout` — sidebar + top navbar shell used by every authenticated page
- `Sidebar` — grouped navigation, collapsible, active-state indicator
- `Navbar` — page title, global search, notifications dropdown, profile menu, mobile menu trigger
- `MobileSidebar` — slide-over navigation for small screens
- **Dashboard** — fully built:
  - Welcome banner
  - Environmental / Social / Governance score cards
  - KPI row: Carbon Emission, CSR Activities, Employee Participation, Compliance
  - `ESGGauge` — signature triple-arc score visualization (this is Verdantis' visual identity element, reused on later pages)
  - Carbon trend chart (actual vs. target)
  - Department-wise carbon bar chart
  - Sustainability goals progress
  - CSR progress + Governance progress cards
  - Recent activities, upcoming audits, employee leaderboard
  - AI recommendation card + quick actions

All other routes (Environmental, Carbon Accounting, CSR, Governance, Challenges, Leaderboard, Reports, Employees, Notifications, Settings, Login) are wired into the router with a placeholder page so navigation works end-to-end — they're next in the build queue.

## Design system

- Primary: `#16A34A` (brand-600) · Background: `#F8FAFC` (ink-50) · Cards: white · Text: ink-800 (`#1E293B`)
- Secondary accents used sparingly for data differentiation: Social `#7C3AED`, Governance `#2563EB`, Teal (built-in Tailwind teal-600) for CSR
- Type: **Manrope** (display/headings), **Inter** (body/UI), **IBM Plex Mono** (all numeric data — KPIs, table figures, chart values)
- All mock data lives in `src/data/mockData.js` — swap for live API/Axios calls later without touching component markup

## Folder structure

```
src/
  components/
    common/       reusable UI primitives (Button, StatCard, ChartCard, ESGGauge, ProgressCard, Modal, etc.)
    layout/        Sidebar, Navbar, MobileSidebar
    dashboard/     composite widgets specific to the Dashboard page
  data/            mockData.js
  layouts/         MainLayout.jsx
  pages/           one file per route
  App.jsx
  main.jsx
  index.css
```
