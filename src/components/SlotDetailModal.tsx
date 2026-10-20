import React from 'react';
import { ScheduledClass } from '../types/schedule';
import { FACULTY_MEMBERS, ROOMS, SUBJECTS } from '../data/mockData';

interface SlotDetailModalProps {
  slot: ScheduledClass | null;
  onClose: () => void;
  onNavigateToEditor?: () => void;
}

export const SlotDetailModal: React.FC<SlotDetailModalProps> = ({
  slot,
  onClose,
  onNavigateToEditor,
}) => {
  if (!slot) return null;

  const subject = SUBJECTS.find((s) => s.id === slot.subjectId);
  const faculty = FACULTY_MEMBERS.find((f) => f.id === slot.facultyId);
  const room = ROOMS.find((r) => r.code === slot.roomCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#e2e8f0] relative">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#3525cd] font-bold border border-[#dce9ff]">
                {slot.subjectCode}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {slot.type} Session
              </span>
              <span className="text-[11px] text-[#565e74] font-medium">
                {slot.cohort}
              </span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30] mt-1.5 tracking-tight">
              {slot.subjectName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#777587] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Details */}
        <div className="py-4 space-y-4 text-[13px]">
          {/* Day & Period Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#565e74] block">
                Scheduled Time
              </span>
              <span className="font-bold text-[#0b1c30]">
                {slot.day} • Period {slot.periodNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#565e74] block">
                Topic / Unit Focus
              </span>
              <span className="font-semibold text-[#3525cd]">
                {slot.topicOrUnit || 'Regular Instructional Module'}
              </span>
            </div>
          </div>

          {/* Faculty Card */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#777587] block mb-2">
              Assigned Instructor
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {slot.facultyCode}
              </div>
              <div>
                <div className="font-bold text-[#0b1c30] text-[14px]">
                  {slot.facultyName}
                </div>
                <div className="text-[11px] text-[#565e74]">
                  {faculty?.department || 'Department of Commerce'} • Max 4 periods/day
                </div>
                <div className="text-[11px] text-[#3525cd] mt-0.5 font-mono">
                  {faculty?.email || 'faculty@evoschedule.edu'}
                </div>
              </div>
            </div>
          </div>

          {/* Venue Card */}
          <div className="p-3 bg-white rounded-lg border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#777587] block mb-2">
              Venue &amp; Infrastructure
            </span>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-[14px] text-[#0b1c30] font-mono">
                  {slot.roomCode}
                </div>
                <div className="text-[11px] text-[#565e74]">
                  {room?.name || 'Standard Lecture Theatre'} • {room?.building || 'Commerce Block'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Capacity: {room?.capacity || 75} Seats
                </span>
                <span className="text-[10px] text-[#777587] block mt-1">
                  Projector &amp; Audio: Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
          {onNavigateToEditor && (
            <button
              onClick={() => {
                onClose();
                onNavigateToEditor();
              }}
              className="text-[#3525cd] hover:underline text-[12px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Swap in Timetable Editor</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-lg bg-[#3525cd] text-white text-[13px] font-semibold hover:bg-[#4f46e5] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
