import React from 'react';
import { X, Clock, User, FileText, CheckCircle2, Shield, ExternalLink } from 'lucide-react';
import { RecentActivityRecord } from '../types/dashboard';

interface ActivityDetailModalProps {
  activity: RecentActivityRecord | null;
  onClose: () => void;
  onNavigateToModule: (moduleName: string) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
  onNavigateToModule,
}) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#E0E0DA] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E0DA]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3F9A4B]" />
            <h3 className="text-base font-bold text-[#2E4A25]">
              Audit Record Inspection
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#505050] hover:bg-[#F8FBF0] hover:text-[#2E4A25] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FBF0] border border-[#E0E0DA]">
            <div>
              <p className="font-bold text-[#2E4A25] text-sm">{activity.user}</p>
              <p className="text-[11px] text-[#505050]">{activity.userRole}</p>
            </div>
            <span className="font-semibold text-[#3F9A4B] bg-white px-2.5 py-1 rounded-lg border border-[#E0E0DA]">
              {activity.module}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-[#E0E0DA] bg-white">
              <span className="text-[10px] text-[#505050] uppercase font-bold tracking-wider">
                Action Type
              </span>
              <p className="text-xs font-semibold text-[#2E4A25] mt-0.5">
                {activity.action}
              </p>
            </div>
            <div className="p-3 rounded-xl border border-[#E0E0DA] bg-white">
              <span className="text-[10px] text-[#505050] uppercase font-bold tracking-wider">
                Logged Timestamp
              </span>
              <p className="text-xs font-semibold text-[#2E4A25] mt-0.5 tabular-nums">
                {activity.timestamp}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[#E0E0DA] bg-white">
            <span className="text-[10px] text-[#505050] uppercase font-bold tracking-wider">
              Target Resource
            </span>
            <p className="text-xs font-bold text-[#2E4A25] mt-0.5 break-all">
              {activity.resourceName}
            </p>
          </div>

          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="p-3 rounded-xl border border-[#E0E0DA] bg-[#F8FBF0]">
              <span className="text-[10px] text-[#2E4A25] uppercase font-bold tracking-wider">
                Operational Metadata
              </span>
              <div className="mt-2 space-y-1.5 font-mono text-[11px] text-[#505050]">
                {Object.entries(activity.metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between gap-2 border-b border-[#E0E0DA]/50 pb-1">
                    <span className="text-[#2E4A25] font-semibold">{key}:</span>
                    <span className="truncate max-w-[240px] text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E0E0DA] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E0E0DA] bg-white px-4 py-2 text-xs font-semibold text-[#505050] hover:bg-[#F8FBF0] transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToModule(activity.module);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3F9A4B] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#34833e] transition-colors"
          >
            <span>Open in {activity.module}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
