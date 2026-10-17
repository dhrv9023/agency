'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — DASHBOARD KPI CARD
 * Compact, dense metric card with percentage trends and comparison deltas
 * ==============================================================================
 */

import React from 'react';
import type { KPICardData } from '@/types/admin';

interface KPICardProps {
  data: KPICardData;
  icon: string;
  accentColor?: string;
}

export function KPICard({ data, icon, accentColor = '#00f0ff' }: KPICardProps) {
  const isTrendUp = data.trend === 'up';

  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-all duration-200 group relative overflow-hidden">
      {/* Subtle top indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-medium">
          {data.title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <i className={`fa-solid ${icon}`} />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
          {data.formattedValue}
        </div>

        {/* Trend Indicator Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
            data.isPositive
              ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
              : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}
        >
          <i
            className={`fa-solid ${
              isTrendUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
            } text-[10px]`}
          />
          <span>{data.percentageChange > 0 ? `+${data.percentageChange}%` : `${data.percentageChange}%`}</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-500">
        <span>vs previous window</span>
        <span className="text-gray-400">{data.previousValue}</span>
      </div>
    </div>
  );
}
