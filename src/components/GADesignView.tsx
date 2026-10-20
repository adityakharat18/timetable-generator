import React, { useState } from 'react';

export const GADesignView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'encoding' | 'operators' | 'fitness'>('encoding');
  const [parentA] = useState(['ACC-301', 'LAW-303', 'CST-305', 'SEC-304', 'ENG-306', 'ACC-302']);
  const [parentB] = useState(['CST-305', 'ACC-302', 'ACC-301', 'ENG-306', 'LAW-303', 'SEC-304']);
  const [crossoverResult, setCrossoverResult] = useState<string[] | null>(null);

  const runSampleCrossover = () => {
    // 2-point crossover on slice [2, 4]
    const child = [...parentA];
    child[2] = parentB[2];
    child[3] = parentB[3];
    setCrossoverResult(child);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
          <span>ALGORITHMIC ARCHITECTURE</span>
          <span>•</span>
          <span className="text-[#565e74]">FORMAL MATHEMATICAL SPECIFICATION</span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
          Genetic Algorithm Design &amp; Operators
        </h1>
        <p className="text-[13px] text-[#565e74] mt-0.5">
          Comprehensive blueprint of chromosome encoding, stochastic parent selection, multi-objective fitness evaluation, and constraint penalty mechanics.
        </p>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#f1f5f9]">
          <button
            onClick={() => setActiveTab('encoding')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'encoding'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
            }`}
          >
            1. Chromosome Representation
          </button>
          <button
            onClick={() => setActiveTab('operators')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'operators'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
            }`}
          >
            2. Genetic Operators (OX &amp; Mutation)
          </button>
          <button
            onClick={() => setActiveTab('fitness')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'fitness'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
            }`}
          >
            3. Fitness Formulation &amp; Penalties
          </button>
        </div>
      </div>

      {/* Tab 1: Encoding */}
      {activeTab === 'encoding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0] space-y-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
              Direct Matrix / Gene Encoding
            </h3>
            <p className="text-[13px] text-[#565e74] leading-relaxed">
              Each individual chromosome C in the population is modeled as a 3D tensor of scheduled educational tuples g_i:
            </p>
            <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] font-mono text-[12px] text-[#0b1c30] space-y-1">
              <div>Gene = (Subject_ID, Faculty_ID, Room_ID, Timeslot_ID, Cohort_ID)</div>
              <div className="text-[#3525cd] font-bold">Chromosome Length: N_sessions = 25 lecture slots / division</div>
            </div>
            <p className="text-[13px] text-[#565e74]">
              Where Timeslot_ID is mapped to (Day d in [1..5], Period p in [1..5]). The 11:00–11:30 AM break is not encoded as a lecture slot, so genes can only occupy the five valid periods each day.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0] space-y-4">
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
              Invariant Preservation Rules
            </h3>
            <div className="space-y-3 text-[13px]">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                <strong className="text-[#3525cd] block">Fixed Recess Barrier</strong>
                <span className="text-[#565e74]">
                  The 30-minute break from 11:00–11:30 AM is compulsory and permanently protected. The first three lectures end at 11:00 AM; Period 4 begins at 11:30 AM. No chromosome can assign a lecture during the break.
                </span>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                <strong className="text-[#3525cd] block">Lab Block Synchronization</strong>
                <span className="text-[#565e74]">
                  Language and Phonetics Lab-3 sessions require a contiguous 2-period span and cannot be split by standard single-period swaps.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Operators */}
      {activeTab === 'operators' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30] mb-2">
              Interactive 2-Point Ordered Crossover (OX) Demo
            </h3>
            <p className="text-[13px] text-[#565e74] mb-4">
              Select two elite parent chromosomes and witness how segment exchange preserves course frequency while exploring novel schedule topologies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                <span className="text-[11px] font-bold text-[#3525cd] uppercase block mb-1.5">
                  Parent Chromosome A
                </span>
                <div className="flex gap-1.5 flex-wrap font-mono text-[12px]">
                  {parentA.map((sub, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded border font-semibold ${
                        i === 2 || i === 3 ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-[#dce9ff] text-[#0b1c30]'
                      }`}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                <span className="text-[11px] font-bold text-[#4f46e5] uppercase block mb-1.5">
                  Parent Chromosome B
                </span>
                <div className="flex gap-1.5 flex-wrap font-mono text-[12px]">
                  {parentB.map((sub, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded border font-semibold ${
                        i === 2 || i === 3 ? 'bg-indigo-100 border-indigo-300 text-indigo-900' : 'bg-white border-[#dce9ff] text-[#0b1c30]'
                      }`}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={runSampleCrossover}
              className="px-4 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-[13px] font-semibold cursor-pointer"
            >
              Simulate 2-Point Crossover (OX)
            </button>

            {crossoverResult && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1.5">
                  Offspring Child Chromosome C
                </span>
                <div className="flex gap-1.5 flex-wrap font-mono text-[12px]">
                  {crossoverResult.map((sub, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded border font-bold ${
                        i === 2 || i === 3 ? 'bg-emerald-200 border-emerald-400 text-emerald-950' : 'bg-white border-emerald-200 text-emerald-900'
                      }`}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] text-emerald-700 mt-2">
                  Inherited segment [2..3] from Parent B while maintaining gene validity!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Fitness */}
      {activeTab === 'fitness' && (
        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0] space-y-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
            Multi-Objective Fitness Formulation
          </h3>
          <p className="text-[13px] text-[#565e74]">
            The objective function scales from 0 to 100%, incorporating strict hard constraint death penalties and progressive soft preference rewards:
          </p>

          <div className="p-4 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] font-mono text-[13px] text-[#0b1c30] space-y-2">
            <div className="font-bold text-[#3525cd]">
              Fitness(x) = 100 - (w_hard * ∑ H_i(x)) - (w_soft * ∑ S_j(x))
            </div>
            <div className="text-[12px] text-[#565e74]">
              Where w_hard = 25.0 (Strict feasibility barrier) and w_soft = 0.4
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200 text-[12px]">
              <strong className="text-rose-900 block mb-1">Hard Penalties (Must be 0)</strong>
              <ul className="list-disc pl-4 space-y-1 text-rose-800">
                <li>Teacher collision in slot: -25 pts</li>
                <li>Room double-allocation in slot: -25 pts</li>
                <li>Cohort simultaneous double session: -25 pts</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 text-[12px]">
              <strong className="text-amber-900 block mb-1">Soft Penalties (Minimization)</strong>
              <ul className="list-disc pl-4 space-y-1 text-amber-800">
                <li>Faculty load &gt; 4 periods/day: -2 pts</li>
                <li>Student idle gap between classes: -2 pts per empty slot</li>
                <li>Suboptimal afternoon assignment: -1 pt</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
