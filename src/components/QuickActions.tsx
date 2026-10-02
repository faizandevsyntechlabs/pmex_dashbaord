import React from 'react';
import {
  PlusCircle,
  FileSpreadsheet,
  FileBarChart2,
  FileCheck,
  FolderArchive,
  ShieldCheck,
  ArrowRight,
  UploadCloud,
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
      description: 'Start blank sheet or load compliance template',
      icon: PlusCircle,
      primary: true,
      onClick: onCreateSpreadsheet,
    },
    {
      id: 'view-sheets',
      title: 'View All Spreadsheets',
      description: '46 active workbooks in repository',
      icon: FileSpreadsheet,
      onClick: () => onNavigateToModule('All Spreadsheets'),
    },
    {
      id: 'eligibility',
      title: 'Eligibility Verification',
      description: 'Run batch checks or review flagged records',
      icon: FileCheck,
      onClick: () => onNavigateToModule('Eligibility'),
    },
    {
      id: 'reporting',
      title: 'Generate Reports',
      description: 'Export audit logs and compliance summaries',
      icon: FileBarChart2,
      onClick: () => onNavigateToModule('Reporting'),
    },
    {
      id: 'file-manager',
      title: 'File Manager',
      description: 'Upload files and manage document vault',
      icon: FolderArchive,
      onClick: () => onNavigateToModule('File Manager'),
    },
    {
      id: 'admin-panel',
      title: 'Admin Permissions',
      description: 'Configure user access and role policies',
      icon: ShieldCheck,
      onClick: () => onNavigateToModule('Admin Panel'),
    },
  ];

  return (
    <div className="rounded-3xl border border-[#E0E0DA] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E0E0DA]/70">
        <div>
          <h3 className="text-sm font-bold text-[#2E4A25]">
            Quick Operations
          </h3>
          <p className="text-[11px] text-[#505050]">
            Commonly performed workflows in PMEx Portal
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className={`group flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#3F9A4B] ${
                act.primary
                  ? 'border-[#3F9A4B] bg-[#F8FBF0] hover:bg-[#3F9A4B] hover:text-white'
                  : 'border-[#E0E0DA] bg-white hover:border-[#3F9A4B] hover:shadow-xs'
              }`}
            >
              <div>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    act.primary
                      ? 'bg-[#3F9A4B] text-white group-hover:bg-white group-hover:text-[#3F9A4B]'
                      : 'bg-[#F8FBF0] text-[#3F9A4B] group-hover:bg-[#3F9A4B] group-hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <p
                  className={`mt-3 text-xs font-bold leading-snug transition-colors ${
                    act.primary
                      ? 'text-[#2E4A25] group-hover:text-white'
                      : 'text-[#2E4A25] group-hover:text-[#3F9A4B]'
                  }`}
                >
                  {act.title}
                </p>

                <p
                  className={`mt-1 text-[11px] leading-tight line-clamp-2 transition-colors ${
                    act.primary
                      ? 'text-[#505050] group-hover:text-white/80'
                      : 'text-[#505050]'
                  }`}
                >
                  {act.description}
                </p>
              </div>

              <div
                className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-semibold transition-colors ${
                  act.primary
                    ? 'border-[#3F9A4B]/20 text-[#3F9A4B] group-hover:border-white/20 group-hover:text-white'
                    : 'border-[#E0E0DA] text-[#3F9A4B]'
                }`}
              >
                <span>Launch</span>
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
