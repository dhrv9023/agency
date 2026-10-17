'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — GLOBAL ADMIN LOADING SKELETON
 * High-density animated skeleton loader preventing layout shift during route navigation
 * ==============================================================================
 */

import React from 'react';

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse select-none" aria-busy="true" aria-label="Loading console">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="space-y-2">
          <div className="w-40 h-3 rounded bg-white/10" />
          <div className="w-72 h-7 rounded bg-white/15" />
          <div className="w-96 h-3.5 rounded bg-white/5" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-9 rounded-lg bg-white/10" />
          <div className="w-32 h-9 rounded-lg bg-white/15" />
        </div>
      </div>

      {/* KPI Cards Skeleton (6 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.06)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-2.5 rounded bg-white/10" />
              <div className="w-7 h-7 rounded-lg bg-white/10" />
            </div>
            <div className="w-24 h-8 rounded bg-white/20" />
            <div className="w-full h-2 rounded bg-white/5" />
          </div>
        ))}
      </div>

      {/* Chart Canvas Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-36 h-4 rounded bg-white/15" />
            <div className="w-28 h-3 rounded bg-white/10" />
          </div>
          <div className="h-64 rounded-lg bg-white/5 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <i className="fa-solid fa-circle-notch fa-spin text-sm text-[#00f0ff]" />
              <span>Calibrating telemetry buffers...</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.06)] space-y-4">
          <div className="w-32 h-4 rounded bg-white/15" />
          <div className="h-64 rounded-lg bg-white/5 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-white/5 border-t-[#00f0ff] animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
