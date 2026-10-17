'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — KANBAN PIPELINE BOARD
 * Drag-and-drop opportunity pipeline with optimistic state transitions & volume sums
 * ==============================================================================
 */

import React, { useState } from 'react';
import type { Lead, LeadStage, KanbanState } from '@/types/admin';

interface LeadKanbanProps {
  kanban: KanbanState;
  onSelectLead: (lead: Lead) => void;
  onMoveLead: (leadId: string, newStage: LeadStage) => void;
}

const COLUMN_CONFIG: Array<{ id: LeadStage; title: string; color: string }> = [
  { id: 'NEW', title: 'New Leads', color: '#00f0ff' },
  { id: 'CONTACTED', title: 'Contacted', color: '#38bdf8' },
  { id: 'QUALIFIED', title: 'Qualified', color: '#10b981' },
  { id: 'PROPOSAL_SENT', title: 'Proposal Sent', color: '#f59e0b' },
  { id: 'WON', title: 'Won Deals', color: '#10b981' },
  { id: 'LOST', title: 'Lost / Closed', color: '#f43f5e' },
];

export function LeadKanban({ kanban, onSelectLead, onMoveLead }: LeadKanbanProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<LeadStage | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== stage) {
      setDragOverColumnId(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumnId(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    setDragOverColumnId(null);
    setDraggedLeadId(null);

    if (leadId) {
      onMoveLead(leadId, targetStage);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[650px] overflow-x-auto pb-4">
      {COLUMN_CONFIG.map((col) => {
        const columnData = kanban.columns[col.id];
        const leadIds = columnData ? columnData.leadIds : [];
        const leads = leadIds
          .map((id) => kanban.leadsById[id])
          .filter(Boolean) as Lead[];

        const isOver = dragOverColumnId === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-xl bg-[#0c0d12] border transition-colors ${
              isOver
                ? 'border-[#00f0ff] bg-[#00f0ff]/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                : 'border-[rgba(255,255,255,0.08)]'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-[rgba(255,255,255,0.06)] bg-[#11131a] rounded-t-xl">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <h3 className="text-xs font-semibold text-white truncate">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-gray-300">
                  {leads.length}
                </span>
              </div>
            </div>

            {/* Droppable Card List */}
            <div className="p-2 flex-1 space-y-2.5 overflow-y-auto max-h-[720px] scrollbar-thin">
              {leads.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg text-[11px] font-mono text-gray-600 select-none">
                  Drop lead here
                </div>
              ) : (
                leads.map((lead) => {
                  const isDragging = draggedLeadId === lead.id;
                  const timeAgo = formatTimeAgo(lead.createdAt);

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => onSelectLead(lead)}
                      className={`p-3.5 rounded-lg bg-[#11131a] border border-white/10 hover:border-[#00f0ff]/40 shadow-sm cursor-grab active:cursor-grabbing transition-all group ${
                        isDragging ? 'opacity-40 scale-95' : 'hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Name & Priority */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                          {lead.name}
                        </span>
                        {lead.priority === 'URGENT' ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/30 uppercase shrink-0 animate-pulse">
                            URGENT
                          </span>
                        ) : lead.priority === 'HIGH' ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase shrink-0">
                            HIGH
                          </span>
                        ) : null}
                      </div>

                      {/* Company */}
                      <div className="text-[11px] text-gray-400 truncate mb-2">
                        {lead.company || lead.email}
                      </div>

                      {/* Budget Badge */}
                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5 text-gray-400">
                        <span className="text-[#10b981] font-semibold">{lead.budgetRange}</span>
                        <span className="text-[10px] text-gray-500">{timeAgo}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
