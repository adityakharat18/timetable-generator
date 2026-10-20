import React, { useState, useEffect } from 'react';

export const VisualizerView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(420);
  const [populationGrid, setPopulationGrid] = useState<number[]>([]);

  // Generate population matrix on mount
  useEffect(() => {
    const pop: number[] = [];
    for (let i = 0; i < 100; i++) {
      // High fitness for elite, varied for rest
      if (i < 5) pop.push(98.6 - i * 0.2);
      else if (i < 20) pop.push(95.0 + Math.random() * 3);
      else if (i < 60) pop.push(88.0 + Math.random() * 6);
      else pop.push(75.0 + Math.random() * 12);
    }
    setPopulationGrid(pop);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((s) => s + 1);
      setPopulationGrid((prev) =>
        prev.map((f, idx) => {
          if (idx < 5) return f; // elites preserved
          const delta = (Math.random() - 0.45) * 0.8;
          return Math.min(99.0, Math.max(70.0, Number((f + delta).toFixed(1))));
        })
      );
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getColorForFitness = (fit: number) => {
    if (fit >= 96) return 'bg-indigo-600';
    if (fit >= 92) return 'bg-indigo-500';
    if (fit >= 85) return 'bg-blue-400';
    if (fit >= 78) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
              <span>POPULATION DYNAMICS</span>
              <span>•</span>
              <span className="text-[#565e74]">CHROMOSOME PHENOTYPE HEATMAP</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Algorithm Population Visualizer
            </h1>
            <p className="text-[13px] text-[#565e74] mt-0.5">
              Live visualization of 100 chromosomes in active population pool, tracking gene variance and elite survival across epochs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3525cd] text-white text-[13px] font-semibold hover:bg-[#4f46e5] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause Stepping' : 'Resume Stepping'}</span>
            </button>
            <span className="font-mono text-[13px] text-[#0b1c30] bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] font-bold">
              Epoch #{step}
            </span>
          </div>
        </div>
      </div>

      {/* Population Matrix Grid */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
            Population Matrix (100 Individuals)
          </h2>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" /> Elite (&gt;96%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-400" /> High (85-92%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" /> Moderate (78-85%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-400" /> Low Suboptimal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2 p-4 bg-[#f8f9ff] rounded-xl border border-[#e2e8f0]">
          {populationGrid.map((fit, idx) => (
            <div
              key={idx}
              title={`Chromosome #${idx}: Fitness ${fit}%`}
              className={`h-10 rounded-md flex items-center justify-center text-white font-mono text-[10px] font-bold transition-all hover:scale-105 cursor-pointer shadow-2xs ${getColorForFitness(
                fit
              )}`}
            >
              {fit.toFixed(0)}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#777587] mt-3 text-center">
          First row represents preserved elite keepers selected via elitist elitism mechanism.
        </p>
      </div>

      {/* Two columns: Pareto Front & Diversity Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30] mb-1">
            Pareto Frontier (Hard Violations vs Soft Penalties)
          </h3>
          <p className="text-[12px] text-[#565e74] mb-4">
            Optimal boundary curve where hard conflicts = 0 and soft penalties converge to minimum.
          </p>

          <div className="relative w-full h-48 bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg p-4 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 300 120">
              <line stroke="#E2E8F0" x1="0" x2="300" y1="100" y2="100" />
              <line stroke="#E2E8F0" x1="40" x2="40" y1="0" y2="120" />

              {/* Pareto Curve */}
              <path
                d="M 50 15 Q 120 40 280 95"
                fill="none"
                stroke="#3525cd"
                strokeWidth="2.5"
              />

              {/* Dominant optimal solutions */}
              <circle cx="50" cy="15" r="4.5" fill="#3525cd" />
              <circle cx="90" cy="28" r="3.5" fill="#4f46e5" />
              <circle cx="150" cy="52" r="3.5" fill="#4f46e5" />
              <circle cx="220" cy="78" r="3.5" fill="#565e74" />
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-[#565e74] mt-2">
            <span>Left: Zero Violations (Elite)</span>
            <span>Right: Sub-optimal Space</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
          <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30] mb-1">
            Allele Frequency &amp; Gene Variance
          </h3>
          <p className="text-[12px] text-[#565e74] mb-4">
            Monitoring allele diversity to prevent premature convergence and stagnation.
          </p>

          <div className="space-y-3 text-[12px]">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#565e74]">Morning Slot Entropy</span>
                <span className="font-mono font-bold text-[#0b1c30]">0.78 (Optimal)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#565e74]">Faculty Daily Load Variance</span>
                <span className="font-mono font-bold text-[#0b1c30]">0.22 (Low Variance)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3525cd] rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#565e74]">Room Distribution Uniformity</span>
                <span className="font-mono font-bold text-[#0b1c30]">0.92 (Even Spread)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
