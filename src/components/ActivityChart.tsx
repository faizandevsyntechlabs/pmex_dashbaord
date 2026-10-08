import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FolderArchive,
  ArrowUpRight,
} from 'lucide-react';
import { ActivityDataPoint, TimeRange } from '../types/dashboard';

interface ActivityChartProps {
  data7d: ActivityDataPoint[];
  data30d: ActivityDataPoint[];
  data90d: ActivityDataPoint[];
  activeRange: TimeRange;
  onChangeRange: (range: TimeRange) => void;
  onDrilldown?: (metric: string) => void;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data7d,
  data30d,
  data90d,
  activeRange,
  onChangeRange,
  onDrilldown,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<'all' | 'spreadsheets' | 'eligibility'>('all');

  const currentData =
    activeRange === '7d' ? data7d : activeRange === '30d' ? data30d : data90d;

  // Chart dimensions
  const width = 660;
  const height = 240;
  const paddingX = 38;
  const paddingY = 26;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxValue = Math.max(...currentData.map((d) => d.total), 40);
  const stepX = currentData.length > 1 ? chartWidth / (currentData.length - 1) : chartWidth;

  const pointsTotal = currentData.map((d, i) => ({
    x: paddingX + i * stepX,
    y: height - paddingY - (d.total / maxValue) * chartHeight,
    data: d,
  }));

  const pointsSpreadsheets = currentData.map((d, i) => ({
    x: paddingX + i * stepX,
    y: height - paddingY - (d.spreadsheets / maxValue) * chartHeight,
    data: d,
  }));

  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePathTotal = createSmoothPath(pointsTotal);
  const areaPathTotal =
    pointsTotal.length > 0
      ? `${linePathTotal} L ${pointsTotal[pointsTotal.length - 1].x} ${height - paddingY} L ${pointsTotal[0].x} ${height - paddingY} Z`
      : '';

  const linePathSpreadsheets = createSmoothPath(pointsSpreadsheets);

  const totalOperations = currentData.reduce((acc, curr) => acc + curr.total, 0);
  const totalSpreadsheets = currentData.reduce((acc, curr) => acc + curr.spreadsheets, 0);
  const totalEligibility = currentData.reduce((acc, curr) => acc + curr.eligibility, 0);
  const totalFiles = currentData.reduce((acc, curr) => acc + curr.files, 0);

  const hoveredPoint = hoverIndex !== null ? pointsTotal[hoverIndex] : null;

