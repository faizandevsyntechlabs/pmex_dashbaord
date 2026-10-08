import React from 'react';
import {
  Gauge,
  FileSpreadsheet,
  History,
  FileCheck,
  FolderArchive,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  FileBarChart2,
  Settings,
} from 'lucide-react';

export type PMExModuleId =
  | 'Dashboard'
  | 'Reporting'
  | 'All Spreadsheets'
  | 'History'
  | 'Eligibility'
  | 'File Manager'
  | 'Admin Panel';

interface NavItem {
  id: PMExModuleId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: string[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: Gauge },
  {
    id: 'Reporting',
    label: 'Reporting',
    icon: FileBarChart2,
    subItems: ['Summary Reports', 'Audit Reports', 'Export Center'],
  },
  {
    id: 'All Spreadsheets',
    label: 'All Spreadsheets',
    icon: FileSpreadsheet,
    badge: '46',
    subItems: ['Recent Sheets', 'Shared with Me', 'Archived Workbooks'],
  },
  { id: 'History', label: 'History', icon: History },
  {
    id: 'Eligibility',
    label: 'Eligibility',
    icon: FileCheck,
    badge: '364',
    subItems: ['Eligibility Verification', 'Batch Check', 'Status Matrix'],
  },
  { id: 'File Manager', label: 'File Manager', icon: FolderArchive, badge: '128' },
  {
    id: 'Admin Panel',
    label: 'Admin Panel',
    icon: ShieldCheck,
    subItems: ['User Management', 'Role Permissions', 'System Settings'],
  },
];

interface DashboardSidebarProps {
  activeModule: PMExModuleId;
  onSelectModule: (moduleId: PMExModuleId, subItem?: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({
    Reporting: false,
    Eligibility: false,
    'Admin Panel': false,
  });

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavClick = (item: NavItem) => {
    onSelectModule(item.id);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  const handleSubClick = (moduleId: PMExModuleId, subItem: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectModule(moduleId, subItem);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1B3316]/25 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Lightweight, Spacious Floating Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#EDEAE0] transition-all duration-300 ease-out lg:static ${
          collapsed ? 'w-[84px]' : 'w-[264px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Main Navigation"
      >
        {/* Top Brand Area */}
        <div className="flex h-20 items-center justify-between px-5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectModule('Dashboard')}
            className="flex items-center gap-3 overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-[#3F9A4B] rounded-xl"
          >
            {/* Modernized PMEx Portal Geometric Emblem (inspired by both Screenshot 1 & 2) */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F8FBF0] border border-[#AAD39C]/60 shadow-2xs">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3L4 20H8.5L12 12L15.5 20H20L12 3Z"
                  fill="#2E4A25"
                />
                <path
                  d="M9.5 15.5H14.5L16 19H8L9.5 15.5Z"
                  fill="#3F9A4B"
                />
              </svg>
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-extrabold tracking-tight text-[#2E4A25] truncate">
                  PMEx Portal
                </span>
                <span className="text-[11px] font-medium text-[#959085] truncate">
                  Operations Workspace
                </span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl text-[#959085] hover:text-[#2E4A25] hover:bg-[#F8FBF0] transition-colors focus-visible:outline-2 focus-visible:outline-[#3F9A4B]"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Eyebrow Section Label */}
        {!collapsed && (
          <div className="px-6 pt-2 pb-2">
            <span className="text-[10px] font-bold tracking-[0.12em] text-[#3F9A20] uppercase">
              Main Navigation
            </span>
          </div>
        )}

        {/* Floating Dock / Navigation Container */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-2">
          <div
            className={`space-y-1.5 ${
              collapsed
                ? 'bg-[#3F9A4B] py-4 px-2 rounded-[28px] shadow-[0_12px_28px_-6px_rgba(63,154,75,0.4)] flex flex-col items-center'
                : 'bg-[#F8FBF0]/80 p-2 rounded-2xl border border-[#EDEAE0]/80'
            }`}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeModule === item.id;
              const hasSub = item.subItems && item.subItems.length > 0;
              const isOpen = !!openDropdowns[item.id];
              const Icon = item.icon;

              if (collapsed) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    title={item.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-[#2E4A25] shadow-sm scale-105'
                        : 'text-white/85 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              }

              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#3F9A4B] ${
                      isActive
                        ? 'bg-[#3F9A4B] text-white font-semibold shadow-[0_6px_16px_-4px_rgba(63,154,75,0.4)]'
                        : 'text-[#505050] font-medium hover:bg-white hover:text-[#2E4A25] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-[#3F9A4B] border border-[#EDEAE0] group-hover:border-[#AAD39C]'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                      </span>

                      <span className="truncate text-left">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && !hasSub && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-semibold tabular-nums rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#EEF0E8] text-[#2A3828]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {hasSub && (
                        <span
                          onClick={(e) => toggleDropdown(item.id, e)}
                          className={`p-1 rounded transition-colors ${
                            isActive
                              ? 'text-white/80 hover:text-white'
                              : 'text-[#959085] hover:text-[#2E4A25]'
                          }`}
                        >
                          {isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Submenu */}
                  {hasSub && isOpen && (
                    <div className="mt-1 ml-9 pl-2.5 space-y-1 border-l border-[#E0E0DA]">
                      {item.subItems?.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={(e) => handleSubClick(item.id, sub, e)}
                          className="w-full text-left text-xs py-1.5 px-2.5 rounded-lg text-[#676767] hover:text-[#2E4A25] hover:bg-white transition-colors block truncate"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Workspace Settings / Status */}
        <div className="p-4 border-t border-[#EDEAE0]">
          {!collapsed ? (
            <div className="flex items-center justify-between rounded-2xl bg-[#F8FBF0] px-3.5 py-3 border border-[#EDEAE0]">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#3F9A4B]" />
                  <p className="text-xs font-bold text-[#2E4A25] truncate">
                    Univer Engine Active
                  </p>
                </div>
                <p className="text-[11px] text-[#959085] truncate mt-0.5">
                  Laravel Sync · Connected
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectModule('Admin Panel', 'System Settings')}
                aria-label="System Settings"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E0E0DA] text-[#676767] hover:text-[#3F9A4B] hover:border-[#AAD39C] transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onSelectModule('Admin Panel', 'System Settings')}
                title="System Settings"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FBF0] border border-[#EDEAE0] text-[#676767] hover:text-[#3F9A4B] transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
