'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — LEAD SOURCE DONUT BREAKDOWN
 * Segmented SVG donut chart with interactive hover focal stats and channel list
 * ==============================================================================
 */

import React, { useState } from 'react';

interface SourceSegment {
  source: string;
  count: number;
  percentage: number;
  colorHex: string;
}

interface SourceDonutProps {
  data: SourceSegment[];
}

export function SourceDonut({ data }: SourceDonutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  // SVG Donut geometry
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeSegment = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white tracking-tight">Lead Source Breakdown</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Inbound acquisition attribution channels
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
        {/* SVG Donut Circle */}
        <div className="relative w-[180px] h-[180px] shrink-0 flex items-center justify-center select-none">
          <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {/* Background track circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {data.map((seg, i) => {
              const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += seg.percentage;
              const isHovered = hoveredIndex === i;

              return (
                <circle
                  key={seg.source}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={seg.colorHex}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Focal Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeSegment ? (
              <>
                <span className="text-xl font-bold font-mono text-white leading-tight">
                  {activeSegment.percentage}%
                </span>
                <span className="text-[10px] font-mono text-gray-400 truncate max-w-[100px] px-1">
                  {activeSegment.count} Leads
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold font-mono text-white leading-tight">
                  {total}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Total Leads
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map((seg, i) => {
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={seg.source}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  isHovered ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.colorHex }}
                  />
                  <span className="truncate">{seg.source}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono text-right">
                  <span className="text-gray-400">{seg.count}</span>
                  <span className="font-semibold text-white w-8">{seg.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] font-mono text-gray-500 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <span>Attribution coverage</span>
        <span className="text-[#10b981]">100% telemetry verified</span>
      </div>
    </div>
  );
}