  // Radial ring helper for the two right-hand stacked cards
  const renderMiniRing = (pct: number, label: string) => {
    const r = 17;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const angle = ((pct / 100) * 360 - 90) * (Math.PI / 180);
    const dx = 21 + r * Math.cos(angle);
    const dy = 21 + r * Math.sin(angle);

    return (
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <svg className="h-11 w-11" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r={r} stroke="#EEF0E8" strokeWidth="2.75" fill="transparent" />
          <circle
            cx="21"
            cy="21"
            r={r}
            stroke="#3F9A4B"
            strokeWidth="2.75"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            transform="rotate(-90 21 21)"
          />
          <circle cx={dx} cy={dy} r="2.5" fill="#2E4A25" />
        </svg>
        <span className="absolute text-[9px] font-bold text-[#2E4A25] tabular-nums">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Section Title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-bold tracking-[0.12em] text-[#3F9A20] uppercase block">
            Performance & Telemetry
          </span>
          <h3 className="text-base font-extrabold text-[#2E4A25] tracking-tight">
            Activity Overview
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Main Floating Spline Chart Card (8 cols) */}
        <div className="pmex-floating-card p-5 lg:col-span-8 flex flex-col justify-between">
          {/* Header & Period Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#EDEAE0]">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#2E4A25]">
                  Activity - Last {activeRange === '7d' ? '7 Days' : activeRange === '30d' ? '30 Days' : '90 Days'}
                </h4>
                <span className="rounded-md bg-[#F8FBF0] border border-[#E0E0DA] px-2 py-0.5 text-[10px] font-semibold text-[#3F9A4B] tabular-nums">
                  {totalOperations} events
                </span>
              </div>
              <p className="text-xs text-[#676767] mt-0.5">
                Combined spreadsheet revisions, eligibility checks, and file uploads
              </p>
            </div>

            {/* 7D / 30D / 90D Segmented Control */}
            <div className="flex items-center gap-1 rounded-xl bg-[#EEF0E8] p-1 self-start sm:self-auto">
              {(['7d', '30d', '90d'] as TimeRange[]).map((range) => {
                const label = range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days';
                const isSelected = activeRange === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => onChangeRange(range)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#3F9A4B] text-white shadow-2xs'
                        : 'text-[#676767] hover:text-[#2E4A25]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setVisibleSeries('all')}
                className={`flex items-center gap-1.5 transition-opacity ${
                  visibleSeries === 'all' ? 'opacity-100 font-semibold text-[#2E4A25]' : 'opacity-60 text-[#676767]'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#3F9A4B]" />
                <span>Total Activity ({totalOperations})</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibleSeries('spreadsheets')}
                className={`flex items-center gap-1.5 transition-opacity ${
                  visibleSeries === 'spreadsheets' ? 'opacity-100 font-semibold text-[#2E4A25]' : 'opacity-60 text-[#676767]'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#9ED08D]" />
                <span>Spreadsheets ({totalSpreadsheets})</span>
              </button>
            </div>

            <span className="text-[11px] text-[#959085]">
              Hover points to inspect daily metrics
            </span>
          </div>

          {/* SVG Spline Chart */}
          <div className="relative mt-2 w-full">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-56 sm:h-60 overflow-visible"
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="pmexAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F9A4B" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#F8FBF0" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Clean Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = height - paddingY - pct * chartHeight;
                const val = Math.round(pct * maxValue);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#EDEAE0"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] fill-[#959085] font-mono tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              {areaPathTotal && <path d={areaPathTotal} fill="url(#pmexAreaFill)" />}

              {/* Secondary Curve: Spreadsheets */}
              {linePathSpreadsheets && (
                <path
                  d={linePathSpreadsheets}
                  fill="none"
                  stroke="#9ED08D"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              )}

              {/* Primary Curve: Total Activity */}
              {linePathTotal && (
                <path
                  d={linePathTotal}
                  fill="none"
                  stroke="#3F9A4B"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Points & Hover Crosshair */}
              {pointsTotal.map((pt, i) => {
                const isHovered = hoverIndex === i;
                return (
                  <g key={i}>
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingY}
                        x2={pt.x}
                        y2={height - paddingY}
                        stroke="#AAD39C"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke={isHovered ? '#2E4A25' : '#3F9A4B'}
                      strokeWidth={isHovered ? 3 : 2.25}
                      className="transition-all duration-150 cursor-pointer"
                    />

                    <rect
                      x={pt.x - stepX / 2}
                      y={0}
                      width={stepX}
                      height={height}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverIndex(i)}
                    />

                    <text
                      x={pt.x}
                      y={height - 6}
                      textAnchor="middle"
                      className={`text-[11px] transition-colors ${
                        isHovered ? 'fill-[#2E4A25] font-bold' : 'fill-[#676767] font-medium'
                      }`}
                    >
                      {pt.data.dayLabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip */}
            {hoveredPoint && (
              <div
                className="pointer-events-none absolute z-20 rounded-2xl border border-[#EDEAE0] bg-white p-3 shadow-lg text-xs min-w-[155px]"
                style={{
                  left: `${Math.min(Math.max((hoveredPoint.x / width) * 100, 14), 86)}%`,
                  top: `${Math.max(hoveredPoint.y - 68, 8)}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#EDEAE0] pb-1.5 font-bold text-[#2E4A25]">
                  <span>{hoveredPoint.data.dateStr}</span>
                  <span className="text-[#3F9A4B] tabular-nums">{hoveredPoint.data.total} total</span>
                </div>
                <div className="mt-1.5 space-y-1 text-[11px] text-[#676767]">
                  <div className="flex items-center justify-between">
                    <span>Spreadsheets:</span>
                    <span className="font-bold text-[#2E4A25] tabular-nums">{hoveredPoint.data.spreadsheets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Eligibility:</span>
                    <span className="font-bold text-[#2E4A25] tabular-nums">{hoveredPoint.data.eligibility}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Files:</span>
                    <span className="font-bold text-[#2E4A25] tabular-nums">{hoveredPoint.data.files}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Two Stacked Floating Cards (Inspired by Screenshot 2's Paid Invoices / Live Jobs Value cards) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5">
          {/* Card 1: Spreadsheet Activity Volume */}
          <div
            onClick={() => onDrilldown?.('All Spreadsheets')}
            className="pmex-floating-card p-5 flex-1 flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8FBF0] border border-[#EDEAE0] group-hover:border-[#AAD39C] transition-colors">
                <FileSpreadsheet className="h-5 w-5 text-[#2E4A25] group-hover:text-[#3F9A4B] transition-colors" />
              </div>
              {renderMiniRing(64, '+18%')}
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-[#676767]">
                Spreadsheet Revisions
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#2E4A25] tabular-nums tracking-tight">
                  {totalSpreadsheets} Edits
                </span>
                <span className="text-xs font-semibold text-[#D9713C] tabular-nums">
                  {totalEligibility} cells synced
                </span>
              </div>
              <p className="text-[11px] text-[#959085] mt-1">
                Current period · 46 active workbooks
              </p>
            </div>
          </div>

          {/* Card 2: File & Eligibility Throughput */}
          <div
            onClick={() => onDrilldown?.('File Manager')}
            className="pmex-floating-card p-5 flex-1 flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8FBF0] border border-[#EDEAE0] group-hover:border-[#AAD39C] transition-colors">
                <FolderArchive className="h-5 w-5 text-[#2E4A25] group-hover:text-[#3F9A4B] transition-colors" />
              </div>
              {renderMiniRing(85, '85%')}
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-[#676767]">
                Processed Files & Batches
              </p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#2E4A25] tabular-nums tracking-tight">
                  {totalEligibility + totalFiles} Items
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#3F9A4B]">
                  <span>Inspect</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="text-[11px] text-[#959085] mt-1">
                Current period · {totalFiles} repository uploads
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
