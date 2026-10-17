'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — LEAD LIST TABLE
 * Stripe / Linear density interactive data table with column sorting and selection
 * ==============================================================================
 */

import React from 'react';
import type { Lead, LeadStage, LeadPriority } from '@/types/admin';

interface LeadTableProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onSelectLead: (lead: Lead) => void;
  onOpenReplyModal: (lead: Lead) => void;
}

const STAGE_BADGES: Record<LeadStage, { label: string; class: string }> = {
  NEW: { label: 'New', class: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30' },
  CONTACTED: { label: 'Contacted', class: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30' },
  QUALIFIED: { label: 'Qualified', class: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' },
  PROPOSAL_SENT: { label: 'Proposal Sent', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  WON: { label: 'Won Deal', class: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40' },
  LOST: { label: 'Lost / Closed', class: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

const PRIORITY_BADGES: Record<LeadPriority, { label: string; dot: string }> = {
  LOW: { label: 'Low', dot: 'bg-gray-500' },
  MEDIUM: { label: 'Medium', dot: 'bg-blue-400' },
  HIGH: { label: 'High', dot: 'bg-amber-400' },
  URGENT: { label: 'Urgent', dot: 'bg-red-500 animate-pulse' },
};

export function LeadTable({
  leads,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onSelectLead,
  onOpenReplyModal,
}: LeadTableProps) {
  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-black/10 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0c0d12] shadow-sm">
      <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300 font-sans border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-50 dark:bg-[#11131a] text-gray-600 dark:text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-black/10 dark:border-[rgba(255,255,255,0.08)] select-none">
          <tr>
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="w-4 h-4 rounded bg-white dark:bg-[#171a24] border-gray-300 dark:border-white/20 text-[#00f0ff] focus:ring-0 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 font-semibold">Prospect / Company</th>
            <th className="py-3 px-4 font-semibold">Budget Range</th>
            <th className="py-3 px-4 font-semibold">Service Interest</th>
            <th className="py-3 px-4 font-semibold">Pipeline Stage</th>
            <th className="py-3 px-4 font-semibold">Priority</th>
            <th className="py-3 px-4 font-semibold">Source Attribution</th>
            <th className="py-3 px-4 font-semibold">Received</th>
            <th className="py-3 px-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-black/5 dark:divide-[rgba(255,255,255,0.06)]">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-gray-500 font-mono">
                No matching leads found in current filter view.
              </td>
            </tr>
          ) : (
            leads.map((lead) => {
              const isSelected = selectedIds.includes(lead.id);
              const stageBadge = STAGE_BADGES[lead.stage] || STAGE_BADGES.NEW;
              const priorityBadge = PRIORITY_BADGES[lead.priority] || PRIORITY_BADGES.MEDIUM;
              const dateStr = new Date(lead.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected ? 'bg-sky-50 dark:bg-[#00f0ff]/5' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(lead.id)}
                      className="w-4 h-4 rounded bg-white dark:bg-[#171a24] border-gray-300 dark:border-white/20 text-[#00f0ff] focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Prospect & Company */}
                  <td className="py-3 px-4 min-w-[200px]">
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#00f0ff] transition-colors truncate">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {lead.company || lead.email}
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-3 px-4 font-mono text-emerald-600 dark:text-[#10b981] font-medium whitespace-nowrap">
                    {lead.budgetRange || '$10k-$25k'}
                  </td>

                  {/* Service */}
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300 max-w-[180px] truncate">
                    {lead.serviceInterest || 'Automation Workflows'}
                  </td>

                  {/* Stage */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${stageBadge.class}`}
                    >
                      {stageBadge.label}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${priorityBadge.dot}`} />
                      <span>{priorityBadge.label}</span>
                    </div>
                  </td>

                  {/* Attribution */}
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    <span className="text-gray-300">{lead.utmSource || 'direct'}</span>
                    <span className="text-gray-500 block text-[10px]">
                      {lead.convertedOnPage || '/'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    {dateStr}
                  </td>

                  {/* Quick Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Reply via Email"
                        onClick={() => onOpenReplyModal(lead)}
                        className="w-7 h-7 rounded-md bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center transition-colors"
                      >
                        <i className="fa-solid fa-reply text-[11px]" />
                      </button>
                      <button
                        title="Inspect Lead Dossier"
                        onClick={() => onSelectLead(lead)}
                        className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <i className="fa-solid fa-chevron-right text-[11px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
