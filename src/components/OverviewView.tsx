import React from 'react';
import { ScheduledClass, TimetableVersion } from '../types/schedule';
import { NavigationPath } from './Sidebar';

interface OverviewViewProps {
  schedule: ScheduledClass[];
  versions: TimetableVersion[];
  onNavigate: (path: NavigationPath) => void;
  onOpenExport: () => void;
  onSelectSlot: (slot: ScheduledClass) => void;
  onSwitchVersion: (version: TimetableVersion) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  schedule,
  versions,
  onNavigate,
  onOpenExport,
  onSelectSlot,
  onSwitchVersion,
}) => {
  // Filter for Preview Grid (Periods 1-5, Mon-Fri)
  const previewDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const previewPeriods = [
    { num: 1, label: 'P-1', time: '08:00–09:00' },
    { num: 2, label: 'P-2', time: '09:00–10:00' },
    { num: 3, label: 'P-3', time: '10:00–11:00' },
    // Compulsory break 11:00–11:30 AM
    { num: 4, label: 'P-4', time: '11:30–12:30' },
    { num: 5, label: 'P-5', time: '12:30–01:30' },
  ];

  const getSlot = (day: string, periodNum: number) => {
    return schedule.find((c) => c.day === day && c.periodNumber === periodNum);
  };

  const getSubjectBorderColor = (subjectCode: string) => {
    switch (subjectCode) {
      case 'ACC-301':
        return '#3525cd';
      case 'ACC-302':
        return '#0f766e';
      case 'LAW-303':
        return '#4f46e5';
      case 'SEC-304':
        return '#c2410c';
      case 'CST-305':
        return '#3130c0';
      case 'ENG-306':
        return '#be123c';
      default:
        return '#565e74';
    }
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Section 1: Executive Welcome & Algorithmic State Banner */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0] flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[#e2dfff]/40 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-1.5 relative z-10 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#3525cd] text-[11px] font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-pulse" />
              Operational Cluster Alpha
            </span>
            <span className="text-[#565e74] text-[11px]">•</span>
            <span className="text-[12px] text-[#565e74]">
              Academic Session 2024–25 (Faculty of Commerce &amp; Accountancy)
            </span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
            Welcome back, Dr. Arvind Rao
          </h1>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#eff4ff] text-[#464555] text-[12px] border border-[#dce9ff]">
              <span className="material-symbols-outlined text-[#3525cd] text-[17px]">
                verified_user
              </span>
              <span>
                Optimization completed: Solution converged at{' '}
                <strong className="font-mono text-[#0b1c30] font-bold">Generation 420</strong>{' '}
                with <strong className="text-[#3525cd] font-bold">0 hard violations</strong>
              </span>
            </div>
            <span className="font-mono text-[12px] text-[#565e74]">Elapsed: 3.42s</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0 relative z-10">
          <button
            onClick={onOpenExport}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 h-9 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-semibold text-[13px] border border-[#dce9ff] transition-colors shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Active Schedule</span>
          </button>
          <button
            onClick={() => onNavigate('generator')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 h-9 rounded-lg bg-[#4f46e5] hover:bg-[#3525cd] text-white font-semibold text-[13px] shadow-sm shadow-indigo-200 transition-all active:scale-[0.98] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Generate Timetable</span>
          </button>
        </div>
      </div>

      {/* Section 2: Four-Column High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Active Matrix Target */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
              Active Matrix Target
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-[#eff4ff] text-[#3525cd] px-2 py-0.5 rounded font-semibold border border-[#dce9ff]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd]" /> Live
            </span>
          </div>
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-lg text-[#0b1c30] font-bold tracking-tight">
              B.Com Sem III (Div A)
            </div>
            <p className="text-[12px] text-[#565e74] mt-0.5">Created via evolutionary GA Run #142</p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[12px]">
            <span className="text-[#565e74]">Division Head</span>
            <span className="font-semibold text-[#0b1c30]">Prof. K. Subramanian</span>
          </div>
        </div>

        {/* KPI 2: Scheduled Sessions */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
              Scheduled Sessions
            </span>
            <span className="font-mono text-[11px] text-[#3525cd] font-bold bg-[#e2dfff]/60 px-2 py-0.5 rounded">
              100% Placed
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] font-extrabold tracking-tight">
                25
              </span>
              <span className="text-[14px] text-[#565e74] font-medium">/ 25 slots</span>
            </div>
            <p className="text-[12px] text-[#565e74] mt-0.5">5 Teaching Days • 5 Periods/Day</p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[12px]">
            <span className="text-[#565e74]">Unassigned Load</span>
            <span className="font-mono font-bold text-[#3525cd]">0 Unassigned</span>
          </div>
        </div>

        {/* KPI 3: Hard Violations */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
              Hard Violations
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> Validated
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#3525cd] font-extrabold tracking-tight">
                0
              </span>
              <span className="text-[12px] text-[#565e74]">conflicts detected</span>
            </div>
            <p className="text-[12px] text-[#565e74] mt-0.5">
              Zero overlap across faculty, room, and cohorts
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f1f5f9] flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#565e74]">R:0 • F:0 • G:0</span>
            <span className="text-emerald-700 font-bold">100% Feasible</span>
          </div>
        </div>

        {/* KPI 4: Fitness Score */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#565e74] uppercase tracking-wider font-bold">
              Fitness Function Score
            </span>
            <span className="text-[11px] text-[#3525cd] font-bold bg-[#e2dfff]/60 px-2 py-0.5 rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +4.2%
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] font-extrabold tracking-tight">
                98.6
              </span>
              <span className="text-[14px] text-[#565e74] font-medium">/ 100</span>
            </div>
            <p className="text-[12px] text-[#565e74] mt-0.5">Penalties: -1.4 soft preferences</p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[12px]">
            <span className="text-[#565e74]">Soft Preference Rank</span>
            <span className="font-mono font-bold text-[#0b1c30]">Top 1.2%</span>
          </div>
        </div>
      </div>

      {/* Section 3: Dual Column Tactical Core */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 Columns) */}
        <div className="xl:col-span-8 space-y-6 min-w-0">
          {/* Module A: Weekly Timetable Interactive Mini-Preview */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                    Weekly Timetable Matrix Preview
                  </h2>
                  <span className="text-[11px] px-2 py-0.5 bg-[#eff4ff] text-[#565e74] font-semibold rounded border border-[#dce9ff]">
                    Div A (Morning Shift)
                  </span>
                </div>
                <p className="text-[12px] text-[#565e74] mt-0.5">
                  Showing Mon–Fri active configuration (Periods 1 to 5 of 7)
                </p>
              </div>
              <div>
                <button
                  onClick={() => onNavigate('timetable')}
                  className="inline-flex items-center gap-1 text-[13px] text-[#3525cd] hover:text-[#4f46e5] px-2.5 py-1.5 rounded transition-colors font-semibold cursor-pointer"
                >
                  <span>Open Full Interactive Grid</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Schedule Grid Container */}
            <div className="overflow-x-auto pb-1">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#eff4ff] text-[#565e74] text-[11px] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                    <th className="py-2.5 px-3 rounded-l w-24">Time / Day</th>
                    <th className="py-2.5 px-3 text-center">Mon</th>
                    <th className="py-2.5 px-3 text-center">Tue</th>
                    <th className="py-2.5 px-3 text-center">Wed</th>
                    <th className="py-2.5 px-3 text-center">Thu</th>
                    <th className="py-2.5 px-3 rounded-r text-center">Fri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                  {previewPeriods.map((period) => (
                    <React.Fragment key={period.num}>
                      {period.num === 4 && (
                        <tr className="bg-[#f8f9ff]">
                          <td className="py-1.5 px-3 font-mono text-[11px] text-[#777587] uppercase font-bold">
                            Recess
                          </td>
                          <td
                            className="py-1.5 px-3 text-center text-[11px] text-[#565e74] tracking-wider uppercase font-semibold"
                            colSpan={5}
                          >
                            Compulsory Break • No Lectures (11:00–11:30 AM)
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#565e74] bg-white">
                          <span className="font-bold text-[#0b1c30] block">{period.label}</span>
                          <span className="text-[10px] text-[#777587]">{period.time}</span>
                        </td>
                        {previewDays.map((day) => {
                          const slot = getSlot(day, period.num);
                          if (!slot) {
                            return (
                              <td key={day} className="p-1.5">
                                <div className="h-14 bg-[#f8f9ff] rounded border border-dashed border-[#e2e8f0] flex items-center justify-center text-[11px] text-gray-400">
                                  Free Slot
                                </div>
                              </td>
                            );
                          }
                          const borderCol = getSubjectBorderColor(slot.subjectCode);
                          return (
                            <td key={day} className="p-1.5">
                              <div
                                onClick={() => onSelectSlot(slot)}
                                style={{ borderLeft: `3px solid ${borderCol}` }}
                                className="bg-[#eff4ff] hover:bg-[#e5eeff] p-2 rounded transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                              >
                                <div className="text-[13px] text-[#0b1c30] font-semibold truncate group-hover:text-[#3525cd]">
                                  {slot.subjectName}
                                </div>
                                <div className="flex items-center justify-between text-[#565e74] text-[11px] mt-1">
                                  <span className="font-mono font-medium">{slot.roomCode}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-[#dce9ff] font-bold text-[10px] text-[#0b1c30]">
                                    {slot.facultyCode}
                                  </span>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between flex-wrap gap-2 text-[#565e74] text-[11px]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#3525cd]" /> Core Commerce
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4f46e5]" /> Corporate Law
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#565e74]" /> Allied Labs
                </span>
              </div>
              <span className="font-mono text-[#777587]">Showing 25 of 25 Slots</span>
            </div>
          </div>

          {/* Module B: GA Fitness Improvement & Convergence Chart */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                    GA Convergence &amp; Fitness Trajectory
                  </h2>
                  <span className="font-mono text-[11px] px-2 py-0.5 bg-[#eff4ff] text-[#3525cd] font-semibold rounded border border-[#dce9ff]">
                    Run #142 (420 Gens)
                  </span>
                </div>
                <p className="text-[12px] text-[#565e74] mt-0.5">
                  Tracking elite fitness chromosome progression vs population mean
                </p>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5 font-medium text-[#0b1c30]">
                  <span className="w-3 h-1 bg-[#3525cd] rounded-full" /> Best Fitness (Elite)
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#565e74]">
                  <span className="w-3 h-1 bg-[#c7c4d8] rounded-full" /> Population Mean
                </span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative w-full h-64 bg-[#f8f9ff] border border-[#e2e8f0] rounded-xl p-4 flex flex-col justify-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 680 200">
                {/* Gridlines */}
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="20" y2="20" />
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="65" y2="65" />
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="110" y2="110" />
                <line stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="680" y1="155" y2="155" />
                <line stroke="#CBD5E1" strokeWidth="1" x1="0" x2="680" y1="195" y2="195" />

                {/* Fill Area under Best Fitness */}
                <path
                  d="M 0 165 C 60 145, 120 70, 200 48 C 280 32, 420 25, 540 22 L 540 195 L 0 195 Z"
                  fill="url(#primaryGradient)"
                  opacity="0.14"
                />

                {/* Population Mean Path */}
                <path
                  d="M 0 185 C 80 170, 160 130, 240 105 C 320 85, 420 75, 540 68"
                  fill="none"
                  stroke="#A0AEC0"
                  strokeDasharray="4 4"
                  strokeWidth="2"
                />

                {/* Best Fitness Path */}
                <path
                  d="M 0 165 C 60 145, 120 70, 200 48 C 280 32, 420 25, 540 22"
                  fill="none"
                  stroke="#3525cd"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                {/* Milestone Markers */}
                <circle cx="0" cy="165" fill="#3525cd" r="4" />
                <circle cx="200" cy="48" fill="#3525cd" r="4" />
                <circle cx="540" cy="22" fill="#3525cd" r="6" stroke="#FFFFFF" strokeWidth="2" />

                <defs>
                  <linearGradient id="primaryGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#3525cd" />
                    <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tooltip Overlay at Gen 420 (Pinned) */}
              <div className="absolute right-14 top-6 bg-white p-2.5 rounded-lg shadow-md border border-[#e2e8f0] pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3525cd]" />
                  <span className="text-[11px] font-semibold text-[#565e74]">Convergence Point</span>
                </div>
                <div className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold mt-0.5">
                  98.6% Fitness
                </div>
                <div className="font-mono text-[#565e74] text-[10px] mt-0.5">Gen 420 • 0 Violations</div>
              </div>

              {/* X Axis Marks */}
              <div className="flex items-center justify-between text-[#565e74] font-mono text-[11px] pt-2">
                <span>Gen 0 (45.2%)</span>
                <span>Gen 75 (72.4%)</span>
                <span>Gen 150 (88.0%)</span>
                <span>Gen 300 (96.4%)</span>
                <span className="font-bold text-[#3525cd]">Gen 420 (98.6%)</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#565e74] font-medium">Crossover Operator</span>
                <span className="text-[13px] text-[#0b1c30] font-semibold">
                  Uniform Order-Based (0.85)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#565e74] font-medium">Mutation Rate</span>
                <span className="text-[13px] text-[#0b1c30] font-semibold">
                  Adaptive Swap (0.04)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#565e74] font-medium">Selection Mechanism</span>
                <span className="text-[13px] text-[#0b1c30] font-semibold">Tournament (k = 5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 Columns) */}
        <div className="xl:col-span-4 space-y-6 min-w-0">
          {/* Module C: Curriculum Load Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                Curriculum Load Breakdown
              </h2>
              <span className="font-mono text-[12px] text-[#565e74] font-bold">25 hrs/wk</span>
            </div>
            <p className="text-[12px] text-[#565e74] mb-3">
              Weekly lecture hours allocated across academic departments
            </p>

            {/* Distribution Stacked Representation */}
            <div className="h-3 w-full bg-[#e5eeff] rounded-full overflow-hidden flex mb-4">
              <div className="h-full bg-[#3525cd]" style={{ width: '22.8%' }} title="Accountancy: 8 hrs" />
              <div className="h-full bg-[#4f46e5]" style={{ width: '20%' }} title="Book Keeping: 7 hrs" />
              <div className="h-full bg-[#3130c0]" style={{ width: '17.1%' }} title="Business Law: 6 hrs" />
              <div className="h-full bg-[#565e74]" style={{ width: '14.3%' }} title="Secretarial Pr.: 5 hrs" />
              <div className="h-full bg-[#c2410c]" style={{ width: '14.3%' }} title="Cost Accounting: 5 hrs" />
              <div className="h-full bg-[#cbdbf5]" style={{ width: '11.5%' }} title="Auditing: 4 hrs" />
            </div>

            {/* Subject Breakdown List */}
            <div className="space-y-1 text-[13px]">
              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#eff4ff] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd]" />
                  <span className="font-semibold text-[#0b1c30]">Accountancy-I</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0b1c30]">8 hrs</span>
                  <span className="text-[11px] text-[#565e74]">(22.8%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#eff4ff] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
                  <span className="font-semibold text-[#0b1c30]">Book Keeping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0b1c30]">7 hrs</span>
                  <span className="text-[11px] text-[#565e74]">(20.0%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#eff4ff] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3130c0]" />
                  <span className="font-semibold text-[#0b1c30]">Business Law</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0b1c30]">6 hrs</span>
                  <span className="text-[11px] text-[#565e74]">(17.1%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#eff4ff] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#565e74]" />
                  <span className="font-semibold text-[#0b1c30]">Secretarial Practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0b1c30]">5 hrs</span>
                  <span className="text-[11px] text-[#565e74]">(14.3%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#eff4ff] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c2410c]" />
                  <span className="font-semibold text-[#0b1c30]">Cost Accounting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0b1c30]">5 hrs</span>
                  <span className="text-[11px] text-[#565e74]">(14.3%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded hover:bg-[#eff4ff] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0f766e]" />
                  <span className="font-semibold text-[#0b1c30]">Auditing &amp; Assurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0b1c30]">4 hrs</span>
                  <span className="text-[11px] text-[#565e74]">(11.5%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Module D: Recent Timetable Versions List */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                Recent Schedule Versions
              </h2>
              <button
                onClick={() => onNavigate('saved')}
                className="text-[11px] text-[#3525cd] hover:underline font-bold"
              >
                View Archive
              </button>
            </div>
            <p className="text-[12px] text-[#565e74] mb-3">
              Comparing genetic convergence runs and manual adjustments
            </p>

            <div className="space-y-2.5">
              {versions.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  onClick={() => onSwitchVersion(v)}
                  className={`p-3 rounded-lg flex flex-col gap-1 transition-all cursor-pointer border ${
                    v.isLive
                      ? 'bg-[#eff4ff] border-[#dce9ff]'
                      : 'bg-white hover:bg-[#f8f9ff] border-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#3525cd]">{v.version}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          v.type === 'Active GA'
                            ? 'bg-[#3525cd] text-white'
                            : v.type === 'Manual Draft'
                            ? 'bg-[#fed7aa] text-[#c2410c]'
                            : 'bg-[#e2e8f0] text-[#565e74]'
                        }`}
                      >
                        {v.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#777587]">{v.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#0b1c30] mt-1">
                    <span>
                      Fitness:{' '}
                      <strong className="font-mono text-[#3525cd]">{v.fitness.toFixed(1)}%</strong>
                    </span>
                    {v.hardViolations === 0 ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">check</span> 0
                        Violations
                      </span>
                    ) : (
                      <span className="text-rose-700 font-bold flex items-center gap-0.5 text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">warning</span>{' '}
                        {v.hardViolations} Hard Clashes
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module E: Constraint Health Audit */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                Constraint Health Audit
              </h2>
              <span className="material-symbols-outlined text-[#3525cd] text-[20px]">
                health_and_safety
              </span>
            </div>
            <p className="text-[12px] text-[#565e74] mb-3">
              Real-time verification against university senate regulations
            </p>

            <div className="space-y-2 text-[12px]">
              <div className="p-2.5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
                    domain_verification
                  </span>
                  <span className="font-semibold text-[#0b1c30]">Classroom Capacity</span>
                </div>
                <span className="font-bold text-[#3525cd] px-2 py-0.5 rounded bg-[#dce9ff] text-[11px]">
                  100% Compliant
                </span>
              </div>

              <div className="p-2.5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
                    schedule
                  </span>
                  <span className="font-semibold text-[#0b1c30]">Faculty Daily Max (≤4)</span>
                </div>
                <span className="font-bold text-[#3525cd] px-2 py-0.5 rounded bg-[#dce9ff] text-[11px]">
                  Passed (Max 3.8)
                </span>
              </div>

              <div className="p-2.5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
                    more_time
                  </span>
                  <span className="font-semibold text-[#0b1c30]">
                    Consecutive Lecture Cap (≤2)
                  </span>
                </div>
                <span className="font-bold text-[#3525cd] px-2 py-0.5 rounded bg-[#dce9ff] text-[11px]">
                  Compulsory break enforced
                </span>
              </div>

              <div className="p-2.5 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
                    meeting_room
                  </span>
                  <span className="font-semibold text-[#0b1c30]">Lab Block Double Slots</span>
                </div>
                <span className="font-bold text-[#3525cd] px-2 py-0.5 rounded bg-[#dce9ff] text-[11px]">
                  Synchronized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
