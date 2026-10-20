import React, { useState } from 'react';
import { DayOfWeek, ScheduledClass } from '../types/schedule';
import { DAYS, PERIOD_SLOTS, ROOMS, FACULTY_MEMBERS } from '../data/mockData';
import { evaluateChromosome } from '../utils/gaEngine';

interface EditorViewProps {
  schedule: ScheduledClass[];
  cohort: 'Div A' | 'Div B' | 'Div C';
  onUpdateSchedule: (newSchedule: ScheduledClass[]) => void;
  onSaveAsDraft: (name: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  schedule,
  cohort,
  onUpdateSchedule,
  onSaveAsDraft,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [editModalSlot, setEditModalSlot] = useState<ScheduledClass | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<ScheduledClass[][]>([]);

  const cohortSchedule = schedule.filter((c) => c.cohort === cohort);
  const evalResult = evaluateChromosome(cohortSchedule);

  const handleSlotClick = (slot: ScheduledClass) => {
    if (!selectedSlotId) {
      setSelectedSlotId(slot.id);
      setLastActionMessage(`Selected ${slot.subjectName} (${slot.day} P-${slot.periodNumber}). Click another slot to swap.`);
    } else if (selectedSlotId === slot.id) {
      setSelectedSlotId(null);
      setLastActionMessage(null);
    } else {
      // Perform Swap!
      const slotA = schedule.find((c) => c.id === selectedSlotId);
      const slotB = slot;

      if (!slotA) return;

      // Save previous state for undo
      setHistoryStack((prev) => [...prev, [...schedule]]);

      const newSchedule = schedule.map((c) => {
        if (c.id === slotA.id) {
          return {
            ...c,
            day: slotB.day,
            periodNumber: slotB.periodNumber,
          };
        }
        if (c.id === slotB.id) {
          return {
            ...c,
            day: slotA.day,
            periodNumber: slotA.periodNumber,
          };
        }
        return c;
      });

      onUpdateSchedule(newSchedule);
      setSelectedSlotId(null);

      const newEval = evaluateChromosome(newSchedule.filter((c) => c.cohort === cohort));
      if (newEval.hardViolations > 0) {
        setLastActionMessage(
          `Swapped! Warning: Introduced ${newEval.hardViolations} hard conflict(s). Revert or adjust room/faculty.`
        );
      } else {
        setLastActionMessage(
          `Successfully swapped ${slotA.subjectName} with ${slotB.subjectName}! 0 hard violations.`
        );
      }
    }
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    onUpdateSchedule(previous);
    setLastActionMessage('Reverted to previous schedule state.');
  };

  const handleSaveModal = (updated: ScheduledClass) => {
    const newSchedule = schedule.map((c) => (c.id === updated.id ? updated : c));
    onUpdateSchedule(newSchedule);
    setEditModalSlot(null);
    setLastActionMessage(`Updated venue/faculty for ${updated.subjectName}.`);
  };

  const getSlot = (day: DayOfWeek, periodNum: number) => {
    return schedule.find(
      (c) => c.cohort === cohort && c.day === day && c.periodNumber === periodNum
    );
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
              <span>MANUAL AUDIT &amp; INTERACTIVE MATRIX EDITOR</span>
              <span>•</span>
              <span className="text-[#565e74]">{cohort}</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Timetable Editor &amp; Conflict Resolver
            </h1>
            <p className="text-[13px] text-[#565e74] mt-0.5">
              Click two slots to swap their schedules. Real-time constraint validator updates immediately to prevent room and faculty double-booking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleUndo}
              disabled={historyStack.length === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-[13px] font-semibold transition-colors ${
                historyStack.length > 0
                  ? 'bg-white border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">undo</span>
              <span>Undo Swap ({historyStack.length})</span>
            </button>

            <button
              onClick={() => onSaveAsDraft(`Schedule v4.3 [Edited ${cohort}]`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-[13px] font-semibold shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">save</span>
              <span>Save As New Version</span>
            </button>
          </div>
        </div>

        {/* Action Status Banner */}
        {lastActionMessage && (
          <div
            className={`mt-4 p-3 rounded-lg border flex items-center justify-between text-[12px] font-medium ${
              evalResult.hardViolations > 0
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-[#eff4ff] border-[#dce9ff] text-[#3525cd]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {evalResult.hardViolations > 0 ? 'warning' : 'info'}
              </span>
              <span>{lastActionMessage}</span>
            </div>
            {selectedSlotId && (
              <button
                onClick={() => {
                  setSelectedSlotId(null);
                  setLastActionMessage(null);
                }}
                className="font-bold underline cursor-pointer"
              >
                Cancel Selection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Editor Grid */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#565e74] text-[12px] uppercase font-bold border-b border-[#e2e8f0]">
                <th className="py-3 px-4 w-36">Timeline</th>
                {DAYS.map((day) => (
                  <th key={day} className="py-3 px-3 text-center border-l border-[#e2e8f0]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {PERIOD_SLOTS.map((slotDef) => (
                <React.Fragment key={slotDef.periodNumber}>
                {slotDef.periodNumber === 4 && (
                  <tr className="bg-[#eff4ff]/80 border-y border-[#dce9ff]">
                    <td className="py-2 px-4 font-mono text-[11px] font-bold text-[#3525cd]">Compulsory Break</td>
                    <td colSpan={5} className="py-2 px-3 text-center text-[11px] font-bold text-[#3525cd]">11:00–11:30 AM · No lectures scheduled</td>
                  </tr>
                )}
                <tr className="hover:bg-[#fcfdff]">
                  <td className="py-3 px-4 bg-[#f8f9ff]/70 border-r border-[#e2e8f0]">
                    <span className="font-bold text-[13px] text-[#0b1c30] block">
                      {slotDef.label}
                    </span>
                    <span className="text-[11px] font-mono text-[#565e74]">
                      {slotDef.displayTime}
                    </span>
                  </td>

                  {DAYS.map((day) => {
                    const item = getSlot(day, slotDef.periodNumber);
                    if (!item) {
                      return (
                        <td key={day} className="p-2 border-l border-[#e2e8f0] text-center">
                          <span className="text-[11px] text-gray-400">Empty</span>
                        </td>
                      );
                    }

                    const isSelected = selectedSlotId === item.id;

                    return (
                      <td key={day} className="p-2 border-l border-[#e2e8f0] align-top">
                        <div
                          onClick={() => handleSlotClick(item)}
                          className={`rounded-lg p-3 transition-all cursor-pointer border relative select-none ${
                            isSelected
                              ? 'ring-2 ring-[#3525cd] bg-[#eff4ff] border-[#3525cd] shadow-md scale-[1.02]'
                              : 'bg-white hover:bg-[#eff4ff] border-[#e2e8f0] shadow-2xs'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute -top-2 -right-2 bg-[#3525cd] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                              SOURCE
                            </span>
                          )}

                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[12px] text-[#0b1c30]">
                              {item.subjectName}
                            </span>
                            <span className="font-mono text-[10px] text-[#3525cd] font-bold bg-[#eff4ff] px-1.5 py-0.2 rounded">
                              {item.type}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#565e74] truncate mb-1">
                            {item.facultyName}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#f1f5f9]">
                            <span className="font-mono font-bold text-[#0b1c30]">{item.roomCode}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditModalSlot(item);
                              }}
                              className="text-[#3525cd] hover:underline font-bold"
                            >
                              Edit
                            </button>
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

      {/* Edit Single Slot Modal */}
      {editModalSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Edit Slot Assignment
              </h3>
              <button
                onClick={() => setEditModalSlot(null)}
                className="text-[#777587] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-[13px]">
              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  disabled
                  value={`${editModalSlot.subjectCode} — ${editModalSlot.subjectName}`}
                  className="w-full bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#565e74] font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  Assigned Faculty
                </label>
                <select
                  value={editModalSlot.facultyId}
                  onChange={(e) => {
                    const fac = FACULTY_MEMBERS.find((f) => f.id === e.target.value);
                    if (fac) {
                      setEditModalSlot({
                        ...editModalSlot,
                        facultyId: fac.id,
                        facultyName: fac.name,
                        facultyCode: fac.code,
                      });
                    }
                  }}
                  className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#0b1c30] font-medium"
                >
                  {FACULTY_MEMBERS.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  Allocated Room
                </label>
                <select
                  value={editModalSlot.roomId}
                  onChange={(e) => {
                    const rm = ROOMS.find((r) => r.id === e.target.value);
                    if (rm) {
                      setEditModalSlot({
                        ...editModalSlot,
                        roomId: rm.id,
                        roomCode: rm.code,
                      });
                    }
                  }}
                  className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#0b1c30] font-medium"
                >
                  {ROOMS.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.code} — {rm.name} (Cap: {rm.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  Topic / Unit
                </label>
                <input
                  type="text"
                  value={editModalSlot.topicOrUnit || ''}
                  onChange={(e) =>
                    setEditModalSlot({ ...editModalSlot, topicOrUnit: e.target.value })
                  }
                  className="w-full bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#0b1c30] font-medium"
                  placeholder="e.g. Unit 3, Final Accounts"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] flex justify-end gap-2">
              <button
                onClick={() => setEditModalSlot(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#e2e8f0] text-[13px] font-semibold text-[#565e74] hover:bg-[#f8f9ff]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveModal(editModalSlot)}
                className="px-4 py-1.5 rounded-lg bg-[#3525cd] text-white text-[13px] font-semibold hover:bg-[#4f46e5]"
              >
                Save Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
