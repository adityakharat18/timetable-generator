import React, { useState } from 'react';
import { Faculty, Room, Subject } from '../types/schedule';
import { FACULTY_MEMBERS, ROOMS, SUBJECTS } from '../data/mockData';

export const AcademicDataView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faculty' | 'subjects' | 'rooms'>('faculty');
  const [facultyList, setFacultyList] = useState<Faculty[]>(FACULTY_MEMBERS);
  const [subjectList, setSubjectList] = useState<Subject[]>(SUBJECTS);
  const [roomList, setRoomList] = useState<Room[]>(ROOMS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubjects = subjectList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRooms = roomList.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e2e8f0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#3525cd] uppercase tracking-wider mb-1">
              <span>ACADEMIC REGISTRY &amp; ASSETS</span>
              <span>•</span>
              <span className="text-[#565e74]">FACULTY OF COMMERCE</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl lg:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Subjects, Faculty &amp; Venues Catalog
            </h1>
            <p className="text-[13px] text-[#565e74] mt-0.5">
              Manage instructional staff, assigned workload quotas, designated lecture halls, and curriculum subject credit mappings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-[13px] text-[#0b1c30] placeholder-gray-400 focus:outline-[#3525cd]"
            />
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#f1f5f9]">
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'faculty'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
            }`}
          >
            Instructors &amp; Faculty ({facultyList.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'subjects'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
            }`}
          >
            Curriculum Subjects ({subjectList.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'rooms'
                ? 'bg-[#3525cd] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
            }`}
          >
            Lecture Halls &amp; Labs ({roomList.length})
          </button>
        </div>
      </div>

      {/* Tab Content: Faculty */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {fac.code}
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                    {fac.name}
                  </h3>
                  <span className="text-[12px] text-[#565e74] block">{fac.title}</span>
                  <span className="text-[11px] font-mono text-[#3525cd]">{fac.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f1f5f9] grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[#777587] block text-[10px] uppercase font-bold">Department</span>
                  <span className="font-semibold text-[#0b1c30]">{fac.department}</span>
                </div>
                <div>
                  <span className="text-[#777587] block text-[10px] uppercase font-bold">Max Daily Cap</span>
                  <span className="font-mono font-bold text-[#0b1c30]">{fac.maxDailyPeriods} Periods/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Subjects */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              style={{ borderTop: `4px solid ${sub.primaryColor}` }}
              className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-[12px] text-[#3525cd] px-2 py-0.5 rounded bg-[#eff4ff]">
                  {sub.code}
                </span>
                <span className="text-[11px] font-bold text-[#0b1c30]">
                  {sub.hoursPerWeek} hrs / week
                </span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                {sub.name}
              </h3>
              <p className="text-[12px] text-[#565e74] mt-1">{sub.department}</p>
              <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-[11px]">
                <span className="text-[#777587]">Category:</span>
                <span className="font-semibold text-[#0b1c30]">{sub.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Rooms */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((rm) => (
            <div
              key={rm.id}
              className="bg-white rounded-xl p-5 shadow-xs border border-[#e2e8f0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-[14px] text-[#3525cd]">
                  {rm.code}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Cap: {rm.capacity} Seats
                </span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                {rm.name}
              </h3>
              <p className="text-[12px] text-[#565e74] mt-1">
                {rm.building} • {rm.floor}
              </p>
              <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-[11px]">
                <span className="text-[#777587]">Venue Type:</span>
                <span className="font-semibold text-[#0b1c30]">{rm.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
