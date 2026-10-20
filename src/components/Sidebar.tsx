import React from 'react';

export type NavigationPath =
  | 'overview'
  | 'generator'
  | 'timetable'
  | 'editor'
  | 'ga-design'
  | 'visualizer'
  | 'comparison'
  | 'academic-data'
  | 'saved';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  isEngineRunning?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isEngineRunning = false,
}) => {
  const navItems = [
    {
      group: 'CORE ARCHITECTURE',
      items: [
        { id: 'overview' as NavigationPath, label: 'Overview', icon: 'dashboard' },
        { id: 'generator' as NavigationPath, label: 'Timetable Generator', icon: 'auto_mode' },
        { id: 'timetable' as NavigationPath, label: 'Weekly Timetable', icon: 'calendar_view_week' },
        { id: 'editor' as NavigationPath, label: 'Timetable Editor', icon: 'edit_calendar' },
      ],
    },
    {
      group: 'EVOLUTIONARY ENGINE',
      items: [
        { id: 'ga-design' as NavigationPath, label: 'GA Design', icon: 'schema' },
        { id: 'visualizer' as NavigationPath, label: 'Algorithm Visualizer', icon: 'insights' },
        { id: 'comparison' as NavigationPath, label: 'Analysis & Comparison', icon: 'balance' },
      ],
    },
    {
      group: 'ACADEMIC CATALOG',
      items: [
        { id: 'academic-data' as NavigationPath, label: 'Subjects & Faculty', icon: 'groups' },
        { id: 'saved' as NavigationPath, label: 'Saved Timetables', icon: 'folder_special' },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#e2e8f0] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[#f1f5f9] bg-white">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#3525cd] to-[#4f46e5] flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[17px] text-[#3525cd] tracking-tight truncate leading-tight">
              EvoSchedule
            </span>
            <span className="text-[11px] font-medium text-[#565e74] truncate tracking-normal">
              GA Academic Optimizer
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {navItems.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2 pb-1">
                <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                  {section.group}
                </span>
              </div>
              {section.items.map((item) => {
                const isActive = currentPath === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-all text-left text-[13px] font-semibold ${
                      isActive
                        ? 'bg-[#4f46e5] text-white shadow-sm shadow-indigo-200'
                        : 'text-[#464555] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                    {item.id === 'generator' && isEngineRunning && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Engine Status Footer Card */}
      <div className="p-3 bg-[#eff4ff] m-3 rounded-lg border border-[#dce9ff]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            GA Engine Status
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#3525cd] font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isEngineRunning ? 'bg-emerald-500 animate-pulse' : 'bg-[#3525cd]'
              }`}
            />
            {isEngineRunning ? 'Solving...' : 'v3.4 Feasible'}
          </span>
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-[#464555]">
          <span>Max Generations</span>
          <span className="font-mono font-semibold text-[#0b1c30]">1,500</span>
        </div>
      </div>
    </aside>
  );
};
