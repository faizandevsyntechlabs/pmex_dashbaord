import React, { useState } from 'react';
import {
  StatMetric,
  ActivityDataPoint,
  EligibilityStatusData,
  RecentActivityRecord,
  TimeRange,
} from '../types/dashboard';
import { StatCard } from './StatCard';
import { ActivityChart } from './ActivityChart';
import { EligibilityOverview } from './EligibilityOverview';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { PMExModuleId } from './DashboardSidebar';
import { RefreshCw, ChevronDown } from 'lucide-react';

interface DashboardProps {
  stats: StatMetric[];
  activity7d: ActivityDataPoint[];
  activity30d: ActivityDataPoint[];
  activity90d: ActivityDataPoint[];
  activeRange: TimeRange;
  onChangeRange: (range: TimeRange) => void;
  eligibilityBreakdown: EligibilityStatusData[];
  recentActivities: RecentActivityRecord[];
  onSelectActivity: (activity: RecentActivityRecord) => void;
  onNavigateToModule: (moduleId: PMExModuleId, subItem?: string) => void;
  onCreateSpreadsheet: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  activity7d,
  activity30d,
  activity90d,
  activeRange,
  onChangeRange,
  eligibilityBreakdown,
  recentActivities,
  onSelectActivity,
  onNavigateToModule,
  onCreateSpreadsheet,
  onRefreshData,
  isRefreshing = false,
}) => {
  const [contextFilter, setContextFilter] = useState<'All Modules' | 'Spreadsheets & Files' | 'Eligibility & Compliance'>('All Modules');

  return (
    <div className="space-y-8">
      {/* 1. TOP DASHBOARD TITLE & CONTEXT SWITCHER (Inspired by Screenshot 2's "Dashboard ↻ / Financial ⌄") */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            {/* STRICT RULE: #E85D3F used ONLY for the emphasized span inside main H1 */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E4A25] tracking-tight">
              PMEx <span className="text-[#E85D3F]">Dashboard</span>
            </h1>

            {onRefreshData && (
              <button
                type="button"
                onClick={onRefreshData}
                disabled={isRefreshing}
                aria-label="Refresh dashboard data"
                title="Refresh portal metrics"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EDEAE0] bg-white text-[#2E4A25] hover:border-[#3F9A4B] hover:text-[#3F9A4B] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#3F9A4B]' : ''}`} />
              </button>
            )}
          </div>

          {/* Subtitle / Context Selector */}
          <div className="mt-1.5 flex items-center gap-3">
            <div className="relative inline-flex items-center">
              <select
                value={contextFilter}
                onChange={(e) => setContextFilter(e.target.value as typeof contextFilter)}
                aria-label="Select dashboard view context"
                className="appearance-none bg-transparent pr-5 text-xs font-semibold text-[#676767] hover:text-[#2E4A25] cursor-pointer focus:outline-none"
              >
                <option value="All Modules">Operations & Eligibility Overview</option>
                <option value="Spreadsheets & Files">Spreadsheets & Repository Focus</option>
                <option value="Eligibility & Compliance">Compliance & Audit Focus</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-[#959085]" />
            </div>

            <span className="text-[#E0E0DA]">·</span>
            <span className="text-xs text-[#959085]">
              Welcome back, Super Admin
            </span>
          </div>
        </div>

        {/* Right: Quiet Workspace Sync Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#EEF0E8] px-3 py-1.5 text-xs font-medium text-[#2A3828] border border-[#E0E0DA]">
            <span className="h-2 w-2 rounded-full bg-[#3F9A4B]" />
            <span>Univer & Laravel Connected</span>
          </div>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS (Inspired by Screenshot 2's top floating cards with radial rings) */}
      <section aria-label="Portal Summary Metrics" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-bold tracking-[0.12em] text-[#3F9A20] uppercase block">
              Key Indicators
            </span>
            <h2 className="text-base font-extrabold text-[#2E4A25] tracking-tight">
              Portal Summary
            </h2>
          </div>
          <span className="text-xs text-[#959085]">
            Click any card to open module
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              onClick={(mod) => onNavigateToModule(mod as PMExModuleId)}
            />
          ))}
        </div>
      </section>

      {/* 3. ELIGIBILITY OVERVIEW (ARCH GAUGE + STATUS CARDS) & RECENT ACTIVITY ROW */}
      <section aria-label="Eligibility Status and Recent Activity">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <EligibilityOverview
            data={eligibilityBreakdown}
            onNavigateToEligibility={(status) => onNavigateToModule('Eligibility', status)}
          />

          <RecentActivity
            activities={recentActivities}
            onSelectActivity={onSelectActivity}
            onNavigateToHistory={() => onNavigateToModule('History')}
            onNavigateToModule={(mod) => onNavigateToModule(mod as PMExModuleId)}
          />
        </div>
      </section>

      {/* 4. ACTIVITY OVERVIEW SPLINE CHART & STACKED METRICS */}
      <section aria-label="Activity Analytics">
        <ActivityChart
          data7d={activity7d}
          data30d={activity30d}
          data90d={activity90d}
          activeRange={activeRange}
          onChangeRange={onChangeRange}
          onDrilldown={(mod) => onNavigateToModule(mod as PMExModuleId)}
        />
      </section>

      {/* 5. QUICK ACTIONS */}
      <section aria-label="Quick Operations">
        <QuickActions
          onCreateSpreadsheet={onCreateSpreadsheet}
          onNavigateToModule={onNavigateToModule}
        />
      </section>
    </div>
  );
};
