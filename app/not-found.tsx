'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — GLOBAL ADMIN 404 NOT FOUND
 * High-density technical 404 state with routing directory and Command Palette trigger.
 * ==============================================================================
 */

import React from 'react';
import Link from 'next/link';

export default function AdminNotFound() {
  const quickLinks = [
    { label: 'Overview', href: '/admin', icon: 'fa-gauge-high', desc: 'KPI metrics & telemetry' },
    { label: 'CRM Pipeline', href: '/admin/leads', icon: 'fa-funnel-dollar', desc: 'Lead stages & conversions' },
    { label: 'CMS Studio', href: '/admin/cms', icon: 'fa-newspaper', desc: 'Articles & case studies' },
    { label: 'Media CDN', href: '/admin/media', icon: 'fa-photo-film', desc: 'Asset library & uploads' },
    { label: 'Analytics', href: '/admin/analytics', icon: 'fa-chart-line', desc: 'Traffic & event streams' },
    { label: 'Settings', href: '/admin/settings', icon: 'fa-sliders', desc: 'RBAC, tokens & webhooks' },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-[#0b0c10] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Technical Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-xs font-mono font-semibold text-[#00f0ff] uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span>HTTP 404 // RESOURCE_DISCONNECTED</span>
        </div>

        {/* Primary Glyph & Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Endpoint Not Located
        </h1>

        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
          The requested administrative route, database record, or console view does not exist or has been shifted in the system registry.
        </p>

        {/* Command Palette Keyboard Hint */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#14161f] border border-[rgba(255,255,255,0.08)] text-xs text-gray-300 font-mono mb-8">
          <i className="fa-solid fa-terminal text-[#00f0ff]" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-[rgba(255,255,255,0.15)] text-[10px] text-white font-mono">
            ⌘K
          </kbd>
          <span>to open the global command palette from any screen</span>
        </div>

        {/* Direct Destination Directory */}
        <div className="text-left mb-8">
          <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-3 px-1">
            Available Operations Modules
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 p-3 rounded-xl bg-[#12141c] hover:bg-[#181b26] border border-[rgba(255,255,255,0.06)] hover:border-[#00f0ff]/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-gray-400 group-hover:text-[#00f0ff] transition-colors shrink-0">
                  <i className={`fa-solid ${item.icon} text-xs`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white group-hover:text-[#00f0ff] transition-colors flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <i className="fa-solid fa-arrow-right text-[9px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg shadow-[#00f0ff]/20"
          >
            <i className="fa-solid fa-gauge-high" />
            <span>Return to Master Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
