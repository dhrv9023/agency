'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — LEAD CONVERSION FUNNEL BY STAGE
 * Visual progression bars showing conversion velocity and drop-off drop rates
 * ==============================================================================
 */

import React from 'react';
import type { LeadStage } from '@/types/admin';

interface FunnelStageItem {
  stage: LeadStage;
  label: string;
  count: number;
  conversionRate: number;
}

interface FunnelChartProps {
  stages: FunnelStageItem[];
}

const STAGE_COLORS: Record<LeadStage, { bar: string; badge: string }> = {
  NEW: { bar: '#00f0ff', badge: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30' },
  CONTACTED: { bar: '#38bdf8', badge: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30' },
  QUALIFIED: { bar: '#10b981', badge: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' },
  PROPOSAL_SENT: { bar: '#f59e0b', badge: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30' },
  WON: { bar: '#10b981', badge: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40' },
  LOST: { bar: '#f43f5e', badge: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

export function FunnelChart({ stages }: FunnelChartProps) {
  const maxCount = stages.length > 0 ? stages[0].count : 1;

  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white tracking-tight">Pipeline Conversion Funnel</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Stage-by-stage qualification velocity & deal retention
        </p>
      </div>

      <div className="space-y-4 my-2">
        {stages.map((stage, i) => {
          const widthPercent = Math.max(12, Math.round((stage.count / maxCount) * 100));
          const color = STAGE_COLORS[stage.stage] || STAGE_COLORS.NEW;
          const prevStage = i > 0 ? stages[i - 1] : null;
          const stepConversion = prevStage ? Math.round((stage.count / prevStage.count) * 100) : 100;

          return (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold">{i + 1}.</span>
                  <span className="text-white font-medium">{stage.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{stage.count} deals</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color.badge}`}>
                    {stage.conversionRate}% of total
                  </span>
                  {prevStage && (
                    <span className="text-[10px] text-gray-500 hidden sm:inline">
                      ({stepConversion}% retention)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: color.bar,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-gray-500 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <span>Average sales velocity</span>
        <span className="text-white font-semibold">14.2 days from Inbound to Won</span>
      </div>
    </div>
  );
}
