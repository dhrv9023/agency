'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — TIME-SERIES AREA CHART (LEADS OVER TIME)
 * High-performance SVG area chart with cubic bezier interpolation and hover tooltips
 * ==============================================================================
 */

import React, { useState } from 'react';

interface DataPoint {
  date: string;
  leads: number;
  qualified: number;
}

interface LeadsChartProps {
  data: DataPoint[];
}

export function LeadsChart({ data }: LeadsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 font-mono text-xs">
        No telemetry points recorded
      </div>
    );
  }

  // Chart dimensions & scaling
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 35, left: 40 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.leads), 6);

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - (val / maxVal) * chartH;

  // Build SVG Path for Total Leads (Area + Line)
  const leadsPoints = data.map((d, i) => `${getX(i)},${getY(d.leads)}`).join(' ');
  const qualifiedPoints = data.map((d, i) => `${getX(i)},${getY(d.qualified)}`).join(' ');

  const areaPath = `M ${getX(0)},${getY(0)} L ${leadsPoints.split(' ').join(' L ')} L ${getX(
    data.length - 1
  )},${getY(0)} Z`;

  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between relative">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Leads Over Time</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Inbound prospect volume vs. discovery-qualified conversions
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            <span className="text-gray-300">Total Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-gray-300">Qualified</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Linear Gradient for Leads Area */}
            <linearGradient id="leadsAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const yPos = padding.top + chartH * pct;
            const gridVal = Math.round(maxVal * (1 - pct));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={width - padding.right}
                  y2={yPos}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="fill-gray-500 text-[10px] font-mono"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <polygon points={`${getX(0)},${getY(0)} ${leadsPoints} ${getX(data.length - 1)},${getY(0)}`} fill="url(#leadsAreaGradient)" />

          {/* Total Leads Line (Cyan) */}
          <polyline
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={leadsPoints}
            filter="url(#cyanGlow)"
          />

          {/* Qualified Leads Line (Emerald) */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
            points={qualifiedPoints}
          />

          {/* Data Points & Interactive Hover Targets */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cyLeads = getY(d.leads);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Invisible hover hitbox */}
                <rect
                  x={cx - (chartW / (data.length - 1)) / 2}
                  y={padding.top}
                  width={chartW / (data.length - 1)}
                  height={chartH}
                  fill="transparent"
                />

                {/* Vertical Cursor Indicator Line */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padding.top}
                    x2={cx}
                    y2={padding.top + chartH}
                    stroke="#00f0ff"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Leads Node Circle */}
                <circle
                  cx={cx}
                  cy={cyLeads}
                  r={isHovered ? 5.5 : 3.5}
                  className="transition-all duration-150"
                  fill="#0c0d12"
                  stroke="#00f0ff"
                  strokeWidth="2"
                />

                {/* X-Axis Date Labels */}
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  className={`text-[10px] font-mono transition-colors ${
                    isHovered ? 'fill-[#00f0ff] font-bold' : 'fill-gray-500'
                  }`}
                >
                  {d.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {hoveredData && hoveredIndex !== null && (
          <div
            className="absolute pointer-events-none -top-1 bg-[#11131a]/95 border border-[rgba(255,255,255,0.15)] shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(0,240,255,0.1)] rounded-lg p-2.5 text-xs font-mono z-20 backdrop-blur-md transition-all duration-100"
            style={{
              left: `${(hoveredIndex / (data.length - 1)) * 80 + 10}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-gray-400 font-semibold mb-1 text-[11px]">
              {hoveredData.date}
            </div>
            <div className="flex items-center justify-between gap-4 text-white">
              <span className="flex items-center gap-1.5 text-[#00f0ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                Inbound Leads:
              </span>
              <span className="font-bold">{hoveredData.leads}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-gray-300 mt-1">
              <span className="flex items-center gap-1.5 text-[#10b981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                Qualified:
              </span>
              <span className="font-bold">{hoveredData.qualified}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
