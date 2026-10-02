import React from 'react';
import {
  FileText,
  ClipboardCheck,
  Users,
  TableProperties,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react';
import { StatMetric } from '../types/dashboard';

interface StatCardProps {
  stat: StatMetric;
  onClick: (module: string) => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, onClick, isActive }) => {
  const getIcon = () => {
    switch (stat.iconName) {
      case 'file-text':
        return <FileText className="h-5 w-5 text-[#3F9A4B]" />;
      case 'clipboard-check':
        return <ClipboardCheck className="h-5 w-5 text-[#3F9A4B]" />;
      case 'users':
        return <Users className="h-5 w-5 text-[#3F9A4B]" />;
      case 'table-cells':
      default:
        return <TableProperties className="h-5 w-5 text-[#3F9A4B]" />;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(stat.targetModule)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(stat.targetModule);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all duration-200 cursor-pointer text-left hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#3F9A4B] ${
        isActive
          ? 'border-[#3F9A4B] ring-1 ring-[#3F9A4B]/30'
          : 'border-[#E0E0DA] hover:border-[#3F9A4B]'
      }`}
    >
      {/* Top row: Label and Icon Container */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#505050]">
            {stat.label}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-[#2E4A25] tabular-nums tracking-tight">
              {stat.formattedValue}
            </span>
          </div>
        </div>

        {/* Icon box (styled like the vision UI inspiration icon square with PMEx green) */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FBF0] border border-[#AAD39C]/40 group-hover:bg-[#3F9A4B] group-hover:border-[#3F9A4B] transition-colors">
          <span className="group-hover:text-white transition-colors [&>svg]:group-hover:text-white">
            {getIcon()}
          </span>
        </div>
      </div>

      {/* Supporting details & Trend badge */}
      <div className="mt-4 pt-3 border-t border-[#E0E0DA]/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          {stat.changeType === 'increase' ? (
            <span className="flex items-center text-[#3F9A4B] font-semibold tabular-nums">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              +{stat.change}%
            </span>
          ) : stat.changeType === 'decrease' ? (
            <span className="flex items-center text-[#505050] font-semibold tabular-nums">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              -{stat.change}%
            </span>
          ) : (
            <span className="flex items-center text-[#505050] font-semibold tabular-nums">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
              {stat.change}%
            </span>
          )}
          <span className="text-[11px] text-[#505050]/80 truncate">
            {stat.timeframe}
          </span>
        </div>

        {stat.badgeNote && (
          <span className="text-[11px] font-medium text-[#2E4A25] bg-[#F8FBF0] px-2 py-0.5 rounded-md border border-[#E0E0DA] shrink-0 truncate max-w-[120px]">
            {stat.badgeNote}
          </span>
        )}
      </div>

      {/* Interactive hover hint */}
      <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#3F9A4B] opacity-0 group-hover:opacity-100 transition-opacity">
        <span>View {stat.targetModule}</span>
        <ArrowUpRight className="h-3 w-3" />
      </div>
    </div>
  );
};
