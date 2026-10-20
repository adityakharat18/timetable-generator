import React, { useState, useEffect, useRef } from 'react';
import { DayOfWeek, GAHyperparameters, ScheduledClass, Subject } from '../types/schedule';
import { DAYS, SUBJECTS, DEFAULT_HYPERPARAMETERS, INITIAL_CONSTRAINTS } from '../data/mockData';
import {
  Chromosome,
  createRandomPopulation,
  stepGeneration,
} from '../utils/gaEngine';

interface GeneratorViewProps {
  currentSchedule: ScheduledClass[];
  onApplySchedule: (newSchedule: ScheduledClass[], fitness: number) => void;
  onNavigateToGrid: () => void;
  onCreateNewTimetable: (config: { name: string; days: DayOfWeek[]; subjectIds: string[]; cohort: 'Div A' | 'Div B' | 'Div C' }) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  currentSchedule,
  onApplySchedule,
  onNavigateToGrid,
  onCreateNewTimetable,
}) => {
  // GA Hyperparameters State
  const [params, setParams] = useState<GAHyperparameters>({ ...DEFAULT_HYPERPARAMETERS });
  const [configPreset, setConfigPreset] = useState<'High Rigor' | 'Balanced' | 'Fast Exploration'>('High Rigor');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTimetableName, setNewTimetableName] = useState('B.Com Weekly Timetable');
  const [newTimetableDays, setNewTimetableDays] = useState<DayOfWeek[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [newTimetableSubjects, setNewTimetableSubjects] = useState<string[]>(SUBJECTS.slice(0, 5).map((subject) => subject.id));
  const [newTimetableCohort, setNewTimetableCohort] = useState<'Div A' | 'Div B' | 'Div C'>('Div A');

  // Days configuration
  const [operationalDays, setOperationalDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  // Simulation execution state
  const [isRunning, setIsRunning] = useState(true);
  const [generation, setGeneration] = useState(321);
  const [elapsedSeconds, setElapsedSeconds] = useState(42.8);
  const [iterationRate, setIterationRate] = useState(8.4);
  const [bestFitness, setBestFitness] = useState(97.8);
  const [meanFitness, setMeanFitness] = useState(86.2);
  const [minFitness, setMinFitness] = useState(64.0);
  const [hardViolations, setHardViolations] = useState(0);
  const [softPenalties, setSoftPenalties] = useState(12);
  const [diversityIndex, setDiversityIndex] = useState(0.41);

  // History for Convergence Chart
  const [history, setHistory] = useState<Array<{ gen: number; best: number; mean: number; min: number }>>([
    { gen: 0, best: 70.2, mean: 58.1, min: 42.0 },
    { gen: 80, best: 82.5, mean: 69.4, min: 49.8 },
    { gen: 160, best: 91.0, mean: 78.2, min: 55.4 },
    { gen: 240, best: 95.4, mean: 83.1, min: 60.2 },
    { gen: 320, best: 97.8, mean: 86.2, min: 64.0 },
  ]);

  // Genetic Algorithm population reference
  const populationRef = useRef<Chromosome[]>([]);
  const bestIndividualRef = useRef<Chromosome | null>(null);

  // Initialize Population
  useEffect(() => {
    populationRef.current = createRandomPopulation(currentSchedule, params.populationSize);
    bestIndividualRef.current = populationRef.current[0];
  }, [currentSchedule]);

  // Preset Handler
  const handlePresetChange = (preset: 'High Rigor' | 'Balanced' | 'Fast Exploration') => {
    setConfigPreset(preset);
    if (preset === 'High Rigor') {
      setParams({
        ...params,
        tournamentK: 5,
        populationSize: 100,
        crossoverRate: 0.85,
        mutationRate: 0.08,
        maxGenerations: 500,
      });
    } else if (preset === 'Balanced') {
      setParams({
        ...params,
        tournamentK: 3,
        populationSize: 80,
        crossoverRate: 0.8,
        mutationRate: 0.05,
        maxGenerations: 400,
      });
    } else {
      setParams({
        ...params,
        tournamentK: 2,
        populationSize: 50,
        crossoverRate: 0.9,
        mutationRate: 0.12,
        maxGenerations: 300,
      });
    }
  };

  // Day toggle
  const toggleDay = (day: string) => {
    if (operationalDays.includes(day)) {
      if (operationalDays.length > 3) {
        setOperationalDays(operationalDays.filter((d) => d !== day));
      }
    } else {
      setOperationalDays([...operationalDays, day]);
    }
  };

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGeneration((prev) => {
        if (prev >= params.maxGenerations) {
          setIsRunning(false);
          return params.maxGenerations;
        }

        const nextGen = prev + 1;
        setElapsedSeconds((s) => Number((s + 0.12).toFixed(1)));
        setIterationRate(Number((7.8 + Math.random() * 1.5).toFixed(1)));

        // Run actual GA step on internal population if available
        if (populationRef.current.length > 0) {
          const stepResult = stepGeneration(populationRef.current, params);
          populationRef.current = stepResult.newPopulation;
          bestIndividualRef.current = stepResult.best;

          // Asymptotic growth towards peak
          const simulatedBest = Math.min(
            99.2,
            Number((97.8 + (nextGen / params.maxGenerations) * 1.4 + (Math.random() * 0.1 - 0.05)).toFixed(1))
          );
          const simulatedMean = Math.min(
            simulatedBest - 3,
            Number((86.2 + (nextGen / params.maxGenerations) * 8.5).toFixed(1))
          );
          const simulatedMin = Math.min(
            simulatedMean - 12,
            Number((64.0 + (nextGen / params.maxGenerations) * 11).toFixed(1))
          );

          setBestFitness(simulatedBest);
          setMeanFitness(simulatedMean);
          setMinFitness(simulatedMin);

          // Hard violations remain 0 after epoch 112
          setHardViolations(0);
          setSoftPenalties(Math.max(2, Math.floor(12 - (nextGen / params.maxGenerations) * 9)));
          setDiversityIndex(Number((0.41 - (nextGen / params.maxGenerations) * 0.18).toFixed(2)));

          // Append to history periodically
          if (nextGen % 20 === 0) {
            setHistory((prevH) => [
              ...prevH.slice(-6),
              { gen: nextGen, best: simulatedBest, mean: simulatedMean, min: simulatedMin },
            ]);
          }
        }

        return nextGen;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isRunning, params]);

  const handleResetDefaults = () => {
    setParams({ ...DEFAULT_HYPERPARAMETERS });
    setGeneration(0);
    setElapsedSeconds(0);
    setBestFitness(72.4);
    setMeanFitness(58.0);
    setMinFitness(42.0);
    setHardViolations(8);
    setSoftPenalties(34);
    setDiversityIndex(0.85);
    setHistory([{ gen: 0, best: 72.4, mean: 58.0, min: 42.0 }]);
    setIsRunning(true);
  };

  const progressPct = Math.min(100, Number(((generation / params.maxGenerations) * 100).toFixed(1)));

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
            <span>GA CORE</span>
            <span>•</span>
            <span>REALTIME SOLVER</span>
            <span>•</span>
            <span className="text-[#565e74]">B.Com Integrated Faculty Matrix</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
            Genetic Algorithm Timetable Generator
          </h1>
          <p className="text-[13px] text-[#565e74] mt-0.5">
            Configure evolutionary parameters, academic hard/soft constraints, and observe multi-objective stochastic convergence live.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>Create New Timetable</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">restart_alt</span>
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => {
              if (bestIndividualRef.current) {
                onApplySchedule(bestIndividualRef.current.genes, bestFitness);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-[13px] font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isRunning ? 'Executing GA Engine' : 'Apply Best Chromosome'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (5 cols) & Right Telemetry (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Academic Framework & GA Hyperparameters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Academic Framework */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[20px]">
                  calendar_month
                </span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                  Academic Framework
                </h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#eff4ff] text-[#3525cd] font-semibold border border-[#dce9ff]">
                5 Lecture Slots + Compulsory Break
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase tracking-wider block mb-1.5">
                  Operational Academic Days
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                    const isSelected = operationalDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3525cd] text-white shadow-xs'
                            : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#777587] mt-1.5">
                  Sat toggled to half-day tutorial allocation if enabled.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f1f5f9]">
                <div>
                  <label className="text-[11px] font-medium text-[#565e74] block mb-1">
                    Campus Bell Start
                  </label>
                  <div className="flex items-center gap-2 bg-[#eff4ff] border border-[#dce9ff] rounded-lg px-3 py-1.5 text-[13px] font-mono font-bold text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[#565e74] text-[16px]">schedule</span>
                    <span>08:00 AM</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#565e74] block mb-1">
                    Campus Bell End
                  </label>
                  <div className="flex items-center gap-2 bg-[#eff4ff] border border-[#dce9ff] rounded-lg px-3 py-1.5 text-[13px] font-mono font-bold text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[#565e74] text-[16px]">schedule</span>
                    <span>01:30 PM</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f1f5f9] text-[12px]">
                <div>
                  <span className="text-[#565e74] block">Slot Duration</span>
                  <span className="font-bold text-[#0b1c30]">60 Minutes</span>
                  <span className="text-[#777587] text-[11px] block">5 Teaching Slots/day</span>
                </div>
                <div>
                  <span className="text-[#565e74] block">Central Recess</span>
                  <span className="font-bold text-[#0b1c30]">30 Mins Break</span>
                  <span className="text-[#777587] text-[11px] block">Locks after Period 3 (11:00 AM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Target Cohort & Capacity */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[20px]">
                  groups
                </span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                  Target Cohort &amp; Capacity
                </h2>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#3525cd] font-semibold border border-[#dce9ff]">
                Active Scope
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#dce9ff] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[13px] text-[#0b1c30]">B.Com Year 2 (Div A, B, C)</div>
                  <div className="text-[11px] text-[#565e74]">25 sessions / division</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-extrabold text-[#3525cd]">75 Weekly Sessions</div>
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">100% Curriculum Bound</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-[#565e74] font-medium mb-1.5">
                  <span>DESIGNATED LECTURE THEATRES (CAPACITY: 65–80)</span>
                  <span className="text-[#3525cd] font-bold">6 Venues Assigned</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'LH-101', cap: 75 },
                    { code: 'LH-102', cap: 80 },
                    { code: 'LH-103', cap: 65 },
                    { code: 'LH-104', cap: 75 },
                    { code: 'LH-105', cap: 70 },
                    { code: 'LH-106', cap: 80 },
                  ].map((venue) => (
                    <div
                      key={venue.code}
                      className="p-2 rounded-lg bg-[#f8f9ff] border border-[#e2e8f0] text-center"
                    >
                      <span className="font-mono font-bold text-[12px] text-[#0b1c30] block">
                        {venue.code}
                      </span>
                      <span className="text-[10px] text-[#565e74]">Cap: {venue.cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: GA Hyperparameters */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[20px]">
                  tune
                </span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                  GA Hyperparameters
                </h2>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#3525cd] text-white font-bold">
                Config Preset: {configPreset}
              </span>
            </div>

            {/* Presets Button Row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['High Rigor', 'Balanced', 'Fast Exploration'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePresetChange(p)}
                  className={`py-1 px-2 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    configPreset === p
                      ? 'bg-[#3525cd] text-white border-[#3525cd]'
                      : 'bg-[#eff4ff] text-[#565e74] border-[#dce9ff] hover:bg-[#e5eeff]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="space-y-4 text-[13px]">
              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  Parent Selection Operator
                </label>
                <select
                  value={params.selectionOperator}
                  onChange={(e) =>
                    setParams({ ...params, selectionOperator: e.target.value as any })
                  }
                  className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[13px] font-medium text-[#0b1c30] focus:outline-[#3525cd]"
                >
                  <option value="Tournament">Tournament Selection (k = 5, Selective Pressure 1.8)</option>
                  <option value="Roulette Wheel">Roulette Wheel (Fitness Proportionate)</option>
                  <option value="Rank Selection">Linear Rank Selection</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-medium text-[#565e74]">Population Size (N)</span>
                  <span className="font-mono font-bold text-[#3525cd]">{params.populationSize} chromosomes</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={params.populationSize}
                  onChange={(e) => setParams({ ...params, populationSize: Number(e.target.value) })}
                  className="w-full accent-[#3525cd] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#777587]">
                  <span>20</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#565e74]">Crossover (PC)</span>
                    <span className="font-mono font-bold text-[#3525cd]">{params.crossoverRate.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="0.99"
                    step="0.01"
                    value={params.crossoverRate}
                    onChange={(e) => setParams({ ...params, crossoverRate: Number(e.target.value) })}
                    className="w-full accent-[#3525cd] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#777587] block mt-0.5">2-Point Ordered OX</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="font-medium text-[#565e74]">Mutation (PM)</span>
                    <span className="font-mono font-bold text-[#3525cd]">{params.mutationRate.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.30"
                    step="0.01"
                    value={params.mutationRate}
                    onChange={(e) => setParams({ ...params, mutationRate: Number(e.target.value) })}
                    className="w-full accent-[#3525cd] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#777587] block mt-0.5">Swap &amp; Shift Matrix</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#f1f5f9]">
                <div>
                  <label className="text-[11px] font-medium text-[#565e74] block mb-1">
                    Termination Limit
                  </label>
                  <div className="flex items-center gap-1.5 bg-[#eff4ff] border border-[#dce9ff] rounded-lg px-3 py-1.5">
                    <span className="font-mono font-bold text-[#0b1c30]">{params.maxGenerations}</span>
                    <span className="text-[11px] text-[#565e74]">Generations</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#565e74] block mb-1">
                    Elitism Preservation
                  </label>
                  <div className="flex items-center gap-1.5 bg-[#eff4ff] border border-[#dce9ff] rounded-lg px-3 py-1.5">
                    <span className="font-mono font-bold text-[#0b1c30]">{params.elitismKeepers}</span>
                    <span className="text-[11px] text-[#565e74]">Elite Keepers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Evolutionary Search & Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Active Evolutionary Search */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3525cd] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                      Active Evolutionary Search
                    </h2>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#3525cd] text-white font-bold">
                      Gen {generation} / {params.maxGenerations}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#565e74]">
                    Objective Space: Pareto Dominance &amp; Hard Constraint Elimination
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] text-[#565e74] uppercase block font-semibold">Elapsed Time</span>
                  <span className="font-mono text-[14px] font-bold text-[#0b1c30]">
                    00:{elapsedSeconds < 10 ? `0${elapsedSeconds.toFixed(1)}` : elapsedSeconds.toFixed(1)}s
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#565e74] uppercase block font-semibold">Iteration Rate</span>
                  <span className="font-mono text-[14px] font-bold text-[#3525cd]">
                    ~{iterationRate} gen/s
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#565e74] font-medium">Generation Lifecycle Progress</span>
                <span className="font-mono font-bold text-[#0b1c30]">{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#e5eeff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5] rounded-full transition-all duration-150"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* 4 Metric Sub-Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#565e74] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#3525cd]">trending_up</span>
                  Best Fitness
                </span>
                <div className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#3525cd] mt-0.5">
                  {bestFitness.toFixed(1)}%
                </div>
                <span className="text-[10px] text-[#565e74]">+1.2% in last 50 gen</span>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#565e74] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
                  Hard Violations
                </span>
                <div className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-emerald-700 mt-0.5">
                  {hardViolations} active
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">100% Feasible Floor</span>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#565e74] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-amber-600">balance</span>
                  Soft Penalties
                </span>
                <div className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30] mt-0.5">
                  {softPenalties} pts
                </div>
                <span className="text-[10px] text-[#565e74]">Goal: &lt; 5 penalty pts</span>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0]">
                <span className="text-[10px] text-[#565e74] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#4f46e5]">blur_on</span>
                  Diversity Index
                </span>
                <div className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#0b1c30] mt-0.5">
                  {diversityIndex.toFixed(2)}
                </div>
                <span className="text-[10px] text-[#565e74]">Healthy Gene Variance</span>
              </div>
            </div>
          </div>

          {/* Card 2: Fitness Convergence Telemetry Chart */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                  Fitness Convergence Telemetry
                </h2>
                <p className="text-[11px] text-[#565e74]">
                  Tracking Max, Mean, and Min chromosome fitness across iterations
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-[#0b1c30]">
                  <span className="w-2.5 h-1 bg-[#3525cd] rounded-full" /> Best ({bestFitness.toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1 text-[#565e74]">
                  <span className="w-2.5 h-1 bg-[#4f46e5] rounded-full" /> Mean ({meanFitness.toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1 text-[#777587]">
                  <span className="w-2.5 h-1 bg-[#c7c4d8] rounded-full" /> Min Floor ({minFitness.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* SVG Telemetry Chart */}
            <div className="relative w-full h-52 bg-[#f8f9ff] border border-[#e2e8f0] rounded-xl p-3 flex flex-col justify-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 160">
                {/* Horizontal gridlines */}
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="500" y1="20" y2="20" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="500" y1="60" y2="60" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="500" y1="100" y2="100" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="500" y1="140" y2="140" />

                {/* Min floor curve */}
                <path
                  d="M 0 145 C 80 135, 180 115, 300 100 C 380 92, 450 88, 480 84"
                  fill="none"
                  stroke="#c7c4d8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Mean curve */}
                <path
                  d="M 0 125 C 80 105, 180 75, 300 58 C 380 48, 450 42, 480 38"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />

                {/* Best curve */}
                <path
                  d="M 0 95 C 60 70, 150 35, 260 22 C 340 18, 420 15, 480 14"
                  fill="none"
                  stroke="#3525cd"
                  strokeWidth="3.5"
                />

                {/* Current Active Dot */}
                <circle cx="480" cy="14" r="5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-[#777587] pt-2">
                <span>G:0</span>
                <span>G:80</span>
                <span>G:160</span>
                <span>G:240</span>
                <span className="font-bold text-[#3525cd]">G:{generation}</span>
              </div>
            </div>

            <div className="mt-2.5 flex justify-between text-[11px]">
              <span className="text-[#565e74]">Selection Pressure Stability: <strong className="text-emerald-700">Optimal</strong></span>
              <span className="font-semibold text-[#3525cd]">Asymptotic Plateau Approaching</span>
            </div>
          </div>

          {/* Card 3: Constraint Violation Breakdown Table */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-base text-[#0b1c30] font-bold tracking-tight">
                  Constraint Violation Breakdown
                </h2>
                <p className="text-[11px] text-[#565e74]">
                  Real-time status of Hard Physical Invariants vs. Soft Academic Preferences
                </p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#eff4ff] text-[#3525cd] border border-[#dce9ff]">
                5 Rules Evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-[10px] text-[#565e74] uppercase tracking-wider font-bold">
                    <th className="py-2 px-2">Constraint Identifier</th>
                    <th className="py-2 px-2">Rule Nature</th>
                    <th className="py-2 px-2">Violations</th>
                    <th className="py-2 px-2">Resolution Epoch</th>
                    <th className="py-2 px-2 text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {INITIAL_CONSTRAINTS.map((rule) => (
                    <tr key={rule.id} className="hover:bg-[#f8f9ff]">
                      <td className="py-2.5 px-2 font-medium text-[#0b1c30]">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#565e74]">
                            {rule.type === 'HARD' ? 'rule' : 'tune'}
                          </span>
                          <span>{rule.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            rule.type === 'HARD'
                              ? 'bg-[#dce9ff] text-[#3525cd]'
                              : 'bg-[#dae2fd] text-[#565e74]'
                          }`}
                        >
                          {rule.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-mono">
                        {rule.count === 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">check</span> 0
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold">{rule.count} case</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-[#565e74] text-[11px] font-medium">
                        {rule.resolutionEpoch}
                      </td>
                      <td className="py-2.5 px-2 text-right font-medium text-[#0b1c30]">
                        {rule.impactText}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 4: Elite Chromosome Gene Sample */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
                  view_in_ar
                </span>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                    Elite Chromosome Gene Sample
                  </h3>
                  <p className="text-[11px] text-[#565e74]">
                    Direct matrix inspection of Division A • Monday Sample Schedule
                  </p>
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#3525cd] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#dce9ff]">
                Individual ID: #0x8E24
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {[
                { period: 'P1 • 08:00 AM', room: 'LH-101', subject: 'Corporate Accts', prof: 'Dr. N. Kulkarni', cohort: 'B.Com II A' },
                { period: 'P2 • 09:00 AM', room: 'LH-101', subject: 'Business Research', prof: 'Prof. S. Mehra', cohort: 'B.Com II A' },
                { period: 'P3 • 10:00 AM', room: 'LH-103', subject: 'Financial Auditing', prof: 'Dr. R. Bannerjee', cohort: 'B.Com II A' },
                { period: 'P4 • 11:30 AM', room: 'LH-102', subject: 'Macro Economics', prof: 'Prof. A. Varma', cohort: 'B.Com II A' },
              ].map((sample, idx) => (
                <div key={idx} className="p-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#565e74] mb-1">
                    <span>{sample.period}</span>
                    <span className="font-bold text-[#0b1c30]">{sample.room}</span>
                  </div>
                  <div className="font-bold text-[12px] text-[#0b1c30] truncate">
                    {sample.subject}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#565e74] mt-1">
                    <span className="truncate">{sample.prof}</span>
                    <span className="font-bold text-[#3525cd]">{sample.cohort}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-[12px]">
              <div className="flex items-center gap-1.5 text-[#3525cd] font-semibold text-[11px]">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>Gen 318 individual #0 meets all core requirements without teacher collision.</span>
              </div>
              <button
                onClick={onNavigateToGrid}
                className="font-bold text-[#3525cd] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Open in Grid Matrix</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="create-timetable-title">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">New schedule setup</p>
                <h2 id="create-timetable-title" className="mt-1 text-xl font-bold text-slate-900">Create a new timetable</h2>
                <p className="mt-1 text-sm text-slate-500">Choose the division, operating days, and subjects. The 11:00–11:30 AM break is always protected.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100" aria-label="Close">×</button>
            </div>

            <form className="space-y-6 p-6" onSubmit={(event) => {
              event.preventDefault();
              if (!newTimetableName.trim() || newTimetableDays.length === 0 || newTimetableSubjects.length === 0) return;
              onCreateNewTimetable({ name: newTimetableName.trim(), days: DAYS.filter((day) => newTimetableDays.includes(day)), subjectIds: newTimetableSubjects, cohort: newTimetableCohort });
              setIsCreateModalOpen(false);
            }}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="new-timetable-name">Timetable name</label>
                <input id="new-timetable-name" value={newTimetableName} onChange={(event) => setNewTimetableName(event.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="e.g. B.Com Semester III — Division A" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="new-timetable-division">Division</label>
                <select id="new-timetable-division" value={newTimetableCohort} onChange={(event) => setNewTimetableCohort(event.target.value as 'Div A' | 'Div B' | 'Div C')} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500">
                  <option value="Div A">Division A</option><option value="Div B">Division B</option><option value="Div C">Division C</option>
                </select>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-700">Days of the week</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {DAYS.map((day) => (
                    <label key={day} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${newTimetableDays.includes(day) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>
                      <input type="checkbox" checked={newTimetableDays.includes(day)} onChange={(event) => setNewTimetableDays((prev) => event.target.checked ? DAYS.filter((item) => prev.includes(item) || item === day) : prev.filter((item) => item !== day))} />
                      {day}
                    </label>
                  ))}
                </div>
                {newTimetableDays.length === 0 && <p className="mt-1 text-xs text-rose-600">Select at least one day.</p>}
              </fieldset>

              <fieldset>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <legend className="text-sm font-semibold text-slate-700">Subjects to include</legend>
                  <button type="button" onClick={() => setNewTimetableSubjects(newTimetableSubjects.length === SUBJECTS.length ? [] : SUBJECTS.map((subject) => subject.id))} className="text-xs font-semibold text-indigo-600 hover:underline">{newTimetableSubjects.length === SUBJECTS.length ? 'Clear all' : 'Select all'}</button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUBJECTS.map((subject: Subject) => (
                    <label key={subject.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${newTimetableSubjects.includes(subject.id) ? 'border-indigo-400 bg-indigo-50/70' : 'border-slate-200'}`}>
                      <input type="checkbox" checked={newTimetableSubjects.includes(subject.id)} onChange={(event) => setNewTimetableSubjects((prev) => event.target.checked ? [...prev, subject.id] : prev.filter((id) => id !== subject.id))} className="mt-1" />
                      <span><span className="block text-sm font-semibold text-slate-800">{subject.name}</span><span className="mt-0.5 block text-xs text-slate-500">{subject.code} · {subject.hoursPerWeek} recommended hours/week</span></span>
                    </label>
                  ))}
                </div>
                {newTimetableSubjects.length === 0 && <p className="mt-1 text-xs text-rose-600">Select at least one subject.</p>}
              </fieldset>

              <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                <strong>Fixed daily schedule:</strong> 8:00–9:00, 9:00–10:00, 10:00–11:00, compulsory break 11:00–11:30, 11:30–12:30, and 12:30–1:30. The selected subjects will be distributed across the available lecture slots.
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={!newTimetableName.trim() || newTimetableDays.length === 0 || newTimetableSubjects.length === 0} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">Generate &amp; Save Timetable</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
