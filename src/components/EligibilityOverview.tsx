import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  Filter,
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
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const totalRecords = data.reduce((acc, curr) => acc + curr.count, 0);

  // SVG Donut calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Eligible':
        return <CheckCircle2 className="h-4 w-4 text-[#3F9A4B]" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-[#AAD39C]" />;
      case 'Under Review':
        return <AlertCircle className="h-4 w-4 text-[#2E4A25]" />;
      case 'Rejected':
      default:
        return <XCircle className="h-4 w-4 text-[#505050]" />;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#E0E0DA] bg-white p-5 lg:col-span-6 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E0E0DA]/70">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8FBF0] text-[#3F9A4B] border border-[#AAD39C]/40">
            <FileCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2E4A25]">
              Eligibility Status Breakdown
            </h3>
            <p className="text-[11px] text-[#505050]">
              Automated and manual compliance verifications
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToEligibility()}
          className="flex items-center gap-1 text-xs font-semibold text-[#3F9A4B] hover:text-[#2E4A25] transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Donut and Legend Row */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Donut Chart */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div className="relative h-44 w-44">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#F8FBF0"
                strokeWidth="11"
                fill="transparent"
              />

              {data.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += (item.percentage / 100) * circumference;

                const isSelected = selectedStatus === item.status;

                return (
                  <circle
                    key={item.status}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={item.color}
                    strokeWidth={isSelected ? '14' : '11'}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setSelectedStatus(item.status)}
                    onMouseLeave={() => setSelectedStatus(null)}
                    onClick={() => onNavigateToEligibility(item.status)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-[#2E4A25] tabular-nums">
                {selectedStatus
                  ? data.find((d) => d.status === selectedStatus)?.count.toLocaleString()
                  : totalRecords.toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-[#505050] max-w-[80px] truncate">
                {selectedStatus || 'Total Records'}
              </span>
            </div>
          </div>
        </div>

        {/* Status items breakdown list */}
        <div className="sm:col-span-7 space-y-2.5">
          {data.map((item) => {
            const isHovered = selectedStatus === item.status;
            return (
              <div
                key={item.status}
                onMouseEnter={() => setSelectedStatus(item.status)}
                onMouseLeave={() => setSelectedStatus(null)}
                onClick={() => onNavigateToEligibility(item.status)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'border-[#3F9A4B] bg-[#F8FBF0]'
                    : 'border-[#E0E0DA]/80 bg-white hover:border-[#AAD39C]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-xs font-semibold text-[#2E4A25]">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#2E4A25] tabular-nums">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-medium text-[#505050] tabular-nums w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#E0E0DA]/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer bar */}
      <div className="mt-4 pt-3 border-t border-[#E0E0DA]/70 flex items-center justify-between text-xs">
        <span className="text-[#505050]">
          Last batch evaluated: <strong className="text-[#2E4A25]">Today, 09:05 AM</strong>
        </span>
        <button
          type="button"
          onClick={() => onNavigateToEligibility()}
          className="text-[#3F9A4B] hover:text-[#2E4A25] font-semibold transition-colors"
        >
          Run Batch Verification →
        </button>
      </div>
    </div>
  );
};
