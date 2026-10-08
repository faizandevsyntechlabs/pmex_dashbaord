import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileCheck,
  FolderArchive,
  ShieldCheck,
  FileBarChart2,
  Clock,
  ArrowRight,
  Search,
  ChevronRight,
} from 'lucide-react';
import { RecentActivityRecord } from '../types/dashboard';
import avatarAdmin from '../assets/images/avatar_super_admin_1790968185971.jpg';

interface RecentActivityProps {
  activities: RecentActivityRecord[];
  onSelectActivity: (activity: RecentActivityRecord) => void;
  onNavigateToHistory: () => void;
  onNavigateToModule: (moduleName: string) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onSelectActivity,
  onNavigateToHistory,
  onNavigateToModule,
}) => {
  const [filterModule, setFilterModule] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredActivities = activities.filter((act) => {
    const matchesModule =
      filterModule === 'all' ||
      act.module.toLowerCase().includes(filterModule.toLowerCase());
    const matchesSearch =
      searchFilter === '' ||
      act.user.toLowerCase().includes(searchFilter.toLowerCase()) ||
      act.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
      act.resourceName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case 'Spreadsheets':
        return <FileSpreadsheet className="h-3.5 w-3.5 text-[#3F9A4B]" />;
      case 'Eligibility':
        return <FileCheck className="h-3.5 w-3.5 text-[#3F9A4B]" />;
      case 'File Manager':
        return <FolderArchive className="h-3.5 w-3.5 text-[#3F9A4B]" />;
      case 'Admin Panel':
        return <ShieldCheck className="h-3.5 w-3.5 text-[#3F9A4B]" />;
      case 'Reporting':
      default:
        return <FileBarChart2 className="h-3.5 w-3.5 text-[#3F9A4B]" />;
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#3F9A20] uppercase block">
            Audit Trail
          </span>
          <h3 className="text-base font-extrabold text-[#2E4A25] tracking-tight">
            History & Recent Activity
          </h3>
        </div>

        <button
          type="button"
          onClick={onNavigateToHistory}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F9A4B] hover:text-[#2E4A25] transition-colors"
        >
          <span>Full History</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Card Surface */}
      <div className="pmex-floating-card p-5 flex-1 flex flex-col justify-between">
        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#EDEAE0]">
          <div className="flex items-center gap-1 bg-[#EEF0E8] p-1 rounded-xl">
            {[
              { id: 'all', label: 'All' },
              { id: 'spreadsheets', label: 'Spreadsheets' },
              { id: 'eligibility', label: 'Eligibility' },
              { id: 'file', label: 'Files' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterModule(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  filterModule === tab.id
                    ? 'bg-[#3F9A4B] text-white shadow-2xs'
                    : 'text-[#676767] hover:text-[#2E4A25]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search activity..."
              className="w-full rounded-xl border border-[#D8DCE3] bg-[#F8FBF0] py-1.5 pl-7 pr-2.5 text-xs text-[#505050] placeholder:text-[#959085] focus:border-[#3F9A4B] focus:bg-white focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#959085] pointer-events-none" />
          </div>
        </div>

        {/* Floating Activity Rows (Inspired by Screenshot 2's History list) */}
        <div className="my-3 max-h-[270px] overflow-y-auto space-y-2.5 pr-1">
          {filteredActivities.length === 0 ? (
            <div className="py-10 text-center rounded-2xl bg-[#F8FBF0] border border-[#EDEAE0]">
              <p className="text-xs font-medium text-[#676767]">
                No activity records match the selected filter.
              </p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[#EDEAE0] bg-[#F8FBF0]/50 px-3.5 py-2.5 hover:bg-white hover:border-[#AAD39C] hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar / Initials */}
                  {act.user === 'Super Admin' ? (
                    <img
                      src={avatarAdmin}
                      alt={act.user}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 shrink-0 rounded-full object-cover border border-[#AAD39C]/60"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0E8] text-xs font-bold text-[#2E4A25] border border-[#E0E0DA]">
                      {getInitials(act.user)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2E4A25] truncate">
                        {act.user}
                      </span>
                      <span className="text-[#959085]">·</span>
                      <span className="text-xs font-medium text-[#505050] truncate">
                        {act.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#676767]">
                      {getModuleIcon(act.module)}
                      <span className="truncate font-medium text-[#2A3828]">
                        {act.resourceName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamp & Arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium text-[#959085] tabular-nums">
                    {act.timeAgo}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#959085] group-hover:text-[#3F9A4B] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-[#EDEAE0] flex items-center justify-between text-[11px]">
          <span className="text-[#959085]">
            Showing {filteredActivities.length} recent events
          </span>
          <button
            type="button"
            onClick={() => onNavigateToModule('All Spreadsheets')}
            className="font-semibold text-[#3F9A4B] hover:text-[#2E4A25] transition-colors"
          >
            Open All Spreadsheets →
          </button>
        </div>
      </div>
    </div>
  );
};
