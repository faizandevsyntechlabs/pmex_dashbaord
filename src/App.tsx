import React, { useState, useCallback } from 'react';
import { PMExModuleId, DashboardSidebar } from './components/DashboardSidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { Dashboard } from './components/Dashboard';
import { ModuleViews } from './components/ModuleViews';
import { CreateSpreadsheetModal } from './components/CreateSpreadsheetModal';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import {
  INITIAL_STATS,
  ACTIVITY_DATA_7D,
  ACTIVITY_DATA_30D,
  ACTIVITY_DATA_90D,
  ELIGIBILITY_BREAKDOWN,
  INITIAL_RECENT_ACTIVITIES,
  INITIAL_SPREADSHEETS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import {
  TimeRange,
  RecentActivityRecord,
  SpreadsheetRecord,
  NotificationItem,
} from './types/dashboard';

export default function App() {
  // Navigation & UI layout state
  const [activeModule, setActiveModule] = useState<PMExModuleId>('Dashboard');
  const [activeSubItem, setActiveSubItem] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [stats, setStats] = useState(INITIAL_STATS);
  const [recentActivities, setRecentActivities] = useState<RecentActivityRecord[]>(INITIAL_RECENT_ACTIVITIES);
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetRecord[]>(INITIAL_SPREADSHEETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<RecentActivityRecord | null>(null);

  // Module navigation callback
  const handleSelectModule = useCallback((moduleId: PMExModuleId, subItem?: string) => {
    setActiveModule(moduleId);
    setActiveSubItem(subItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Create spreadsheet handler
  const handleCreateSpreadsheet = (
    newSheet: Omit<SpreadsheetRecord, 'id' | 'lastUpdated' | 'updatedBy'>
  ) => {
    const createdRecord: SpreadsheetRecord = {
      ...newSheet,
      id: `sheet-${Date.now()}`,
      lastUpdated: 'Just now',
      updatedBy: 'Super Admin',
    };

    setSpreadsheets((prev) => [createdRecord, ...prev]);

    // Log recent activity for the created sheet
    const newActivity: RecentActivityRecord = {
      id: `act-${Date.now()}`,
      user: 'Super Admin',
      userRole: 'System Administrator',
      action: 'Created spreadsheet',
      resourceName: createdRecord.name,
      module: 'Spreadsheets',
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleString(),
      status: 'updated',
      metadata: {
        department: createdRecord.department,
        initialSize: createdRecord.fileSize,
      },
    };
    setRecentActivities((prev) => [newActivity, ...prev]);

    // Update stat counter
    setStats((prev) =>
      prev.map((s) => {
        if (s.id === 'total-spreadsheets') {
          const newVal = Number(s.value) + 1;
          return {
            ...s,
            value: newVal,
            formattedValue: String(newVal),
            badgeNote: '+1 just created',
          };
        }
        return s;
      })
    );
  };

  // Notification handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Sync data animation/callback
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FBF0] text-[#505050]">
      {/* 1. SIDEBAR (Keeps exact PMEx modules & branding) */}
      <DashboardSidebar
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. MAIN WORKSPACE VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateSpreadsheet={() => setIsCreateModalOpen(true)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          userName="Super Admin"
          userRole="System Administrator"
          onNavigateToModule={(mod) => handleSelectModule(mod as PMExModuleId)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeModule === 'Dashboard' ? (
            <Dashboard
              stats={stats}
              activity7d={ACTIVITY_DATA_7D}
              activity30d={ACTIVITY_DATA_30D}
              activity90d={ACTIVITY_DATA_90D}
              activeRange={timeRange}
              onChangeRange={setTimeRange}
              eligibilityBreakdown={ELIGIBILITY_BREAKDOWN}
              recentActivities={recentActivities}
              onSelectActivity={setSelectedActivity}
              onNavigateToModule={handleSelectModule}
              onCreateSpreadsheet={() => setIsCreateModalOpen(true)}
              onRefreshData={handleRefreshData}
              isRefreshing={isRefreshing}
            />
          ) : (
            <ModuleViews
              activeModule={activeModule}
              subItem={activeSubItem}
              onBackToDashboard={() => handleSelectModule('Dashboard')}
              spreadsheets={spreadsheets}
              onOpenCreateSpreadsheet={() => setIsCreateModalOpen(true)}
              recentActivities={recentActivities}
              onOpenActivityDetail={setSelectedActivity}
            />
          )}
        </main>

        {/* Minimalist Footnote (No slop, clean compliance copy) */}
        <footer className="border-t border-[#E0E0DA] bg-white py-4 px-6 text-center text-xs text-[#505050]/70">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-semibold text-[#2E4A25]">
              PMEx Portal © {new Date().getFullYear()} — Enterprise Spreadsheet & Eligibility Platform
            </span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hover:text-[#3F9A4B] cursor-pointer">Security & Encryption</span>
              <span>·</span>
              <span className="hover:text-[#3F9A4B] cursor-pointer">Compliance Standard v2.4</span>
              <span>·</span>
              <span className="text-[#3F9A4B] font-medium">All Systems Operational</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 3. MODALS */}
      <CreateSpreadsheetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateSpreadsheet}
      />

      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onNavigateToModule={(mod) => handleSelectModule(mod as PMExModuleId)}
      />
    </div>
  );
}
