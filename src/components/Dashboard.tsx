import React from 'react';
import { StatMetric, ActivityDataPoint, EligibilityStatusData, RecentActivityRecord, TimeRange } from '../types/dashboard';
import { StatCard } from './StatCard';
import { WelcomeBanner } from './WelcomeBanner';
import { ActivityChart } from './ActivityChart';
import { EligibilityOverview } from './EligibilityOverview';
import { RecentActivity } from './RecentActivity';
import { QuickActions } from './QuickActions';
import { PMExModuleId } from './DashboardSidebar';
import { Sparkles, RefreshCw } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* 1. TOP TITLE BAR WITH H1 ORANGE EMPHASIS SPAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          {/* H1 strictly adheres to rule: Orange #E85D3F used ONLY for H1 headline emphasis span */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E4A25] tracking-tight">
            PMEx Operations <span className="text-[#E85D3F]">Dashboard</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#505050]">
            Real-time analytics for PMEx spreadsheets, eligibility verification, and system audits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefreshData && (
            <button
              type="button"
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E0E0DA] bg-white px-3 py-2 text-xs font-semibold text-[#505050] hover:text-[#2E4A25] hover:border-[#3F9A4B] transition-colors disabled:opacity-50"
              title="Refresh portal statistics"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#3F9A4B] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 rounded-xl bg-[#F8FBF0] px-3 py-2 text-xs font-medium text-[#2E4A25] border border-[#E0E0DA]">
            <span className="h-2 w-2 rounded-full bg-[#3F9A4B] animate-pulse" />
            <span className="tabular-nums">Live Engine Active</span>
          </div>
        </div>
      </div>

      {/* 2. BENTO WELCOME BANNER & HEALTH GAUGES (Design inspiration from Vision UI) */}
      <WelcomeBanner
        userName="Super Admin"
        onExploreAudit={() => onNavigateToModule('History')}
        onQuickVerify={() => onNavigateToModule('Eligibility')}
      />

      {/* 3. KPI / SUMMARY CARDS ROW */}
      <section aria-label="Key Performance Indicators">
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

      {/* 4. ANALYTICS & ACTIVITY OVERVIEW SECTION */}
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

      {/* 5. ELIGIBILITY BREAKDOWN & RECENT ACTIVITY DUAL ROW */}
      <section aria-label="Eligibility & Audit Records">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Eligibility status breakdown (6 cols) */}
          <EligibilityOverview
            data={eligibilityBreakdown}
            onNavigateToEligibility={(status) => onNavigateToModule('Eligibility', status)}
          />

          {/* Recent activity audit trail (6 cols) */}
          <RecentActivity
            activities={recentActivities}
            onSelectActivity={onSelectActivity}
            onNavigateToHistory={() => onNavigateToModule('History')}
            onNavigateToModule={(mod) => onNavigateToModule(mod as PMExModuleId)}
          />
        </div>
      </section>

      {/* 6. QUICK ACTIONS GRID */}
      <section aria-label="Quick Operations">
        <QuickActions
          onCreateSpreadsheet={onCreateSpreadsheet}
          onNavigateToModule={onNavigateToModule}
        />
      </section>
    </div>
  );
};
