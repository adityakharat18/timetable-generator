import React, { useState } from 'react';

interface HeaderProps {
  activeCohort: 'Div A' | 'Div B' | 'Div C';
  onCohortChange: (cohort: 'Div A' | 'Div B' | 'Div C') => void;
  hardViolationsCount: number;
  fitnessScore: number;
  onRunOptimization: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCohort,
  onCohortChange,
  hardViolationsCount,
  fitnessScore,
  onRunOptimization,
}) => {
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const [showCohortMenu, setShowCohortMenu] = useState(false);
  const [session, setSession] = useState('AY 2024–2025 • Sem I (Commerce)');

  const sessions = [
    'AY 2024–2025 • Sem I (Commerce)',
    'AY 2024–2025 • Sem II (Commerce)',
    'AY 2024–2025 • Sem I (Mgmt Studies)',
    'AY 2023–2024 • Archival Records',
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 px-6 flex items-center justify-between select-none">
      {/* Left: Dropdown selectors */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Session Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSessionMenu(!showSessionMenu);
              setShowCohortMenu(false);
            }}
            className="flex items-center gap-2 bg-[#eff4ff] hover:bg-[#e5eeff] px-3.5 py-1.5 rounded-lg border border-[#dce9ff] cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[#565e74] text-[18px]">
              school
            </span>
            <span className="text-[13px] text-[#0b1c30] font-semibold truncate max-w-[220px]">
              {session}
            </span>
            <span className="material-symbols-outlined text-[#565e74] text-[16px]">
              expand_more
            </span>
          </button>

          {showSessionMenu && (
            <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#777587] uppercase border-b border-[#f1f5f9]">
                Select Academic Session
              </div>
              {sessions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSession(s);
                    setShowSessionMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#eff4ff] transition-colors ${
                    session === s ? 'font-bold text-[#3525cd] bg-[#eff4ff]' : 'text-[#464555]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cohort & Schedule Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowCohortMenu(!showCohortMenu);
              setShowSessionMenu(false);
            }}
            className="flex items-center gap-2 bg-[#eff4ff] hover:bg-[#e5eeff] px-3.5 py-1.5 rounded-lg border border-[#dce9ff] cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
              grid_on
            </span>
            <span className="text-[13px] text-[#0b1c30] font-semibold truncate max-w-[270px]">
              B.Com {activeCohort} — Schedule v4.2 [GA-Optimized]
            </span>
            <span className="material-symbols-outlined text-[#565e74] text-[16px]">
              unfold_more
            </span>
          </button>

          {showCohortMenu && (
            <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#777587] uppercase border-b border-[#f1f5f9]">
                Switch Division Cohort
              </div>
              {(['Div A', 'Div B', 'Div C'] as const).map((coh) => (
                <button
                  key={coh}
                  onClick={() => {
                    onCohortChange(coh);
                    setShowCohortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between hover:bg-[#eff4ff] transition-colors ${
                    activeCohort === coh ? 'font-bold text-[#3525cd] bg-[#eff4ff]' : 'text-[#464555]'
                  }`}
                >
                  <span>B.Com {coh} (Morning Shift)</span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white text-[#3525cd] border border-[#dce9ff]">
                    25 slots
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Telemetry Badges & Optimization Action */}
      <div className="flex items-center gap-3">
        {/* Hard Conflicts Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eff4ff] border border-[#dce9ff] text-[12px]">
          <span className="material-symbols-outlined text-emerald-600 text-[16px]">
            verified_user
          </span>
          <span className="text-[#0b1c30] font-bold">{hardViolationsCount} Hard</span>
          <span className="text-[#565e74]">Conflicts</span>
        </div>

        {/* Fitness Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eff4ff] border border-[#dce9ff] text-[12px]">
          <span className="text-[#565e74]">Fitness</span>
          <span className="font-mono font-bold text-[#3525cd]">
            {fitnessScore.toFixed(1)}%
          </span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onRunOptimization}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4f46e5] hover:bg-[#3525cd] text-white text-[13px] font-semibold shadow-sm shadow-indigo-200 hover:shadow transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Run New Optimization</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-xs">
            AR
          </div>
          <div className="hidden xl:flex flex-col text-left leading-tight">
            <span className="text-[13px] font-bold text-[#0b1c30]">Dr. Arvind Rao</span>
            <span className="text-[10px] text-[#565e74]">Academic Registrar</span>
          </div>
        </div>
      </div>
    </header>
  );
};
