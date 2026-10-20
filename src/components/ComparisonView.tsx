import React, { useState } from 'react';
import { TimetableVersion } from '../types/schedule';
import { INITIAL_VERSIONS } from '../data/mockData';

export const ComparisonView: React.FC = () => {
  const [selectedV1, setSelectedV1] = useState<string>('ver-4.2');
  const [selectedV2, setSelectedV2] = useState<string>('ver-4.1');

  const v1 = INITIAL_VERSIONS.find((v) => v.id === selectedV1) || INITIAL_VERSIONS[0];
  const v2 = INITIAL_VERSIONS.find((v) => v.id === selectedV2) || INITIAL_VERSIONS[1];

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
          <span>SCHEDULE TELEMETRY &amp; BENCHMARKING</span>
          <span>•</span>
          <span className="text-[#565e74]">CROSS-VERSION VARIANCE AUDIT</span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
          Analysis &amp; Version Comparison
        </h1>
        <p className="text-[13px] text-[#565e74] mt-0.5">
          Side-by-side benchmarking of genetic algorithm optimization runs against manual drafts, evaluating constraint compliance and faculty satisfaction.
        </p>

        {/* Version Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#f1f5f9]">
          <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
            <label className="text-[11px] font-bold text-[#3525cd] uppercase block mb-1">
              Baseline Schedule A
            </label>
            <select
              value={selectedV1}
              onChange={(e) => setSelectedV1(e.target.value)}
              className="w-full bg-white border border-[#dce9ff] rounded-md px-3 py-1.5 text-[13px] font-semibold text-[#0b1c30]"
            >
              {INITIAL_VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Fitness: {v.fitness}%)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
            <label className="text-[11px] font-bold text-[#4f46e5] uppercase block mb-1">
              Comparison Schedule B
            </label>
            <select
              value={selectedV2}
              onChange={(e) => setSelectedV2(e.target.value)}
              className="w-full bg-white border border-[#dce9ff] rounded-md px-3 py-1.5 text-[13px] font-semibold text-[#0b1c30]"
            >
              {INITIAL_VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Fitness: {v.fitness}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparative Metrics Table */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30] mb-4">
          Comparative Evaluation Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f9ff] text-[11px] text-[#565e74] uppercase font-bold">
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4 text-[#3525cd]">{v1.version} ({v1.type})</th>
                <th className="py-3 px-4 text-[#4f46e5]">{v2.version} ({v2.type})</th>
                <th className="py-3 px-4 text-right">Variance / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              <tr className="hover:bg-[#fcfdff]">
                <td className="py-3 px-4 font-semibold text-[#0b1c30]">Overall Fitness Score</td>
                <td className="py-3 px-4 font-mono font-bold text-[#3525cd]">{v1.fitness.toFixed(1)}%</td>
                <td className="py-3 px-4 font-mono font-bold text-[#0b1c30]">{v2.fitness.toFixed(1)}%</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                  +{(v1.fitness - v2.fitness).toFixed(1)}%
                </td>
              </tr>

              <tr className="hover:bg-[#fcfdff]">
                <td className="py-3 px-4 font-semibold text-[#0b1c30]">Hard Constraint Violations</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-700">{v1.hardViolations} clashes</td>
                <td className="py-3 px-4 font-mono font-bold text-rose-700">{v2.hardViolations} clashes</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">
                  {v1.hardViolations < v2.hardViolations ? 'Eliminated 3 Clashes' : 'Equal'}
                </td>
              </tr>

              <tr className="hover:bg-[#fcfdff]">
                <td className="py-3 px-4 font-semibold text-[#0b1c30]">Convergence Generation</td>
                <td className="py-3 px-4 font-mono text-[#0b1c30]">Gen {v1.generation}</td>
                <td className="py-3 px-4 font-mono text-[#0b1c30]">Gen {v2.generation}</td>
                <td className="py-3 px-4 text-right font-mono text-[#565e74]">
                  +{v1.generation - v2.generation} generations
                </td>
              </tr>

              <tr className="hover:bg-[#fcfdff]">
                <td className="py-3 px-4 font-semibold text-[#0b1c30]">Soft Penalty Points</td>
                <td className="py-3 px-4 font-mono text-[#0b1c30]">{v1.softPenalties} pts</td>
                <td className="py-3 px-4 font-mono text-[#0b1c30]">{v2.softPenalties} pts</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">
                  -{(v2.softPenalties - v1.softPenalties).toFixed(1)} pts improved
                </td>
              </tr>

              <tr className="hover:bg-[#fcfdff]">
                <td className="py-3 px-4 font-semibold text-[#0b1c30]">Faculty Max Daily Load (≤4)</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">100% Compliant</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">1 Overload Slot</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-700">Optimal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
