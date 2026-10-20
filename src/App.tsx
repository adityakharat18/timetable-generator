/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthScreen } from './components/AuthScreen';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { activateSavedTimetable, listSavedTimetables, saveTimetableVersion } from './lib/timetableRepository';
import { NavigationPath, Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { GeneratorView } from './components/GeneratorView';
import { WeeklyTimetableView } from './components/WeeklyTimetableView';
import { EditorView } from './components/EditorView';
import { GADesignView } from './components/GADesignView';
import { VisualizerView } from './components/VisualizerView';
import { ComparisonView } from './components/ComparisonView';
import { AcademicDataView } from './components/AcademicDataView';
import { SavedTimetablesView } from './components/SavedTimetablesView';
import { SlotDetailModal } from './components/SlotDetailModal';
import { ExportModal } from './components/ExportModal';
import { DayOfWeek, ScheduledClass, TimetableVersion } from './types/schedule';
import { DAYS, FACULTY_MEMBERS, INITIAL_SCHEDULE_DIV_A, INITIAL_VERSIONS, ROOMS, SUBJECTS } from './data/mockData';
import { createRandomPopulation, evaluateChromosome, stepGeneration } from './utils/gaEngine';
import { DEFAULT_HYPERPARAMETERS } from './data/mockData';

function EvoScheduleWorkspace({ userId, userEmail, onSignOut }: { userId?: string; userEmail?: string; onSignOut?: () => void }) {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('overview');
  const [activeCohort, setActiveCohort] = useState<'Div A' | 'Div B' | 'Div C'>('Div A');
  const [schedule, setSchedule] = useState<ScheduledClass[]>(() => {
    try { const stored = localStorage.getItem('evoschedule.schedule'); return stored ? JSON.parse(stored) as ScheduledClass[] : INITIAL_SCHEDULE_DIV_A; } catch { return INITIAL_SCHEDULE_DIV_A; }
  });
  const [versions, setVersions] = useState<TimetableVersion[]>(() => {
    try { const stored = localStorage.getItem('evoschedule.versions'); return stored ? JSON.parse(stored) as TimetableVersion[] : INITIAL_VERSIONS; } catch { return INITIAL_VERSIONS; }
  });
  const [selectedSlot, setSelectedSlot] = useState<ScheduledClass | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(Boolean(userId));

  React.useEffect(() => {
    if (userId) return; // Supabase accounts are persisted through the repository below.
    localStorage.setItem('evoschedule.schedule', JSON.stringify(schedule));
  }, [schedule, userId]);

  React.useEffect(() => {
    if (userId) return;
    localStorage.setItem('evoschedule.versions', JSON.stringify(versions));
  }, [versions, userId]);

  React.useEffect(() => {
    let cancelled = false;
    if (!userId) { setIsCloudLoading(false); return; }
    setIsCloudLoading(true);
    listSavedTimetables().then((saved) => {
      if (cancelled) return;
      setVersions(saved);
      const active = saved.find((item) => item.isLive) ?? saved[0];
      if (active?.schedule) {
        setSchedule(active.schedule);
        if (active.cohort) setActiveCohort(active.cohort);
      } else {
        setSchedule([]);
      }
    }).catch((error) => {
      if (!cancelled) window.alert(`Could not load saved timetables from Supabase: ${error instanceof Error ? error.message : String(error)}`);
    }).finally(() => { if (!cancelled) setIsCloudLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const commitVersion = async (version: TimetableVersion, activate: boolean) => {
    if (!userId) {
      setVersions((prev) => [version, ...prev.map((item) => ({ ...item, isLive: activate ? false : item.isLive }))]);
      return;
    }
    try {
      const saved = await saveTimetableVersion(version, activate);
      setVersions((prev) => [saved, ...prev.map((item) => ({ ...item, isLive: activate ? false : item.isLive }))]);
    } catch (error) {
      window.alert(`Could not save the timetable to Supabase: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Real-time evaluation
  const evalResult = evaluateChromosome(schedule.filter((c) => c.cohort === activeCohort));

  const handleApplyScheduleFromGA = (newGenes: ScheduledClass[], fitness: number) => {
    const cohort = newGenes[0]?.cohort ?? activeCohort;
    const mergedSchedule = [...schedule.filter((item) => item.cohort !== cohort), ...newGenes];
    setSchedule(mergedSchedule);
    setActiveCohort(cohort);
    const newVersion: TimetableVersion = {
      id: `ver-${Date.now()}`,
      version: `v${Date.now().toString().slice(-4)}`,
      name: `B.Com ${cohort} — Schedule [GA Optimized]`,
      type: 'Active GA',
      timestamp: new Date().toLocaleString(),
      fitness,
      hardViolations: evaluateChromosome(newGenes).hardViolations,
      softPenalties: evaluateChromosome(newGenes).softPenalties,
      generation: 500,
      isLive: true,
      notes: 'Generated through the timetable optimizer.',
      schedule: mergedSchedule,
      cohort,
    };
    void commitVersion(newVersion, true);
    setCurrentPath('timetable');
    setIsEngineRunning(false);
  };

  const handleCreateNewTimetable = (config: { name: string; days: DayOfWeek[]; subjectIds: string[]; cohort: 'Div A' | 'Div B' | 'Div C' }) => {
    const chosenSubjects = SUBJECTS.filter((subject) => config.subjectIds.includes(subject.id));
    if (!chosenSubjects.length || !config.days.length) return;

    const selectedDays = DAYS.filter((day) => config.days.includes(day));
    const generated: ScheduledClass[] = [];
    const existingOtherCohorts = schedule.filter((item) => item.cohort !== config.cohort);

    selectedDays.forEach((day, dayIndex) => {
      // Shuffle subjects per day so the weekly pattern is not identical each day.
      const daySubjects = [...chosenSubjects].sort(() => Math.random() - 0.5);
      for (let periodIndex = 0; periodIndex < 5; periodIndex += 1) {
        const subject = daySubjects[periodIndex % daySubjects.length];
        const periodNumber = periodIndex + 1;
        const sameTimeExisting = existingOtherCohorts.filter((item) => item.day === day && item.periodNumber === periodNumber);
        const subjectFaculty = FACULTY_MEMBERS.find((faculty) =>
          subject.department.toLowerCase().includes(faculty.department.replace('Dept of ', '').toLowerCase())
        );
        const facultyCandidates = [...FACULTY_MEMBERS].sort((a, b) => {
          if (a.id === subjectFaculty?.id) return -1;
          if (b.id === subjectFaculty?.id) return 1;
          return 0;
        });
        const faculty = facultyCandidates.find((candidate) => !sameTimeExisting.some((item) => item.facultyId === candidate.id)) ?? facultyCandidates[(dayIndex + periodIndex) % facultyCandidates.length];
        const room = ROOMS.find((candidate) => !sameTimeExisting.some((item) => item.roomId === candidate.id)) ?? ROOMS[(dayIndex + periodIndex) % ROOMS.length];
        generated.push({
          id: `new-${Date.now()}-${dayIndex}-${periodNumber}-${Math.random().toString(36).slice(2, 6)}`,
          day,
          periodNumber,
          subjectId: subject.id,
          subjectCode: subject.code,
          subjectName: subject.name,
          type: 'LEC',
          facultyId: faculty.id,
          facultyName: faculty.name,
          facultyCode: faculty.code,
          roomId: room.id,
          roomCode: room.code,
          cohort: config.cohort,
          topicOrUnit: 'Scheduled lecture',
        });
      }
    });

    // Run a small real GA search on this candidate timetable, then normalize its genes
    // back onto the selected day/period grid so every selected slot remains occupied once.
    const gaParams = { ...DEFAULT_HYPERPARAMETERS, populationSize: 40, maxGenerations: 30, elitismKeepers: 2 };
    let population = createRandomPopulation(generated, gaParams.populationSize);
    for (let generation = 0; generation < gaParams.maxGenerations; generation += 1) {
      population = stepGeneration(population, gaParams).newPopulation;
    }
    const bestChromosome = [...population].sort((a, b) => b.fitness - a.fitness)[0];
    const bestGenes = [...(bestChromosome?.genes ?? generated)].sort((a, b) => {
      const dayOrder = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      return dayOrder || a.periodNumber - b.periodNumber;
    });
    const slotSequence = selectedDays.flatMap((day) => [1, 2, 3, 4, 5].map((periodNumber) => ({ day, periodNumber })));
    const optimizedSchedule: ScheduledClass[] = slotSequence.map((slot, index) => {
      const gene = bestGenes[index] ?? generated[index];
      const sameTimeExisting = existingOtherCohorts.filter((item) => item.day === slot.day && item.periodNumber === slot.periodNumber);
      const faculty = FACULTY_MEMBERS.find((candidate) => candidate.id === gene.facultyId && !sameTimeExisting.some((item) => item.facultyId === candidate.id))
        ?? FACULTY_MEMBERS.find((candidate) => !sameTimeExisting.some((item) => item.facultyId === candidate.id))
        ?? FACULTY_MEMBERS[0];
      const room = ROOMS.find((candidate) => candidate.id === gene.roomId && !sameTimeExisting.some((item) => item.roomId === candidate.id))
        ?? ROOMS.find((candidate) => !sameTimeExisting.some((item) => item.roomId === candidate.id))
        ?? ROOMS[0];
      return { ...gene, day: slot.day, periodNumber: slot.periodNumber, facultyId: faculty.id, facultyName: faculty.name, facultyCode: faculty.code, roomId: room.id, roomCode: room.code, cohort: config.cohort };
    });

    const mergedSchedule = [...schedule.filter((item) => item.cohort !== config.cohort), ...optimizedSchedule];
    const evaluation = evaluateChromosome(optimizedSchedule);
    const newVersion: TimetableVersion = {
      id: `ver-${Date.now()}`,
      version: `v${Date.now().toString().slice(-4)}`,
      name: config.name,
      type: 'Active GA',
      timestamp: new Date().toLocaleString(),
      fitness: evaluation.fitness,
      hardViolations: evaluation.hardViolations,
      softPenalties: evaluation.softPenalties,
      generation: 30,
      isLive: true,
      notes: `Created for ${config.cohort} using 30 GA generations; ${selectedDays.length} day(s), ${chosenSubjects.length} subject(s), five lecture periods per day. The 11:00–11:30 AM break is protected.`,
      schedule: mergedSchedule,
      cohort: config.cohort,
    };

    setSchedule(mergedSchedule);
    setActiveCohort(config.cohort);
    void commitVersion(newVersion, true);
    setCurrentPath('timetable');
    setIsEngineRunning(false);
  };

  const handleSaveAsDraft = (name: string) => {
    const draftVersion: TimetableVersion = {
      id: `ver-draft-${Date.now()}`,
      version: 'v4.3-draft',
      name: name,
      type: 'Manual Draft',
      timestamp: 'Just now',
      fitness: evalResult.fitness,
      hardViolations: evalResult.hardViolations,
      softPenalties: evalResult.softPenalties,
      generation: 0,
      isLive: false,
      notes: 'Manual modifications saved from Timetable Editor.',
      schedule: [...schedule],
      cohort: activeCohort,
    };

    void commitVersion(draftVersion, false);
  };

  const handleActivateVersion = (ver: TimetableVersion) => {
    setVersions((prev) => prev.map((v) => ({ ...v, isLive: v.id === ver.id })));
    if (userId) void activateSavedTimetable(ver.id).catch((error) => window.alert(`Could not activate saved timetable: ${error instanceof Error ? error.message : String(error)}`));
    if (ver.schedule) {
      setSchedule(ver.schedule);
      const cohort = ver.cohort ?? ver.schedule.find((item) => item.cohort)?.cohort;
      if (cohort) setActiveCohort(cohort);
      setCurrentPath('timetable');
    }
  };

  if (isCloudLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] text-slate-600">Loading your saved timetables…</div>;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        isEngineRunning={isEngineRunning}
        userEmail={userEmail}
        onSignOut={onSignOut}
      />

      {/* Main Wrapper with Left Padding for fixed 256px sidebar */}
      <div className="pl-64">
        {/* Top Header */}
        <Header
          activeCohort={activeCohort}
          onCohortChange={setActiveCohort}
          hardViolationsCount={evalResult.hardViolations}
          fitnessScore={evalResult.fitness}
          onRunOptimization={() => {
            setCurrentPath('generator');
            setIsEngineRunning(true);
          }}
        />

        {/* View Router */}
        <main className="w-full pt-16 min-h-[calc(100vh-4rem)]">
          {currentPath === 'overview' && (
            <OverviewView
              schedule={schedule}
              versions={versions}
              onNavigate={setCurrentPath}
              onOpenExport={() => setIsExportModalOpen(true)}
              onSelectSlot={setSelectedSlot}
              onSwitchVersion={handleActivateVersion}
            />
          )}

          {currentPath === 'generator' && (
            <GeneratorView
              currentSchedule={schedule}
              onApplySchedule={handleApplyScheduleFromGA}
              onNavigateToGrid={() => setCurrentPath('timetable')}
              onCreateNewTimetable={handleCreateNewTimetable}
            />
          )}

          {currentPath === 'timetable' && (
            <WeeklyTimetableView
              schedule={schedule}
              activeCohort={activeCohort}
              onCohortChange={setActiveCohort}
              onEditClick={() => setCurrentPath('editor')}
              onRegenerate={() => {
                setCurrentPath('generator');
                setIsEngineRunning(true);
              }}
              onSaveVersion={() => handleSaveAsDraft(`Schedule Snapshot (${activeCohort})`)}
              onOpenExport={() => setIsExportModalOpen(true)}
              onSelectSlot={setSelectedSlot}
            />
          )}

          {currentPath === 'editor' && (
            <EditorView
              schedule={schedule}
              cohort={activeCohort}
              onUpdateSchedule={setSchedule}
              onSaveAsDraft={handleSaveAsDraft}
            />
          )}

          {currentPath === 'ga-design' && <GADesignView />}

          {currentPath === 'visualizer' && <VisualizerView />}

          {currentPath === 'comparison' && <ComparisonView />}

          {currentPath === 'academic-data' && <AcademicDataView />}

          {currentPath === 'saved' && (
            <SavedTimetablesView
              versions={versions}
              onActivateVersion={handleActivateVersion}
              onOpenExport={() => setIsExportModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Slot Inspection Modal */}
      <SlotDetailModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onNavigateToEditor={() => setCurrentPath('editor')}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        schedule={schedule}
        cohort={activeCohort}
      />
    </div>
  );
}


export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(isSupabaseConfigured);

  React.useEffect(() => {
    if (!supabase) { setCheckingSession(false); return; }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Could not restore Supabase session:', error.message);
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCheckingSession(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <EvoScheduleWorkspace />;
  if (checkingSession) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] text-slate-600">Connecting securely to Supabase…</div>;
  if (!session) return <AuthScreen />;
  return <EvoScheduleWorkspace key={session.user.id} userId={session.user.id} userEmail={session.user.email} onSignOut={() => void supabase?.auth.signOut()} />;
}
