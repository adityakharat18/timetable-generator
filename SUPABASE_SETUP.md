# EvoSchedule: Supabase setup and deployment

The frontend uses Supabase Auth and Postgres directly. The Genetic Algorithm remains in the React client; saved timetable versions are stored in Supabase. No SQLite server or service-role key is needed for this deployment.

## 1. Create the Supabase project

1. Open https://supabase.com and create a project.
2. Save the database password securely.
3. Open **SQL Editor** in the Supabase dashboard.
4. Open `supabase/migrations/202610200001_create_timetables.sql` from this repository, copy the complete contents into SQL Editor, and click **Run**.
5. In **Project Settings → API**, copy the Project URL and the publishable/anon public key. Never use a `service_role` key in the browser.

## 2. Configure the frontend

1. Copy `.env.example` to `.env.local` at the project root.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the values from your Supabase project.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3000`. Create an account with an email and password. If email confirmation is enabled, confirm the email first and then sign in.

If the variables are not set, the app intentionally runs in local-demo mode and uses browser localStorage. With both variables set, the app requires authentication and stores timetables in Supabase.

## 3. Configure authentication URLs

In Supabase **Authentication → URL Configuration**, set the Site URL to your deployed site URL. Add your local URL (`http://localhost:3000`) and the deployed URL to the Redirect URLs list. If you use Vercel's preview deployments, add the appropriate preview URL pattern according to your project settings.

## 4. Deploy to Vercel

1. Push the project to your GitHub repository.
2. Import the repository into Vercel as a Vite project.
3. Set the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables for Production (and Preview if needed).
4. Deploy. Build command: `npm run build`. Output directory: `dist`.
5. Add the production domain to Supabase Auth URL Configuration and test sign-up/sign-in, create timetable, save draft, activate saved timetable, and refresh persistence.

## Security model

- The browser only receives the Supabase publishable/anon key.
- The `timetables` table has Row Level Security enabled. Every query is restricted to rows where `user_id = auth.uid()`.
- Do not disable RLS and do not expose a service-role key in `VITE_*` variables.

## Data model

Each saved version is one `public.timetables` row. The complete timetable assignment array is stored in `schedule` (`jsonb`), alongside the division, fitness, GA generation, hard violations, soft penalties, active-version flag, and timestamps.

## Important scheduling note

The fixed timetable periods are 08:00–09:00, 09:00–10:00, 10:00–11:00, 11:30–12:30, and 12:30–13:30. The compulsory 11:00–11:30 break is not a lecture slot. The frontend GA remains stochastic and the fitness score is an optimization indicator, not a proof that every real-world faculty/room/curriculum constraint has been met. Validate schedules against your actual faculty, room, and subject-hour data before operational use.
