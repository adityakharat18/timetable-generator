# EvoSchedule — GA Academic Optimizer

A React + TypeScript college timetable application with a Genetic Algorithm optimizer, timetable creation/editing, weekly views, GA design/visualization, comparisons, export, and saved timetable versions.

## Quick start

Requirements: Node.js 20.19+ or 22.12+ recommended.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase database and accounts

To enable cloud accounts and persistent saved timetables:

1. Create a Supabase project.
2. Run `supabase/migrations/202610200001_create_timetables.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and add your Supabase Project URL and publishable/anon key.
4. Restart the dev server and create an account in the app.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the complete setup and Vercel deployment guide.

When Supabase variables are configured, authentication is required and saved versions are stored in Supabase with Row Level Security. If variables are absent, the app runs in local demo mode with localStorage.

## Fixed timetable grid

| Activity | Time |
|---|---|
| Period 1 | 8:00–9:00 AM |
| Period 2 | 9:00–10:00 AM |
| Period 3 | 10:00–11:00 AM |
| Compulsory break | 11:00–11:30 AM |
| Period 4 | 11:30 AM–12:30 PM |
| Period 5 | 12:30–1:30 PM |

The break is not a schedulable lecture period.

## Build

```bash
npm run build
npm run preview
```

## Important

The current app's GA is a stochastic optimizer. A fitness score is not proof that all real-world faculty availability, room capacity, and subject-hour constraints are satisfied. Validate schedules using accurate academic data before operational use. Never put a Supabase service-role key in frontend environment variables.
