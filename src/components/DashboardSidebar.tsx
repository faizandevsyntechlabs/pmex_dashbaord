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
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  FileBarChart2,
  ExternalLink,
} from 'lucide-react';
import badgeImage from '../assets/images/pmex_portal_badge_1790968201809.jpg';

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
    badge: '12',
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#2E4A25] text-white transition-all duration-300 ease-in-out lg:static ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-[#2E4A25]/40 shadow-xl lg:shadow-none`}
        aria-label="Main Navigation"
      >
        {/* Brand Area */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-[#AAD39C]/30 overflow-hidden shadow-sm">
              <img
                src={badgeImage}
                alt="PMEX Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback to SVG lettermark if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `<span class="text-sm font-black text-[#AAD39C]">P</span>`;
                  }
                }}
              />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-white truncate">
                  PMEX Portal
                </span>
                <span className="text-[11px] font-medium text-[#AAD39C] truncate">
                  Enterprise Analytics
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#AAD39C]"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Section Header */}
        {!collapsed && (
          <div className="px-5 pt-4 pb-2">
            <span className="text-[10px] font-semibold tracking-wider text-[#AAD39C]/70 uppercase">
              Main Navigation
            </span>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            const hasSub = item.subItems && item.subItems.length > 0;
            const isOpen = !!openDropdowns[item.id];
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#AAD39C] ${
                    isActive
                      ? 'bg-[#3F9A4B] text-white shadow-sm font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-[#AAD39C] group-hover:bg-white/10 group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </span>

                    {!collapsed && (
                      <span className="truncate text-left">{item.label}</span>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && !hasSub && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold tabular-nums rounded-md bg-white/15 text-[#AAD39C]">
                          {item.badge}
                        </span>
                      )}

                      {hasSub && (
                        <span
                          onClick={(e) => toggleDropdown(item.id, e)}
                          className="p-1 text-white/60 hover:text-white rounded"
                        >
                          {isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu (When expanded) */}
                {!collapsed && hasSub && isOpen && (
                  <div className="mt-1 ml-9 pl-2 space-y-1 border-l border-white/15">
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={(e) => handleSubClick(item.id, sub, e)}
                        className="w-full text-left text-[11px] py-1.5 px-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors block truncate"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer / Helper Card (Visual inspiration from vision UI card) */}
        {!collapsed ? (
          <div className="p-3 m-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#3F9A4B] text-white">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">PMEx System Guide</p>
                <p className="text-[11px] text-white/70 leading-tight mt-0.5">
                  Spreadsheet audit rules & eligibility compliance
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-[#AAD39C] font-medium">v2.4.0 Production</span>
              <a
                href="#docs"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectModule('Reporting', 'Audit Reports');
                }}
                className="text-white hover:text-[#AAD39C] flex items-center gap-1 transition-colors"
              >
                <span>Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ) : (
          <div className="p-3 flex justify-center">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#AAD39C] hover:text-white transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
