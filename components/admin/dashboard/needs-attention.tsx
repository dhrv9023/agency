'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — NEEDS ATTENTION FEED
 * Proactive queue highlighting unreplied leads exceeding the 24-hour SLA threshold
 * ==============================================================================
 */

import React from 'react';
import Link from 'next/link';
import type { Lead } from '@/types/admin';

interface NeedsAttentionProps {
  leads: Lead[];
  onSelectLead?: (lead: Lead) => void;
}

export function NeedsAttention({ leads, onSelectLead }: NeedsAttentionProps) {
  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Needs Attention</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Inbound inquiries awaiting response &gt; 24 hours
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          {leads.length} Critical
        </span>
      </div>

      <div className="space-y-3 my-1">
        {leads.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <i className="fa-solid fa-circle-check text-2xl text-[#10b981] mb-2 block" />
            <p className="text-xs font-medium text-gray-300">All Inbound Inquiries Responded</p>
            <p className="text-[11px] text-gray-500 font-mono mt-0.5">
              100% SLA compliance across current window
            </p>
          </div>
        ) : (
          leads.map((lead) => {
            const hoursAgo = Math.floor(
              (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60)
            );

            return (
              <div
                key={lead.id}
                className="p-3.5 rounded-lg bg-[#11131a] border border-amber-500/20 hover:border-amber-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                      {lead.name}
                    </span>
                    {lead.company && (
                      <span className="text-xs text-gray-400 truncate">
                        • {lead.company}
                      </span>
                    )}
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/30 shrink-0">
                      {hoursAgo}h ago
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-1 max-w-xl">
                    "{lead.message}"
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-gray-500">
                    <span className="text-[#00f0ff]">{lead.budgetRange}</span>
                    <span>•</span>
                    <span>{lead.serviceInterest}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {onSelectLead ? (
                    <button
                      onClick={() => onSelectLead(lead)}
                      className="px-3 py-1.5 rounded bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    >
                      Reply Now
                    </button>
                  ) : (
                    <Link
                      href={`/admin/leads?selected=${lead.id}&action=reply`}
                      className="px-3 py-1.5 rounded bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    >
                      Reply Now
                    </Link>
                  )}
                  <Link
                    href={`/admin/leads?selected=${lead.id}`}
                    className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] font-mono text-gray-500 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <span>SLA Target: &lt; 2 hours</span>
        <Link href="/admin/leads" className="text-[#00f0ff] hover:underline">
          View all {leads.length} in CRM →
        </Link>
      </div>
    </div>
  );
}
