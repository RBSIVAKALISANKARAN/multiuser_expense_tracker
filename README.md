# Multiuser Expense Tracker — PG/Hostel Student Finance Manager

A full-stack expense tracking app built specifically around the financial life of a student living in a PG (paying guest accommodation) or hostel — not a generic budgeting app. Every user gets their own private, authenticated account and sees only their own data, enforced at the database level with Supabase Row Level Security.

> **Status: work in progress.** The core flows (auth, dashboard, all expense categories, income, savings, shared expenses, settings) are built and functional, but I'm still actively debugging edge cases, polishing a few pages, and tightening up data validation. Expect some rough edges — see [Known Issues & What's Left](#known-issues--whats-left) below.

## Why This Project

Most budgeting apps assume a salaried adult with rent, groceries, and a few subscriptions. A student living away from home in a PG has a different shape of expenses entirely — mess fees with off-day refunds, semester-based academic costs, splitting an auto fare with a roommate, lending a friend money and tracking if they paid it back. I designed the data model and category system around that reality instead of bolting student categories onto a generic tracker.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Features](#core-features)
- [Expense Categories — Why So Granular](#expense-categories--why-so-granular)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Known Issues & What's Left](#known-issues--whats-left)
- [Possible Future Improvements](#possible-future-improvements)

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- React Router DOM v6
- Tailwind CSS
- Recharts (dashboard charts)
- lucide-react (icons)

**Backend / Data**
- Supabase (PostgreSQL + Auth + Storage)
- Row Level Security (RLS) policies on every table — no separate backend API server; the frontend talks to Supabase directly with the anon key, and Postgres enforces who can see/write what
- Supabase Storage for avatar uploads

**Tooling**
- ESLint + typescript-eslint
- TypeScript project references (`tsconfig.app.json` / `tsconfig.node.json`)

## Architecture

This isn't a traditional three-tier app with a custom Express/Node backend. It's a single React SPA that talks directly to Supabase:

```
┌────────────────────┐         ┌─────────────────────────────┐
│   React + Vite SPA  │ ──────▶ │         Supabase             │
│  (this repo, src/)   │         │  Postgres + Auth + Storage   │
└────────────────────┘         └─────────────────────────────┘
```

- **Auth** is handled entirely by Supabase Auth (`supabase.auth.signUp` / `signInWithPassword`), with session state managed in `AuthContext`.
- **Data access control** is not done in application code — it's enforced by Postgres RLS policies (see migration file), so every `SELECT`/`INSERT`/`UPDATE`/`DELETE` is automatically scoped to `auth.uid() = user_id`. This is what makes it safe for multiple users to share one database without seeing each other's data.
- **No custom REST API layer** — the Supabase JS client is used directly inside page components for all reads/writes.

## Core Features

### Authentication
- Email/password sign-up and login via Supabase Auth
- A `profiles` row is auto-created for every new user via a Postgres trigger on `auth.users` insert
- Email verification status is tracked and auto-synced via a second trigger
- Protected routes redirect unauthenticated users to `/auth`

### Dashboard
- This-month totals for expenses and income, and a running available balance (all-time income minus all-time expenses)
- Income vs. expenses bar chart for the last 6 months
- Pie chart of top spending categories for the current month
- Recent transactions feed (merged expenses + income, sorted by date)
- Active subscriptions list with a normalized monthly-cost estimate (weekly/monthly/quarterly/yearly all converted to a comparable monthly figure)
- Savings goals with progress bars

### Add Expense
- A single entry point that branches into a dedicated sub-form per category (13 categories, each with its own fields — see below) rather than one generic "amount + note" form

### Expenses List
- Browse and filter logged expenses

### Income
- Track income by source, payment mode, and linked account

### Savings Goals
- Target amount, current progress, optional deadline, achieved flag

### Shared Expenses (Roommates)
- Add roommates as contacts (name, phone, room number, notes)
- Log a shared expense, choose who paid, and split it (equal split auto-calculates each share; custom split is also supported)
- Track a running balance per roommate and mark shared expenses as settled

> **Note on "multiuser" here:** roommates are stored as contact records belonging to the logged-in user, not as a live link between two real accounts on the platform. If you and your roommate both use the app, you'd each log your shared expenses independently from your own point of view — there's no cross-account sync of a single shared expense yet (see Known Issues).

### Settings / Profile
- Editable profile: display name, bio, phone, college name, department, year of study, PG name/address, room number, move-in date, emergency contact
- Avatar upload to Supabase Storage (stored per-user in their own folder, publicly readable, only the owner can write/delete)

## Expense Categories — Why So Granular

Rather than "Food / Rent / Other," `AddExpense` has a dedicated form per category, because each one needs different fields to actually be useful for a student:

| Category | Extra fields captured |
| :--- | :--- |
| Stationary | Books, stationery, exam fees |
| Food | Meal type (breakfast/lunch/dinner/snacks), food sub-category (fruits, vegetables, millets, junk, dairy, groceries...) |
| PG/Rent | Rent, electricity, water, maintenance, security deposit |
| Transport | Mode (bus/train/bike/auto/cab) |
| Household | Cleaning, kitchen, bathroom, electrical, furniture |
| Friends / Family | Outings, gifts, money sent home |
| Donated | Type of donation (food, drink, money, clothes) |
| Health | Hospital visit, pharmacy, insurance, lab test — with doctor name, medicine name/dosage/duration |
| Electronics | Device type (mobile, laptop, earphones, charger, accessories) |
| Entertainment | Movies, OTT, concerts, gaming, amusement park |
| Shopping (Clothing) | Separate men's/women's sub-categories (shirts, kurti, saree, ethnic wear, etc.), brand, color, size, occasion |
| Shopping (Other) | Footwear, bags, personal care, home decor |

There are also three standalone logs beyond the main expense form, modeled as their own tables: **mess log** (monthly fee, off-days count, expected refund), **academics log** (per-semester item tracking, exam fee flag), and **social log** (lending/borrowing money with friends, with a returned/not-returned flag and due date).

## Database Schema

All tables live in Postgres under Supabase, defined in `supabase/migrations/20260529070509_001_initial_schema.sql`. Every table has `user_id`, `created_at`, `updated_at`, and a soft-delete `is_deleted` flag (rows are never hard-deleted from the app).

| Table | Purpose |
| :--- | :--- |
| `profiles` | One row per user; extended student/PG profile info, linked 1:1 to `auth.users` |
| `expenses` | Generic expense log; `category` + `subcategory` + a `metadata` jsonb column hold the category-specific fields from the dynamic form |
| `income` | Income entries by source |
| `savings_goals` | Target/current amount, deadline, achieved flag |
| `subscriptions` | Recurring payments with frequency and next due date |
| `roommates` | Contact records for shared-expense tracking |
| `shared_expenses` | Split expenses tied to a roommate, with split type and per-party share |
| `mess_log` | Mess subscription tracking with off-day refund logic |
| `health_log` | Medical visits and pharmacy purchases |
| `academics_log` | Semester-tagged academic spending |
| `social_log` | Lending/borrowing between friends |
| `shopping_log` | Clothing/other shopping detail table |

A second migration (`002_create_avatars_bucket.sql`) creates the `avatars` storage bucket and its access policies.

## Authentication & Security

- Supabase Auth issues and manages sessions; the frontend never handles raw passwords beyond passing them to the Supabase client.
- **Row Level Security is enabled on every table**, with `SELECT` / `INSERT` / `UPDATE` / `DELETE` policies that all check `auth.uid() = user_id`. This is the actual mechanism that makes the app safe for multiple concurrent users on one shared database — even though there's no custom backend, a user physically cannot query another user's rows.
- Avatar storage policies restrict uploads/updates/deletes to the user's own folder (`{user_id}/...`), while allowing public read access for displaying avatars.
- A Postgres trigger auto-provisions a `profiles` row on signup, and a second trigger keeps `email_verified` in sync with Supabase Auth's own confirmation state.

## Project Structure

```
multiuser_expense_tracker/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # App shell/nav wrapping all protected pages
│   │   └── ProtectedRoute.tsx   # Auth guard, redirects to /auth if logged out
│   ├── contexts/
│   │   └── AuthContext.tsx      # Session, user, profile state + auth methods
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client init
│   │   ├── database.types.ts    # Generated/hand-written TS types for every table
│   │   └── constants.ts         # Category lists, payment modes, sub-type options
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── AddExpense.tsx       # Largest file — one branch per category
│   │   ├── ExpensesList.tsx
│   │   ├── IncomePage.tsx
│   │   ├── SavingsPage.tsx
│   │   ├── SharedExpensesPage.tsx
│   │   └── SettingsPage.tsx
│   ├── App.tsx                  # Route definitions
│   └── main.tsx
└── supabase/
    └── migrations/               # SQL schema + storage bucket setup
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A free [Supabase](https://supabase.com) project (gives you a Postgres database, Auth, and Storage out of the box)

### 1. Clone and install

```bash
git clone https://github.com/RBSIVAKALISANKARAN/multiuser_expense_tracker.git
cd multiuser_expense_tracker
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the contents of `supabase/migrations/20260529070509_001_initial_schema.sql`, then `supabase/migrations/20260529071322_002_create_avatars_bucket.sql`.
3. Grab your Project URL and anon public key from Project Settings → API.

### 3. Configure environment variables

Create a `.env` file in the project root (see below).

### 4. Run the dev server

```bash
npm run dev
```

### Other scripts

```bash
npm run build       # production build
npm run preview      # preview the production build locally
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit, type-check without emitting files
```

## Environment Variables

`.env` in the project root:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Both are required — `src/lib/supabase.ts` throws on startup if either is missing.

## Known Issues & What's Left

Being upfront: this project is **not fully debugged yet** and is still under active development. Things I'm aware of and actively working through:

- Some forms could use stronger client-side validation (e.g. negative or non-numeric amounts in places).
- Shared expenses are currently single-sided (see note above) — no real two-account sync between roommates yet.
- A few pages were built and styled faster than they were tested against edge cases (empty states, very large numbers, timezone edge cases around month boundaries in the dashboard date filtering).
- No automated tests yet, so regressions are currently caught manually.
- Mobile responsiveness has had less attention than desktop layout in a couple of the denser forms (especially `AddExpense`).

If you clone this and hit a bug, that's expected at this stage rather than a surprise — issues and PRs are welcome.

## Possible Future Improvements

- A true shared-ledger model so two real accounts can both see and settle the same shared expense
- Automated test coverage for the expense/income CRUD flows
- Export to CSV/PDF for monthly statements
- Push/email reminders for upcoming subscription due dates and mess fee cycles
- Budget limits per category with overspend warnings
