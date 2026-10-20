import React, { useState } from 'react';
import { DayOfWeek, ScheduledClass } from '../types/schedule';
import { DAYS, PERIOD_SLOTS, SUBJECTS } from '../data/mockData';

interface WeeklyTimetableViewProps {
  schedule: ScheduledClass[];
  activeCohort: 'Div A' | 'Div B' | 'Div C';
  onCohortChange: (cohort: 'Div A' | 'Div B' | 'Div C') => void;
  onEditClick: () => void;
  onRegenerate: () => void;
  onSaveVersion: () => void;
  onOpenExport: () => void;
  onSelectSlot: (slot: ScheduledClass) => void;
}

export const WeeklyTimetableView: React.FC<WeeklyTimetableViewProps> = ({
  schedule,
  activeCohort,
  onCohortChange,
  onEditClick,
  onRegenerate,
  onSaveVersion,
  onOpenExport,
  onSelectSlot,
}) => {
  const [perspective, setPerspective] = useState<'Student' | 'Faculty' | 'Room'>('Student');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<string>('ALL');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('ALL');
  const [density, setDensity] = useState<'Comfortable' | 'Compact'>('Comfortable');
  const [highlightKeySlots, setHighlightKeySlots] = useState<boolean>(false);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);

  const getSlot = (day: DayOfWeek, periodNum: number) => {
    let matches = schedule.filter((c) => c.day === day && c.periodNumber === periodNum);

    if (perspective === 'Student') {
      matches = matches.filter((c) => c.cohort === activeCohort);
    } else if (perspective === 'Faculty' && selectedFacultyFilter !== 'ALL') {
      matches = matches.filter((c) => c.facultyId === selectedFacultyFilter);
    } else if (perspective === 'Room' && selectedRoomFilter !== 'ALL') {
      matches = matches.filter((c) => c.roomCode === selectedRoomFilter);
    }

    return matches[0] || null;
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'LEC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TUT':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'CASE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LAB':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSlotBorderColor = (subjectCode: string) => {
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
      {/* Top Header Section matching Image 5 */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#565e74] uppercase tracking-wider mb-1">
              <span className="text-[#3525cd]">ACADEMIC TIMETABLE MATRIX</span>
              <span>•</span>
              <span className="font-mono">Gen-ID: #6A-89241-v4</span>
              <span>•</span>
              <span>Last converged 4m ago</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
              B.Com Semester III — {activeCohort} <span className="font-normal text-[#565e74]">(Academic Year 2024–25)</span>
            </h1>

            {/* Badges */}
            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                GA Validated (Zero Violations)
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eff4ff] text-[#3525cd] text-[11px] font-mono font-bold border border-[#dce9ff]">
                Fitness: 98.6%
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f8f9ff] text-[#565e74] text-[11px] font-medium border border-[#e2e8f0]">
                <span className="material-symbols-outlined text-[14px]">meeting_room</span>
                Allocated Rooms: LH-101 to LH-104 &amp; Lab-3
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#f8f9ff] text-[#565e74] text-[11px] font-mono font-medium border border-[#e2e8f0]">
                Slots: 25/25 Active
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={onEditClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#3525cd] text-white text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">edit</span>
              <span>Edit Timetable</span>
            </button>

            <button
              onClick={() => setShowValidationModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#3525cd]">checklist</span>
              <span>Validate</span>
            </button>

            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#3525cd]">cached</span>
              <span>Regenerate</span>
            </button>

            <button
              onClick={onSaveVersion}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#565e74]">bookmark</span>
              <span>Save Version</span>
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#565e74]">file_download</span>
              <span>Export</span>
              <span className="material-symbols-outlined text-[15px]">expand_more</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar matching Image 5 */}
        <div className="pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-4 text-[13px]">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Cohort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[#565e74] text-[12px] font-medium">COHORT:</span>
              <div className="inline-flex p-0.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff]">
                {(['Div A', 'Div B', 'Div C'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => onCohortChange(c)}
                    className={`px-3 py-1 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                      activeCohort === c
                        ? 'bg-[#3525cd] text-white shadow-xs'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Perspective View Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[#565e74] text-[12px] font-medium">PERSPECTIVE:</span>
              <div className="inline-flex p-0.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff]">
                {(['Student', 'Faculty', 'Room'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPerspective(p)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-[12px] font-semibold transition-all cursor-pointer ${
                      perspective === p
                        ? 'bg-white text-[#3525cd] shadow-xs'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {p === 'Student' ? 'person' : p === 'Faculty' ? 'badge' : 'meeting_room'}
                    </span>
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Density */}
            <div className="flex items-center gap-2">
              <span className="text-[#565e74] text-[12px] font-medium">DENSITY:</span>
              <div className="inline-flex p-0.5 rounded-lg bg-[#f1f5f9]">
                {(['Comfortable', 'Compact'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      density === d ? 'bg-white text-[#0b1c30] shadow-xs' : 'text-[#777587]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Sync Mode */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3525cd]" />
              <span className="text-[12px] text-[#565e74]">
                Sync Mode: <strong className="text-[#0b1c30]">Read-Only View</strong>
              </span>
            </div>

            {/* Highlight Key Slots Toggle */}
            <button
              onClick={() => setHighlightKeySlots(!highlightKeySlots)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[12px] font-medium cursor-pointer transition-colors ${
                highlightKeySlots
                  ? 'bg-[#eff4ff] text-[#3525cd] border-[#3525cd]'
                  : 'bg-white text-[#565e74] border-[#e2e8f0]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Highlight Key Slots</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Timetable Matrix Grid */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#565e74] text-[12px] uppercase font-bold border-b border-[#e2e8f0]">
                <th className="py-3 px-4 w-36 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Timeline</span>
                </th>
                {DAYS.map((day) => (
                  <th key={day} className="py-3 px-3 text-center border-l border-[#e2e8f0]">
                    <div className="font-bold text-[#0b1c30]">{day}</div>
                    <div className="text-[10px] text-[#777587] font-normal lowercase">5 slots</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {PERIOD_SLOTS.map((slotDef) => (
                <React.Fragment key={slotDef.periodNumber}>
                  {/* Recess Banner between Period 3 & 4 */}
                  {slotDef.periodNumber === 4 && (
                    <tr className="bg-[#eff4ff]/80 border-y border-[#dce9ff]">
                      <td className="py-2 px-4 font-mono text-[11px] font-bold text-[#3525cd] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">coffee</span>
                        <span>Recess</span>
                      </td>
                      <td
                        colSpan={5}
                        className="py-2 px-3 text-center text-[11px] font-bold text-[#3525cd] tracking-wider uppercase border-l border-[#dce9ff]"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">local_cafe</span>
                          <span>COMPULSORY MID-MORNING BREAK • NO LECTURES SCHEDULED</span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded text-[10px] border border-[#dce9ff]">
                            30 MIN (11:00 – 11:30 AM)
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr className="hover:bg-[#fcfdff] transition-colors">
                    {/* Period Timeline Header */}
                    <td className="py-3 px-4 bg-[#f8f9ff]/70 border-r border-[#e2e8f0]">
                      <div className="font-bold text-[13px] text-[#0b1c30]">
                        {slotDef.label}
                      </div>
                      <div className="text-[11px] font-mono text-[#565e74]">
                        {slotDef.displayTime}
                      </div>
                      <div className="text-[10px] text-[#777587]">
                        {slotDef.periodNumber === 1
                          ? 'Morning Lecture'
                          : slotDef.periodNumber === 3
                          ? 'Pre-Break Lecture'
                          : slotDef.periodNumber === 4
                          ? 'Post-Break Lecture'
                          : slotDef.periodNumber === 5
                          ? 'Final Lecture'
                          : 'Standard Lecture'}
                      </div>
                    </td>

                    {/* Monday to Friday Cells */}
                    {DAYS.map((day) => {
                      const item = getSlot(day, slotDef.periodNumber);
                      if (!item) {
                        return (
                          <td
                            key={day}
                            className="p-2 border-l border-[#e2e8f0] bg-gray-50/20 text-center"
                          >
                            <span className="text-[11px] text-gray-400 font-medium">Free Slot</span>
                          </td>
                        );
                      }

                      const borderCol = getSlotBorderColor(item.subjectCode);
                      const isHighlighted =
                        highlightKeySlots && (item.type === 'CASE' || item.type === 'TUT');

                      return (
                        <td
                          key={day}
                          className="p-2 border-l border-[#e2e8f0] align-top"
                        >
                          <div
                            onClick={() => onSelectSlot(item)}
                            style={{ borderLeft: `3px solid ${borderCol}` }}
                            className={`rounded-md p-2.5 bg-white hover:bg-[#eff4ff] border border-[#e2e8f0] hover:border-[#3525cd] transition-all cursor-pointer shadow-2xs group relative ${
                              isHighlighted ? 'ring-2 ring-amber-400 bg-amber-50/20' : ''
                            } ${density === 'Compact' ? 'py-1.5' : 'py-2.5'}`}
                          >
                            {/* Subject Title and Type */}
                            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                              <span className="font-bold text-[12px] text-[#0b1c30] group-hover:text-[#3525cd] leading-tight">
                                {item.subjectName}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${getTypeBadgeColor(
                                  item.type
                                )}`}
                              >
                                {item.type}
                              </span>
                            </div>

                            {/* Faculty Name */}
                            <div className="flex items-center gap-1 text-[11px] text-[#565e74] mb-1.5">
                              <span className="material-symbols-outlined text-[13px] text-[#777587]">
                                person
                              </span>
                              <span className="truncate">{item.facultyName}</span>
                            </div>

                            {/* Room Code & Topic Tag */}
                            <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-[#f1f5f9]">
                              <span className="font-mono font-bold text-[#0b1c30] bg-[#eff4ff] px-1.5 py-0.2 rounded border border-[#dce9ff]">
                                {item.roomCode}
                              </span>
                              {item.topicOrUnit && (
                                <span className="text-[#565e74] truncate max-w-[90px] text-right">
                                  {item.topicOrUnit}
                                </span>
                              )}
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
      </div>

      {/* Curriculum Distribution: Subject Load & Faculty Mapping */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">
              CURRICULUM DISTRIBUTION
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg text-[#0b1c30] font-bold tracking-tight">
              Subject Load &amp; Faculty Mapping
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-bold text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-md border border-[#dce9ff]">
              Total Instructional Load: <strong>25 Hours / Week</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-4">
          {SUBJECTS.map((sub) => {
            const faculty =
              sub.code === 'ACC-301'
                ? { name: 'Prof. K. Sharma', dept: 'Dept of Commerce' }
                : sub.code === 'ACC-302'
                ? { name: 'Dr. M. Kulkarni', dept: 'Dept of Accountancy' }
                : sub.code === 'LAW-303'
                ? { name: 'Prof. S. Deshmukh', dept: 'Dept of Mercantile Law' }
                : sub.code === 'SEC-304'
                ? { name: 'Dr. V. Iyer', dept: 'Dept of Management' }
                : sub.code === 'CST-305'
                ? { name: 'Dr. Arvind Rao', dept: 'Dept of Finance' }
                : { name: 'Prof. N. Mehra', dept: 'Dept of Humanities' };

            return (
              <div
                key={sub.id}
                style={{ borderTop: `3px solid ${sub.primaryColor}` }}
                className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-[#3525cd]">{sub.code}</span>
                    <span className="font-bold text-[#0b1c30]">{sub.hoursPerWeek} hrs/wk</span>
                  </div>
                  <div className="font-bold text-[13px] text-[#0b1c30] leading-tight">
                    {sub.name}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#e2e8f0] text-[11px]">
                  <div className="font-medium text-[#0b1c30] truncate">{faculty.name}</div>
                  <div className="text-[10px] text-[#565e74] truncate">{faculty.dept}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Validation Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0]">
          <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider block">
            HARD VIOLATIONS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#3525cd]">0</span>
            <span className="text-[12px] text-emerald-700 font-bold">100% Valid</span>
          </div>
          <span className="text-[11px] text-[#565e74]">No faculty or room clashes</span>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0]">
          <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider block">
            SOFT CONSTRAINTS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#0b1c30]">96.8%</span>
            <span className="text-[12px] text-[#3525cd] font-semibold">Sat</span>
          </div>
          <span className="text-[11px] text-[#565e74]">Optimal morning preferences</span>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0]">
          <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider block">
            WORKLOAD BALANCE
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#0b1c30]">Even</span>
            <span className="text-[12px] text-[#565e74]">7 hrs/day</span>
          </div>
          <span className="text-[11px] text-[#565e74]">Zero student idle gaps</span>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0]">
          <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider block">
            FACILITY UTILIZATION
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#0b1c30]">94.2%</span>
            <span className="text-[12px] text-emerald-700 font-semibold">Optimal</span>
          </div>
          <span className="text-[11px] text-[#565e74]">LH-101 to LH-104 load factor</span>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-[#565e74] uppercase">
              <span>GA CONVERGENCE</span>
              <span className="font-mono text-[#3525cd]">Gen 1,280 / 1,500</span>
            </div>
            <div className="w-full h-2 bg-[#e5eeff] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-[#3525cd] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#565e74] mt-2">
            <span>• Fitness: 0.986</span>
            <span>Entropy: 0.04 (Stabilized)</span>
          </div>
        </div>
      </div>

      {/* Validation Report Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[22px]">
                  verified_user
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                  Senate Schedule Audit Report
                </h3>
              </div>
              <button
                onClick={() => setShowValidationModal(false)}
                className="text-[#777587] hover:text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  100% Feasibility Confirmed
                </div>
                <p className="text-[12px] mt-1 text-emerald-700">
                  This schedule passes all academic regulatory invariants: zero teacher collisions, zero room overlaps, and fully balanced student hours.
                </p>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#565e74]">Faculty Daily Cap (≤4 periods)</span>
                  <span className="font-bold text-emerald-700">PASSED (Max 3.8 hrs)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#565e74]">Consecutive Lectures (≤2)</span>
                  <span className="font-bold text-emerald-700">PASSED</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#565e74]">Classroom Seating Capacity</span>
                  <span className="font-bold text-emerald-700">100% COMPLIANT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                  <span className="text-[#565e74]">Lab-3 Phonetics Synchronization</span>
                  <span className="font-bold text-emerald-700">SYNCHRONIZED</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] flex justify-end">
              <button
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 rounded-lg bg-[#3525cd] text-white text-[13px] font-semibold hover:bg-[#4f46e5] cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
