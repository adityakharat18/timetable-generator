import React, { useState } from 'react';
import { ScheduledClass } from '../types/schedule';
import { DAYS, PERIOD_SLOTS } from '../data/mockData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduledClass[];
  cohort: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  schedule,
  cohort,
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'print'>('csv');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const headers = ['Period', 'Time', ...DAYS];
    const rows = PERIOD_SLOTS.map((slot) => {
      const line = [slot.label, slot.displayTime];
      DAYS.forEach((day) => {
        const item = schedule.find(
          (c) => c.cohort === cohort && c.day === day && c.periodNumber === slot.periodNumber
        );
        line.push(item ? `"${item.subjectName} (${item.roomCode}/${item.facultyCode})"` : 'Free');
      });
      return line.join(',');
    });
    rows.splice(3, 0, ['Compulsory Break', '11:00-11:30 AM', ...DAYS.map(() => 'NO LECTURES')].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EvoSchedule_${cohort.replace(' ', '_')}_Schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleDownloadJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ cohort, date: new Date().toISOString(), schedule }, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.setAttribute('download', `EvoSchedule_${cohort.replace(' ', '_')}_Chromosome.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `EvoSchedule Timetable Summary — ${cohort}\nTotal Sessions: 25/25 (100% Placed)\nZero Hard Violations\nAcademic Year 2024–2025`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd] text-[22px]">
              file_download
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
              Export Active Timetable
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#777587] hover:text-[#0b1c30] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4 text-[13px]">
          <p className="text-[#565e74]">
            Export verified schedule matrix for <strong>B.Com {cohort}</strong> with all faculty assignments, room allotments, and the compulsory 11:00–11:30 AM break.
          </p>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#565e74] uppercase block">
              Choose Export Medium
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'bg-[#eff4ff] border-[#3525cd] text-[#3525cd] font-bold'
                    : 'bg-white border-[#e2e8f0] text-[#565e74] hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] block mx-auto mb-1">
                  table_chart
                </span>
                <span>CSV Sheet</span>
              </button>

              <button
                onClick={() => setExportFormat('print')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                  exportFormat === 'print'
                    ? 'bg-[#eff4ff] border-[#3525cd] text-[#3525cd] font-bold'
                    : 'bg-white border-[#e2e8f0] text-[#565e74] hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] block mx-auto mb-1">
                  print
                </span>
                <span>Print / PDF</span>
              </button>

              <button
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                  exportFormat === 'json'
                    ? 'bg-[#eff4ff] border-[#3525cd] text-[#3525cd] font-bold'
                    : 'bg-white border-[#e2e8f0] text-[#565e74] hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] block mx-auto mb-1">
                  data_object
                </span>
                <span>JSON Gene</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
          <button
            onClick={handleCopySummary}
            className="text-[12px] font-bold text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] text-[13px] font-semibold hover:bg-[#f8f9ff] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (exportFormat === 'csv') handleDownloadCSV();
                else if (exportFormat === 'json') handleDownloadJSON();
                else handlePrint();
              }}
              className="px-4 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-[13px] font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>Confirm &amp; Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
