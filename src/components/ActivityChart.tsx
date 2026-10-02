import React, { useState } from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  FileCheck,
  FolderArchive,
  Users,
  Calendar,
  Layers,
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'spreadsheets' | 'eligibility'>('all');

  const currentData =
    activeRange === '7d' ? data7d : activeRange === '30d' ? data30d : data90d;

  // Chart dimensions & math
  const width = 640;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxValue = Math.max(...currentData.map((d) => d.total), 40);
  const stepX = currentData.length > 1 ? chartWidth / (currentData.length - 1) : chartWidth;

  const pointsTotal = currentData.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - (d.total / maxValue) * chartHeight;
    return { x, y, data: d };
  });

  const pointsSpreadsheets = currentData.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - (d.spreadsheets / maxValue) * chartHeight;
    return { x, y, data: d };
  });

  // Helper to create smooth SVG cubic bezier path
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
  const areaPathTotal = pointsTotal.length > 0
    ? `${linePathTotal} L ${pointsTotal[pointsTotal.length - 1].x} ${height - paddingY} L ${pointsTotal[0].x} ${height - paddingY} Z`
    : '';

  const linePathSpreadsheets = createSmoothPath(pointsSpreadsheets);

  // Totals for summary footer chips
  const totalOperations = currentData.reduce((acc, curr) => acc + curr.total, 0);
  const totalSpreadsheets = currentData.reduce((acc, curr) => acc + curr.spreadsheets, 0);
  const totalEligibility = currentData.reduce((acc, curr) => acc + curr.eligibility, 0);
  const totalFiles = currentData.reduce((acc, curr) => acc + curr.files, 0);

  const hoveredPoint = hoverIndex !== null ? pointsTotal[hoverIndex] : null;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Spline Area Chart: Activity Overview (8 cols) */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E0E0DA] bg-white p-5 lg:col-span-8 shadow-xs">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E0E0DA]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2E4A25] tracking-tight">
                Activity Overview
              </span>
              <span className="text-xs font-semibold text-[#3F9A4B] bg-[#F8FBF0] px-2 py-0.5 rounded-md border border-[#E0E0DA]">
                Live Feed
              </span>
            </div>
            <p className="text-[11px] text-[#505050] mt-0.5">
              Portal operations, audit events, and user interactions
            </p>
          </div>

          {/* Timeframe Segmented Control */}
          <div className="flex items-center gap-1 rounded-xl bg-[#F8FBF0] p-1 border border-[#E0E0DA] self-start sm:self-auto">
            {(['7d', '30d', '90d'] as TimeRange[]).map((range) => {
              const label = range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days';
              const isSelected = activeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => onChangeRange(range)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#3F9A4B] text-white shadow-xs'
                      : 'text-[#505050] hover:text-[#2E4A25] hover:bg-white/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-1.5 transition-opacity ${
              activeCategory === 'all' ? 'opacity-100 font-semibold' : 'opacity-60'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#3F9A4B]" />
            <span className="text-[#2E4A25]">Total Activity</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('spreadsheets')}
            className={`flex items-center gap-1.5 transition-opacity ${
              activeCategory === 'spreadsheets' ? 'opacity-100 font-semibold' : 'opacity-60'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#AAD39C]" />
            <span className="text-[#505050]">Spreadsheets</span>
          </button>
        </div>

        {/* Responsive Interactive SVG Line/Area Chart */}
        <div className="relative mt-2 w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-56 sm:h-64 overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3F9A4B" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3F9A4B" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
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
                    stroke="#E0E0DA"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-[#505050]/70 font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {areaPathTotal && (
              <path d={areaPathTotal} fill="url(#activityGradient)" />
            )}

            {/* Secondary Line: Spreadsheets */}
            {linePathSpreadsheets && (
              <path
                d={linePathSpreadsheets}
                fill="none"
                stroke="#AAD39C"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )}

            {/* Primary Spline Line: Total */}
            {linePathTotal && (
              <path
                d={linePathTotal}
                fill="none"
                stroke="#3F9A4B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Interactive Data Points and Crosshair */}
            {pointsTotal.map((pt, i) => {
              const isHovered = hoverIndex === i;
              return (
                <g key={i}>
                  {/* Vertical Crosshair bar on hover */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={paddingY}
                      x2={pt.x}
                      y2={height - paddingY}
                      stroke="#3F9A4B"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Outer circle ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 3.5}
                    fill="#FFFFFF"
                    stroke="#3F9A4B"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-150 cursor-pointer"
                  />

                  {/* Invisible hit target for smooth mouseover */}
                  <rect
                    x={pt.x - stepX / 2}
                    y={0}
                    width={stepX}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(i)}
                  />

                  {/* X-axis Label */}
                  <text
                    x={pt.x}
                    y={height - 8}
                    textAnchor="middle"
                    className={`text-[10px] font-medium transition-colors ${
                      isHovered
                        ? 'fill-[#2E4A25] font-bold'
                        : 'fill-[#505050]/80'
                    }`}
                  >
                    {pt.data.dayLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip Box */}
          {hoveredPoint && (
            <div
              className="pointer-events-none absolute z-20 rounded-xl border border-[#E0E0DA] bg-white p-3 shadow-lg transition-transform text-xs"
              style={{
                left: `${Math.min(Math.max((hoveredPoint.x / width) * 100, 15), 85)}%`,
                top: `${Math.max(hoveredPoint.y - 70, 10)}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="font-bold text-[#2E4A25] border-b border-[#E0E0DA] pb-1 flex items-center justify-between gap-3">
                <span>{hoveredPoint.data.dateStr}</span>
                <span className="text-[#3F9A4B] font-mono">{hoveredPoint.data.total} ops</span>
              </div>
              <div className="mt-1.5 space-y-1 text-[11px] text-[#505050]">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3F9A4B]" />
                    Spreadsheets:
                  </span>
                  <span className="font-semibold text-[#2E4A25] font-mono">
                    {hoveredPoint.data.spreadsheets}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AAD39C]" />
                    Eligibility:
                  </span>
                  <span className="font-semibold text-[#2E4A25] font-mono">
                    {hoveredPoint.data.eligibility}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#505050]" />
                    Files uploaded:
                  </span>
                  <span className="font-semibold text-[#2E4A25] font-mono">
                    {hoveredPoint.data.files}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart / Breakdown Summary: Operations by Category (4 cols) */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E0E0DA] bg-white p-5 lg:col-span-4 shadow-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#2E4A25] tracking-tight">
              Module Operations
            </span>
            <span className="text-[11px] font-semibold text-[#3F9A4B] bg-[#F8FBF0] px-2 py-0.5 rounded-md border border-[#E0E0DA]">
              {activeRange.toUpperCase()} Total
            </span>
          </div>
          <p className="text-[11px] text-[#505050] mt-0.5">
            Distribution across PMEx core modules
          </p>
        </div>

        {/* Vertical Bar Histogram */}
        <div className="my-4 flex items-end justify-between gap-2.5 h-36 px-2 border-b border-[#E0E0DA]/70 pb-2">
          {currentData.map((d, idx) => {
            const heightPct = maxValue > 0 ? (d.total / maxValue) * 100 : 0;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
              >
                {/* Tooltip on bar */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] font-bold bg-[#2E4A25] text-white px-1.5 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-xs z-10">
                  {d.total}
                </div>

                <div className="w-full rounded-t-md bg-[#F8FBF0] border border-[#E0E0DA] flex flex-col justify-end overflow-hidden h-28 group-hover:border-[#3F9A4B]">
                  <div
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    className="w-full bg-[#3F9A4B] group-hover:bg-[#2E4A25] transition-all rounded-t-sm"
                  />
                </div>
                <span className="text-[10px] text-[#505050] font-medium truncate w-full text-center">
                  {d.dayLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mini KPI Chips under the bar chart (inspired by Vision UI's Active Users footer chips) */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div
            onClick={() => onDrilldown?.('All Spreadsheets')}
            className="rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 hover:border-[#3F9A4B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1 text-[11px] text-[#505050]">
              <FileSpreadsheet className="h-3 w-3 text-[#3F9A4B]" />
              <span className="truncate">Spreadsheets</span>
            </div>
            <p className="mt-1 text-base font-bold text-[#2E4A25] tabular-nums">
              {totalSpreadsheets}
            </p>
          </div>

          <div
            onClick={() => onDrilldown?.('Eligibility')}
            className="rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 hover:border-[#3F9A4B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1 text-[11px] text-[#505050]">
              <FileCheck className="h-3 w-3 text-[#3F9A4B]" />
              <span className="truncate">Eligibility</span>
            </div>
            <p className="mt-1 text-base font-bold text-[#2E4A25] tabular-nums">
              {totalEligibility}
            </p>
          </div>

          <div
            onClick={() => onDrilldown?.('File Manager')}
            className="rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 hover:border-[#3F9A4B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1 text-[11px] text-[#505050]">
              <FolderArchive className="h-3 w-3 text-[#3F9A4B]" />
              <span className="truncate">Files Stored</span>
            </div>
            <p className="mt-1 text-base font-bold text-[#2E4A25] tabular-nums">
              {totalFiles}
            </p>
          </div>

          <div
            onClick={() => onDrilldown?.('Reporting')}
            className="rounded-xl border border-[#E0E0DA] bg-[#F8FBF0] p-2.5 hover:border-[#3F9A4B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1 text-[11px] text-[#505050]">
              <TrendingUp className="h-3 w-3 text-[#3F9A4B]" />
              <span className="truncate">Total Ops</span>
            </div>
            <p className="mt-1 text-base font-bold text-[#2E4A25] tabular-nums">
              {totalOperations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
