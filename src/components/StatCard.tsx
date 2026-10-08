import React from 'react';
import {
  FileText,
  ClipboardCheck,
  Users,
  TableProperties,
  ArrowUpRight,
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
        return <FileText className="h-5 w-5 text-[#2E4A25] group-hover:text-[#3F9A4B] transition-colors" />;
      case 'clipboard-check':
        return <ClipboardCheck className="h-5 w-5 text-[#2E4A25] group-hover:text-[#3F9A4B] transition-colors" />;
      case 'users':
        return <Users className="h-5 w-5 text-[#2E4A25] group-hover:text-[#3F9A4B] transition-colors" />;
      case 'table-cells':
      default:
        return <TableProperties className="h-5 w-5 text-[#2E4A25] group-hover:text-[#3F9A4B] transition-colors" />;
    }
  };

  // Radial ring math (radius = 18, circumference = 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (stat.ringProgress / 100) * circumference;

  // Dot position at the end of the progress arc
  const angleRad = ((stat.ringProgress / 100) * 360 - 90) * (Math.PI / 180);
  const dotX = 22 + radius * Math.cos(angleRad);
  const dotY = 22 + radius * Math.sin(angleRad);

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
      className={`pmex-floating-card group relative flex flex-col justify-between p-5 cursor-pointer text-left hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#3F9A4B] ${
        isActive ? 'ring-2 ring-[#3F9A4B]/30 border-[#3F9A4B]' : ''
      }`}
    >
      {/* Top Row: Clean Line Icon on Left + Radial Progress Ring on Right (inspired by Screenshot 2) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8FBF0] border border-[#EDEAE0] group-hover:bg-[#EEF0E8] group-hover:border-[#AAD39C] transition-colors">
          {getIcon()}
        </div>

        {/* Mini Circular Radial Progress Indicator */}
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
          <svg className="h-11 w-11" viewBox="0 0 44 44">
            {/* Track */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="#EEF0E8"
              strokeWidth="2.75"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="#3F9A4B"
              strokeWidth="2.75"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="transparent"
              transform="rotate(-90 22 22)"
              className="transition-all duration-700 ease-out"
            />
            {/* Indicator Dot on the Arc */}
            <circle
              cx={dotX}
              cy={dotY}
              r="2.6"
              fill="#2E4A25"
            />
          </svg>
          <span className="absolute text-[9px] font-bold text-[#2E4A25] tabular-nums">
            +{stat.change}%
          </span>
        </div>
      </div>

      {/* Middle: Label & Dual-Figure Metric */}
      <div className="mt-4">
        <p className="text-xs font-medium text-[#676767] tracking-tight">
          {stat.label}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#2E4A25] tabular-nums tracking-tight leading-none">
            {stat.formattedValue}
          </span>
          {stat.secondaryValue && (
            <>
              <span className="text-lg font-bold text-[#959085]">-</span>
              <span className="text-lg sm:text-xl font-bold text-[#959085] tabular-nums leading-none">
                {stat.secondaryValue}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bottom: Supporting Caption & Subtle Hover Link */}
      <div className="mt-3 pt-2.5 border-t border-[#EDEAE0]/70 flex items-center justify-between text-[11px]">
        <span className="text-[#959085] truncate">{stat.sublabel}</span>
        <span className="inline-flex items-center gap-0.5 font-semibold text-[#3F9A4B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <span>Open</span>
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
};
