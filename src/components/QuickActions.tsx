import React from 'react';
import {
  PlusCircle,
  FileSpreadsheet,
  FileBarChart2,
  FileCheck,
  FolderArchive,
  ArrowUpRight,
} from 'lucide-react';
import { PMExModuleId } from './DashboardSidebar';

interface QuickActionsProps {
  onCreateSpreadsheet: () => void;
  onNavigateToModule: (moduleId: PMExModuleId, subItem?: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateSpreadsheet,
  onNavigateToModule,
}) => {
  const actions = [
    {
      id: 'create-sheet',
      title: 'Create Spreadsheet',
      subtitle: 'New Univer workbook',
      icon: PlusCircle,
      primary: true,
      onClick: onCreateSpreadsheet,
    },
    {
      id: 'view-sheets',
      title: 'View Spreadsheets',
      subtitle: '46 active workbooks',
      icon: FileSpreadsheet,
      onClick: () => onNavigateToModule('All Spreadsheets'),
    },
    {
      id: 'reporting',
      title: 'Reporting',
      subtitle: 'Summary & audit exports',
      icon: FileBarChart2,
      onClick: () => onNavigateToModule('Reporting'),
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      subtitle: '1,842 verification records',
      icon: FileCheck,
      onClick: () => onNavigateToModule('Eligibility'),
    },
    {
      id: 'file-manager',
      title: 'File Manager',
      subtitle: '128 repository files',
      icon: FolderArchive,
      onClick: () => onNavigateToModule('File Manager'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#3F9A20] uppercase block">
            Direct Navigation
          </span>
          <h3 className="text-base font-extrabold text-[#2E4A25] tracking-tight">
            Quick Actions
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className={`group flex items-center justify-between gap-3 rounded-2xl p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#3F9A4B] ${
                act.primary
                  ? 'bg-[#3F9A4B] text-white shadow-[0_8px_20px_-6px_rgba(63,154,75,0.4)] hover:bg-[#2E4A25] hover:-translate-y-0.5'
                  : 'pmex-floating-card hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    act.primary
                      ? 'bg-white/20 text-white'
                      : 'bg-[#F8FBF0] border border-[#EDEAE0] text-[#2E4A25] group-hover:text-[#3F9A4B] group-hover:border-[#AAD39C]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      act.primary ? 'text-white' : 'text-[#2E4A25]'
                    }`}
                  >
                    {act.title}
                  </p>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      act.primary ? 'text-white/80' : 'text-[#959085]'
                    }`}
                  >
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <ArrowUpRight
                className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                  act.primary ? 'text-white/80' : 'text-[#959085] group-hover:text-[#3F9A4B]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
