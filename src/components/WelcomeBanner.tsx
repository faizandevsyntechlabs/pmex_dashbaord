import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import welcomeMesh from '../assets/images/pmex_welcome_mesh_1790968166282.jpg';

interface WelcomeBannerProps {
  userName?: string;
  onExploreAudit: () => void;
  onQuickVerify: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName = 'Super Admin',
  onExploreAudit,
  onQuickVerify,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Main Bento Welcome Card (6 or 7 cols) */}
      <div className="relative overflow-hidden rounded-3xl border border-[#2E4A25]/20 bg-[#2E4A25] p-6 lg:col-span-6 xl:col-span-6 shadow-md text-white flex flex-col justify-between min-h-[220px]">
        {/* Background Image & Scrim */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <img
            src={welcomeMesh}
            alt="Data stream backdrop"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#2E4A25] via-[#2E4A25]/90 to-[#2E4A25]/40" />

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[#AAD39C] backdrop-blur-xs border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#3F9A4B] animate-pulse" />
            <span>PMEx Portal Live Engine</span>
          </div>

          <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome back, {userName}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-white/80 max-w-md leading-relaxed">
            All spreadsheet data connectors and eligibility batch verification pipelines are active and synchronized with Ministry databases.
          </p>
        </div>

        {/* Actions */}
        <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExploreAudit}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3F9A4B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#34833e] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>Review Audit History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onQuickVerify}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2.5 text-xs font-medium text-white transition-colors border border-white/15"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#AAD39C]" />
            <span>Batch Check</span>
          </button>
        </div>
      </div>

      {/* Radial Metric 1: Eligibility Verification Rate (3 cols) */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E0E0DA] bg-white p-5 lg:col-span-3 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2E4A25] uppercase tracking-wide">
              Verification Rate
            </span>
            <span className="text-[11px] font-semibold text-[#3F9A4B] bg-[#F8FBF0] px-2 py-0.5 rounded-md border border-[#E0E0DA]">
              Target 95%
            </span>
          </div>
          <p className="text-[11px] text-[#505050] mt-0.5">Automated identity check</p>
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative my-3 flex flex-col items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F8FBF0"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress Arc: 94.2% -> 2 * PI * 40 = 251.32. Dash = 251.32 * 0.942 = 236.7 */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3F9A4B"
              strokeWidth="9"
              strokeDasharray="251.32"
              strokeDashoffset="14.6"
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#2E4A25] tabular-nums">94.2%</span>
            <span className="text-[10px] font-medium text-[#505050]">Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E0E0DA]/70">
          <span className="text-[#505050]">1,842 total</span>
          <span className="font-semibold text-[#2E4A25]">1,420 clear</span>
        </div>
      </div>

      {/* Radial Metric 2: Spreadsheet Integrity & Safety Score (3 cols) */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E0E0DA] bg-white p-5 lg:col-span-3 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2E4A25] uppercase tracking-wide">
              Data Integrity
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#3F9A4B]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-[#505050] mt-0.5">Spreadsheet validation</p>
        </div>

        {/* Circular Half/Full Dial */}
        <div className="relative my-3 flex flex-col items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F8FBF0"
              strokeWidth="9"
              fill="transparent"
            />
            {/* 9.8 / 10 = 98% */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#AAD39C"
              strokeWidth="9"
              strokeDasharray="251.32"
              strokeDashoffset="5.0"
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#2E4A25] tabular-nums">9.8</span>
            <span className="text-[10px] font-medium text-[#505050]">Health Score</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E0E0DA]/70">
          <span className="text-[#505050]">46 Workbooks</span>
          <span className="font-semibold text-[#2E4A25]">0 Errors</span>
        </div>
      </div>
    </div>
  );
};
