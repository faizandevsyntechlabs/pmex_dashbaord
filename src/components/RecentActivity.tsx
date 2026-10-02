import React, { useState } from 'react';
import {
  History,
  FileSpreadsheet,
  FileCheck,
  FolderArchive,
  ShieldCheck,
  FileBarChart2,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
} from 'lucide-react';
import { RecentActivityRecord, ActivityModule } from '../types/dashboard';

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
        return <FileSpreadsheet className="h-4 w-4 text-[#3F9A4B]" />;
      case 'Eligibility':
        return <FileCheck className="h-4 w-4 text-[#3F9A4B]" />;
      case 'File Manager':
        return <FolderArchive className="h-4 w-4 text-[#3F9A4B]" />;
      case 'Admin Panel':
        return <ShieldCheck className="h-4 w-4 text-[#3F9A4B]" />;
      case 'Reporting':
      default:
        return <FileBarChart2 className="h-4 w-4 text-[#3F9A4B]" />;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#E0E0DA] bg-white p-5 lg:col-span-6 shadow-xs">
      {/* Header with Title and Filter Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E0DA]/70">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8FBF0] text-[#3F9A4B] border border-[#AAD39C]/40">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2E4A25]">Recent Activity</h3>
              <p className="text-[11px] text-[#505050]">
                User audit log and system events
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToHistory}
            className="flex items-center gap-1 text-xs font-semibold text-[#3F9A4B] hover:text-[#2E4A25] transition-colors self-start sm:self-auto"
          >
            <span>Full Audit Log</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mt-3 flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1 bg-[#F8FBF0] p-1 rounded-xl border border-[#E0E0DA]">
            {[
              { id: 'all', label: 'All' },
              { id: 'spreadsheets', label: 'Spreadsheets' },
              { id: 'eligibility', label: 'Eligibility' },
              { id: 'files', label: 'Files' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterModule(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  filterModule === tab.id
                    ? 'bg-[#3F9A4B] text-white shadow-xs'
                    : 'text-[#505050] hover:text-[#2E4A25]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[130px] hidden sm:block">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter logs..."
              className="w-full rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] py-1 pl-7 pr-2 text-xs text-[#505050] placeholder:text-[#505050]/50 focus:border-[#3F9A4B] focus:bg-white focus:outline-none"
            />
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-[#505050]/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#505050]">
            No activity records match the current filter.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => onSelectActivity(act)}
              className="group flex items-start justify-between gap-3 p-3 rounded-2xl border border-[#E0E0DA]/70 bg-white hover:border-[#3F9A4B] hover:bg-[#F8FBF0] transition-all cursor-pointer text-left"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Module Icon Container */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F8FBF0] border border-[#E0E0DA] group-hover:bg-white group-hover:border-[#3F9A4B] transition-colors">
                  {getModuleIcon(act.module)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2E4A25] truncate">
                      {act.user}
                    </span>
                    <span className="text-[10px] text-[#505050]/70">·</span>
                    <span className="text-[11px] text-[#505050] truncate font-medium">
                      {act.action}
                    </span>
                  </div>

                  {/* Resource name */}
                  <p className="text-xs font-semibold text-[#2E4A25] truncate mt-0.5 group-hover:text-[#3F9A4B] transition-colors">
                    {act.resourceName}
                  </p>

                  {/* Tag / Role line */}
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-[#505050]">
                    <span className="font-medium text-[#2E4A25] bg-[#F8FBF0] px-1.5 py-0.5 rounded border border-[#E0E0DA]">
                      {act.module}
                    </span>
                    {act.metadata?.version && (
                      <span className="font-mono text-[#505050]/80">
                        {act.metadata.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Time and Action */}
              <div className="flex flex-col items-end shrink-0 text-right">
                <span className="flex items-center gap-1 text-[11px] font-medium text-[#505050] tabular-nums">
                  <Clock className="h-3 w-3 text-[#505050]/60" />
                  {act.timeAgo}
                </span>

                <span className="mt-2 text-[11px] font-semibold text-[#3F9A4B] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Details
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#E0E0DA]/70 flex items-center justify-between text-xs">
        <span className="text-[#505050] text-[11px]">
          Showing {filteredActivities.length} recent audit logs
        </span>
        <button
          type="button"
          onClick={() => onNavigateToModule('All Spreadsheets')}
          className="text-[#3F9A4B] hover:text-[#2E4A25] font-semibold text-xs transition-colors"
        >
          Open Spreadsheets Directory →
        </button>
      </div>
    </div>
  );
};
