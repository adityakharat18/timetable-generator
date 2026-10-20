import React from 'react';
import { TimetableVersion } from '../types/schedule';

interface SavedTimetablesViewProps {
  versions: TimetableVersion[];
  onActivateVersion: (version: TimetableVersion) => void;
  onOpenExport: () => void;
}

export const SavedTimetablesView: React.FC<SavedTimetablesViewProps> = ({
  versions,
  onActivateVersion,
  onOpenExport,
}) => {
  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
              <span>VERSION VAULT &amp; REPOSITORIES</span>
              <span>•</span>
              <span className="text-[#565e74]">HISTORICAL GENETIC ARCHIVE</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Saved Timetables &amp; Snapshots
            </h1>
            <p className="text-[13px] text-[#565e74] mt-0.5">
              Access previous genetic algorithm convergence checkpoints, roll back to prior senate-approved baseline schedules, or export audit files.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3525cd] text-white text-[13px] font-semibold hover:bg-[#4f46e5] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">file_download</span>
              <span>Export Active Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Versions List */}
      <div className="space-y-4">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className={`bg-white rounded-xl p-6 shadow-xs border transition-all ${
              ver.isLive ? 'border-[#3525cd] ring-1 ring-[#3525cd]' : 'border-[#e2e8f0]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-base font-bold text-[#3525cd]">
                    {ver.version}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded font-bold ${
                      ver.isLive
                        ? 'bg-[#3525cd] text-white'
                        : ver.type === 'Manual Draft'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ver.type}
                  </span>
                  {ver.isLive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Live Academic Schedule
                    </span>
                  )}
                  <span className="text-[12px] text-[#777587]">• {ver.timestamp}</span>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                  {ver.name}
                </h3>

                <p className="text-[13px] text-[#565e74]">{ver.notes}</p>
              </div>

              {/* Metrics & Actions */}
              <div className="flex items-center gap-6 shrink-0 flex-wrap">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#777587] block">Fitness</span>
                  <span className="font-mono text-xl font-extrabold text-[#3525cd]">
                    {ver.fitness.toFixed(1)}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#777587] block">Violations</span>
                  {ver.hardViolations === 0 ? (
                    <span className="font-mono text-base font-bold text-emerald-700">0 Hard</span>
                  ) : (
                    <span className="font-mono text-base font-bold text-rose-700">
                      {ver.hardViolations} Clashes
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!ver.isLive && (
                    <button
                      onClick={() => onActivateVersion(ver)}
                      className="px-3.5 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#3525cd] text-[13px] font-semibold border border-[#dce9ff] transition-colors cursor-pointer"
                    >
                      Make Active
                    </button>
                  )}
                  <button
                    onClick={onOpenExport}
                    className="p-2 rounded-lg border border-[#e2e8f0] text-[#565e74] hover:bg-[#f8f9ff] cursor-pointer"
                    title="Export this version"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
