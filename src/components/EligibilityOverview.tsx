import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { EligibilityStatusData } from '../types/dashboard';

interface EligibilityOverviewProps {
  data: EligibilityStatusData[];
  onNavigateToEligibility: (statusFilter?: string) => void;
}

export const EligibilityOverview: React.FC<EligibilityOverviewProps> = ({
  data,
  onNavigateToEligibility,
}) => {
  const [activeStatus, setActiveStatus] = useState<'Eligible' | 'Pending' | 'Rejected'>('Eligible');

  const totalRecords = data.reduce((acc, curr) => acc + curr.count, 0);
  const selectedItem = data.find((d) => d.status === activeStatus) || data[0];

  // Semi-circular arch math (radius = 62, half-circumference = PI * 62 = 194.78)
  const archRadius = 62;
  const halfCircumference = Math.PI * archRadius;
  const archOffset = halfCircumference - (selectedItem.percentage / 100) * halfCircumference;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Eligible':
        return <CheckCircle2 className="h-5 w-5 text-[#2E4A25]" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-[#2E4A25]" />;
      case 'Rejected':
      default:
        return <XCircle className="h-5 w-5 text-[#2E4A25]" />;
    }
  };

  return (
    <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#3F9A20] uppercase block">
            Compliance & Verification
          </span>
          <h3 className="text-base font-extrabold text-[#2E4A25] tracking-tight">
            Eligibility Status Breakdown
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onNavigateToEligibility()}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F9A4B] hover:text-[#2E4A25] transition-colors"
        >
          <span>All Records</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Asymmetric Split Layout Inspired by Screenshot 2:
          Left: Signature Green Arch-Gauge Card
          Right: Stacked White Floating Status Cards with Mini Radial Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1">
        {/* Left Focal Card: Semi-Circular Gauge Arch Card */}
        <div
          onClick={() => onNavigateToEligibility(selectedItem.status)}
          className="sm:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#3F9A4B] to-[#2E4A25] p-5 text-white shadow-[0_14px_30px_-8px_rgba(46,74,37,0.28)] flex flex-col justify-between cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-[#AAD39C] uppercase">
              {selectedItem.status} Ratio
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToEligibility();
              }}
              aria-label="Eligibility options"
              className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Semi-Circular Gauge Arch (Inspired by Screenshot 2's 45% Arch) */}
          <div className="my-2 flex flex-col items-center">
            <div className="relative w-44 h-28 flex items-end justify-center">
              <svg className="w-44 h-28 overflow-visible" viewBox="0 0 160 95">
                <defs>
                  <linearGradient id="pmexArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#AAD39C" />
                    <stop offset="50%" stopColor="#9ED08D" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
                {/* Background Track Arch */}
                <path
                  d="M 18 82 A 62 62 0 0 1 142 82"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Active Progress Arch */}
                <path
                  d="M 18 82 A 62 62 0 0 1 142 82"
                  fill="none"
                  stroke="url(#pmexArchGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={halfCircumference}
                  strokeDashoffset={archOffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-2xl font-extrabold text-white tabular-nums tracking-tight">
                  {selectedItem.percentage}%
                </span>
              </div>
            </div>

            {/* Center Document Emblem */}
            <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/25 backdrop-blur-xs">
              <FileCheck className="h-5 w-5 text-[#AAD39C]" />
            </div>
          </div>

          {/* Bottom Metric Figures */}
          <div className="text-center mt-1">
            <p className="text-xs font-medium text-[#AAD39C]">
              {selectedItem.status} Records
            </p>
            <p className="text-2xl font-extrabold text-white tabular-nums tracking-tight mt-0.5">
              {selectedItem.count.toLocaleString()}
            </p>
            <p className="text-[11px] text-white/75 tabular-nums mt-0.5">
              Out of {totalRecords.toLocaleString()} total records
            </p>
          </div>

          {/* Interactive Status Selector Pills */}
          <div
            className="mt-4 pt-3 border-t border-white/15 flex items-center justify-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {data.map((item) => (
              <button
                key={item.status}
                type="button"
                onClick={() => setActiveStatus(item.status)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  activeStatus === item.status
                    ? 'bg-white text-[#2E4A25] shadow-2xs'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item.status}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Stacked Clean White Floating Cards for each Status */}
        <div className="sm:col-span-6 flex flex-col justify-between gap-3">
          {data.map((item) => {
            const isSelected = activeStatus === item.status;
            const r = 16;
            const circ = 2 * Math.PI * r;
            const offset = circ - (item.percentage / 100) * circ;

            return (
              <div
                key={item.status}
                onMouseEnter={() => setActiveStatus(item.status)}
                onClick={() => onNavigateToEligibility(item.status)}
                className={`pmex-floating-card p-4 cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected ? 'border-[#3F9A4B] bg-[#F8FBF0]/60' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8FBF0] border border-[#EDEAE0]">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#676767]">{item.status}</p>
                    <p className="text-lg font-extrabold text-[#2E4A25] tabular-nums leading-tight mt-0.5">
                      {item.count.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#959085] truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mini Radial Ring on the Right */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <svg className="h-10 w-10" viewBox="0 0 40 40">
                    <circle
                      cx="20"
                      cy="20"
                      r={r}
                      stroke="#EEF0E8"
                      strokeWidth="2.5"
                      fill="transparent"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r={r}
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      fill="transparent"
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-bold text-[#2E4A25] tabular-nums">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
