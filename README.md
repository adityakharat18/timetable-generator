# EvoSchedule — GA Academic Timetable Optimizer

EvoSchedule is a React + TypeScript timetable optimizer demo with a Genetic Algorithm engine, weekly timetable, editor, GA design explainer, visualizer, comparison screens, and CSV/JSON export.

## Timetable hours

The Monday–Friday schedule uses five 60-minute lectures per day and a compulsory 30-minute break:

| Time | Activity |
|---|---|
| 8:00–9:00 AM | Period 1 |
| 9:00–10:00 AM | Period 2 |
| 10:00–11:00 AM | Period 3 |
| 11:00–11:30 AM | Compulsory break — no lectures |
| 11:30 AM–12:30 PM | Period 4 |
| 12:30–1:30 PM | Period 5 |

The break is a display-only interval, not an assignable period. The GA chromosome and schedule data contain only periods 1–5, so no lecture can be assigned during the break. The demo has 25 lecture slots per cohort per week.

## Run locally

**Prerequisite:** Node.js 20.19+ or 22.12+ (Vite 8 requirement).

1. Extract this ZIP and open the extracted project folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local URL printed by Vite (usually `http://localhost:3000`).
5. To create a production build, run `npm run build`.

## Main files for timetable timing

- `src/data/mockData.ts` — canonical period times, days, subjects, and demo schedule.
- `src/types/schedule.ts` — period-slot type now describes periods 1–5.
- `src/utils/gaEngine.ts` — GA chromosome evaluation, crossover, mutation, and population operations. It uses the valid periods from the schedule data.
- `src/components/WeeklyTimetableView.tsx` — weekly grid and compulsory break row.
- `src/components/OverviewView.tsx` — dashboard preview and schedule summary.
- `src/components/EditorView.tsx` — editable timetable grid and compulsory break row.
- `src/components/GADesignView.tsx` — encoding and protected-break explanation.
- `src/components/ExportModal.tsx` — CSV export includes the compulsory break row.

## Notes

The supplied project uses demo data in the browser. The displayed sample analytics and saved versions are demo content; do not treat those figures as benchmark results from a measured run unless you record and verify them yourself.


## Create a new timetable

Open **Timetable Generator** and click **Create New Timetable**. Enter a name, choose Division A/B/C, select one or more weekdays (Monday-Friday), and select the subjects to include. Click **Generate & Save Timetable**. The app creates five lecture assignments per selected day, protects the 11:00-11:30 AM break, runs a short 30-generation GA optimization pass, opens the new timetable in Weekly Timetable, and adds a saved version under **Saved Timetables**. Schedule and version data are persisted in the browser using localStorage.

The fixed periods are 8:00-9:00 AM, 9:00-10:00 AM, 10:00-11:00 AM, compulsory break 11:00-11:30 AM, 11:30 AM-12:30 PM, and 12:30-1:30 PM.
