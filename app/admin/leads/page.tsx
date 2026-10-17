'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — LEADS & CRM MANAGEMENT PLATFORM
 * Dual-view Table & Kanban pipeline, optimistic drag-and-drop, and bulk operations
 * ==============================================================================
 */

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getLeadsAction,
  updateLeadStageAction,
  deleteLeadAction,
  bulkUpdateLeadsAction,
  bulkDeleteLeadsAction,
  type LeadFilterParams,
} from '@/server/actions/leads';
import { LeadTable } from '@/components/admin/leads/lead-table';
import { LeadKanban } from '@/components/admin/leads/lead-kanban';
import { LeadDrawer } from '@/components/admin/leads/lead-drawer';
import { CreateLeadModal } from '@/components/admin/leads/create-lead-modal';
import { EmailReplyModal } from '@/components/admin/leads/email-reply-modal';
import { ConfirmDialog } from '@/components/admin/leads/confirm-dialog';
import { generateLeadsCsv, downloadCsvFile } from '@/lib/export/csv';
import type { Lead, LeadStage, LeadPriority, KanbanState } from '@/types/admin';

type ViewMode = 'table' | 'kanban';

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action');
  const selectedLeadIdParam = searchParams.get('selected');

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<LeadStage | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<LeadPriority | 'ALL'>('ALL');

  // Leads Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [kanban, setKanban] = useState<KanbanState>({
    columns: {
      NEW: { id: 'NEW', title: 'New Leads', colorHex: '#00f0ff', leadIds: [] },
      CONTACTED: { id: 'CONTACTED', title: 'Contacted', colorHex: '#38bdf8', leadIds: [] },
      QUALIFIED: { id: 'QUALIFIED', title: 'Qualified', colorHex: '#10b981', leadIds: [] },
      PROPOSAL_SENT: { id: 'PROPOSAL_SENT', title: 'Proposal Sent', colorHex: '#f59e0b', leadIds: [] },
      WON: { id: 'WON', title: 'Won Deals', colorHex: '#10b981', leadIds: [] },
      LOST: { id: 'LOST', title: 'Lost / Closed', colorHex: '#f43f5e', leadIds: [] },
    },
    leadsById: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(initialAction === 'new');
  const [replyModalLead, setReplyModalLead] = useState<Lead | null>(null);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Kanban Board Builder
  const buildKanban = (leadsList: Lead[]): KanbanState => {
    const columns: Record<LeadStage, { id: LeadStage; title: string; colorHex: string; leadIds: string[] }> = {
      NEW: { id: 'NEW', title: 'New Leads', colorHex: '#00f0ff', leadIds: [] },
      CONTACTED: { id: 'CONTACTED', title: 'Contacted', colorHex: '#38bdf8', leadIds: [] },
      QUALIFIED: { id: 'QUALIFIED', title: 'Qualified', colorHex: '#10b981', leadIds: [] },
      PROPOSAL_SENT: { id: 'PROPOSAL_SENT', title: 'Proposal Sent', colorHex: '#f59e0b', leadIds: [] },
      WON: { id: 'WON', title: 'Won Deals', colorHex: '#10b981', leadIds: [] },
      LOST: { id: 'LOST', title: 'Lost / Closed', colorHex: '#f43f5e', leadIds: [] },
    };
    const leadsById: Record<string, Lead> = {};

    leadsList.forEach((lead) => {
      const stage = columns[lead.stage] ? lead.stage : 'NEW';
      columns[stage].leadIds.push(lead.id);
      leadsById[lead.id] = lead;
    });

    return { columns, leadsById };
  };

  // Helper to read leads from localStorage
  const getLocalLeads = (): Lead[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('agency_leads');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((l) => l && l.name && !l.name.includes('Marcus Vance') && !l.name.includes('Dr. Evelyn Reed'))
        .map((l, idx) => {
          let stage: LeadStage = 'NEW';
          if (l.status === 'Closed Won' || l.stage === 'WON') stage = 'WON';
          else if (l.status === 'Discovery Booked' || l.stage === 'QUALIFIED') stage = 'QUALIFIED';
          else if (l.stage === 'CONTACTED') stage = 'CONTACTED';
          else if (l.stage === 'PROPOSAL_SENT') stage = 'PROPOSAL_SENT';
          else if (l.stage === 'LOST') stage = 'LOST';

          return {
            id: l.id || `lead_loc_${idx}_${Date.now()}`,
            name: l.name,
            email: l.email || '',
            phone: l.phone || null,
            company: l.company || null,
            website: null,
            budgetRange: l.budget || l.budgetRange || null,
            serviceInterest: l.service || l.serviceInterest || null,
            message: l.message || '',
            stage,
            priority: (l.priority as LeadPriority) || 'HIGH',
            isSpam: false,
            utmSource: l.source || 'Website Form',
            utmMedium: null,
            utmCampaign: null,
            convertedOnPage: null,
            referrerUrl: null,
            assignedToId: null,
            assignedToName: null,
            assignedToAvatar: null,
            lastContactedAt: null,
            createdAt: l.date ? new Date(l.date).toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
            notesCount: 0,
            attachmentsCount: 0,
          };
        });
    } catch {
      return [];
    }
  };

  // Load Leads from localStorage + Server Action
  const loadLeads = () => {
    const local = getLocalLeads();
    if (local.length > 0) {
      setLeads(local);
      setKanban(buildKanban(local));
      setIsLoading(false);
    }

    const params: LeadFilterParams = {
      query: searchQuery,
      stage: stageFilter === 'ALL' ? undefined : stageFilter,
      priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
      pageSize: 100,
    };

    getLeadsAction(params)
      .then((res) => {
        const map = new Map<string, Lead>();
        local.forEach((l) => map.set(l.id, l));
        res.leads.forEach((l) => map.set(l.id, l));
        const merged = Array.from(map.values());
        setLeads(merged);
        setKanban(buildKanban(merged));
        setIsLoading(false);

        // Check if selected URL param matches a lead
        if (selectedLeadIdParam && !activeLead) {
          const matched = merged.find((l) => l.id === selectedLeadIdParam);
          if (matched) {
            setActiveLead(matched);
            setIsDrawerOpen(true);
          }
        }
      })
      .catch((err) => {
        console.warn('Server leads action fallback to local store:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadLeads();
  }, [searchQuery, stageFilter, priorityFilter]);

  // Handle Drag & Drop Kanban Move with Optimistic Update
  const handleMoveLead = async (leadId: string, newStage: LeadStage) => {
    const previousKanban = { ...kanban };
    const leadToMove = kanban.leadsById[leadId];
    if (!leadToMove || leadToMove.stage === newStage) return;

    // 1. Optimistic Update in State and LocalStorage
    setLeads((prev) => {
      const updated = prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l));
      setKanban(buildKanban(updated));
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('agency_leads');
          if (raw) {
            const parsed = JSON.parse(raw);
            const synced = parsed.map((item: any) =>
              item.id === leadId
                ? {
                    ...item,
                    stage: newStage,
                    status: newStage === 'WON' ? 'Closed Won' : newStage === 'QUALIFIED' ? 'Discovery Booked' : newStage,
                  }
                : item
            );
            localStorage.setItem('agency_leads', JSON.stringify(synced));
          }
        } catch (e) {
          console.warn('Failed syncing to localStorage', e);
        }
      }
      return updated;
    });

    // 2. Persist to Server Action
    try {
      await updateLeadStageAction(leadId, newStage);
    } catch (err) {
      console.warn('Persisting stage change to server failed (using local sync)', err);
    }
  };

  // Row selection toggles
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  // Bulk Actions
  const handleBulkStageChange = async (targetStage: LeadStage) => {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateLeadsAction(selectedIds, { stage: targetStage });
      setSelectedIds([]);
      loadLeads();
    } catch (err) {
      console.error('Bulk stage change failed', err);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${selectedIds.length} Selected Leads?`,
      description:
        'This action is irreversible. All associated internal notes, status histories, and contact records will be permanently removed.',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await bulkDeleteLeadsAction(selectedIds);
        setSelectedIds([]);
        loadLeads();
      },
    });
  };

  // Single Lead Delete
  const handleDeleteSingleLead = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Inbound Lead Record?',
      description: 'This will permanently remove this prospect from the pipeline.',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setLeads((prev) => {
          const updated = prev.filter((l) => l.id !== id);
          setKanban(buildKanban(updated));
          if (typeof window !== 'undefined') {
            try {
              const raw = localStorage.getItem('agency_leads');
              if (raw) {
                const parsed = JSON.parse(raw);
                const filtered = parsed.filter((item: any) => item.id !== id);
                localStorage.setItem('agency_leads', JSON.stringify(filtered));
              }
            } catch (e) {
              console.warn('Failed deleting from localStorage', e);
            }
          }
          return updated;
        });
        setIsDrawerOpen(false);
        setActiveLead(null);
        try {
          await deleteLeadAction(id);
        } catch (e) {
          console.warn('Server delete error', e);
        }
      },
    });
  };

  // Export CSV Handler
  const handleExportCsv = (leadsToExport: Lead[]) => {
    const csvContent = generateLeadsCsv(leadsToExport);
    const filename = `varah_systems_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsvFile(csvContent, filename);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Pipeline Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-black/10 dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
            <span className="text-xs font-mono font-medium text-sky-600 dark:text-[#00f0ff] tracking-wider uppercase">
              CRM ENGINE // ACTIVE PIPELINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Leads & Pipeline Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Capture, qualify, and advance enterprise automation opportunities through the conversion funnel.
          </p>
        </div>

        {/* View Switcher & Primary Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle Button Group */}
          <div className="flex items-center p-1 bg-gray-100 dark:bg-[#11131a] rounded-lg border border-black/10 dark:border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-2 transition-all ${
                viewMode === 'table'
                  ? 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-table-list" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-xs font-mono rounded flex items-center gap-2 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <i className="fa-solid fa-table-columns" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => handleExportCsv(leads)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-xs font-mono transition-colors"
          >
            <i className="fa-solid fa-file-arrow-down text-gray-500 dark:text-gray-400" />
            <span>Export CSV</span>
          </button>

          {/* Create Lead Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <i className="fa-solid fa-plus text-xs" />
            <span>Create Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-[rgba(255,255,255,0.08)] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, company, or message..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff] font-sans"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-600 dark:text-gray-400">
            <span>Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as LeadStage | 'ALL')}
              className="px-2.5 py-1.5 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="WON">Won Deal</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-600 dark:text-gray-400">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as LeadPriority | 'ALL')}
              className="px-2.5 py-1.5 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected in Table view) */}
      {selectedIds.length > 0 && viewMode === 'table' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-white animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="font-semibold text-[#00f0ff]">{selectedIds.length}</span>
            <span className="text-gray-300">leads selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStageChange('CONTACTED')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
            >
              Mark Contacted
            </button>
            <button
              onClick={() => handleBulkStageChange('QUALIFIED')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
            >
              Mark Qualified
            </button>
            <button
              onClick={() => {
                const selectedLeads = leads.filter((l) => selectedIds.includes(l.id));
                handleExportCsv(selectedLeads);
              }}
              className="px-2.5 py-1 text-xs font-mono rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
            >
              Export Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 text-xs font-mono rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Table View or Kanban View */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
          <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
          <span>Synchronizing pipeline records...</span>
        </div>
      ) : viewMode === 'table' ? (
        <LeadTable
          leads={leads}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onSelectLead={(lead) => {
            setActiveLead(lead);
            setIsDrawerOpen(true);
          }}
          onOpenReplyModal={(lead) => setReplyModalLead(lead)}
        />
      ) : (
        <LeadKanban
          kanban={kanban}
          onSelectLead={(lead) => {
            setActiveLead(lead);
            setIsDrawerOpen(true);
          }}
          onMoveLead={handleMoveLead}
        />
      )}

      {/* Slide-Over Lead Detail Drawer */}
      <LeadDrawer
        isOpen={isDrawerOpen}
        leadId={activeLead ? activeLead.id : null}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveLead(null);
        }}
        onUpdateLead={(updated) => {
          setActiveLead(updated);
          loadLeads();
        }}
        onDeleteLead={(id) => handleDeleteSingleLead(id)}
        onOpenReplyModal={(lead) => {
          setIsDrawerOpen(false);
          setReplyModalLead(lead);
        }}
      />

      {/* Manual Inbound Lead Creation Modal */}
      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          setIsCreateModalOpen(false);
          loadLeads();
        }}
      />

      {/* Email Quick-Reply Modal */}
      <EmailReplyModal
        isOpen={!!replyModalLead}
        lead={replyModalLead}
        onClose={() => setReplyModalLead(null)}
        onSent={(leadId) => {
          // Advance lead to CONTACTED automatically on email response
          handleMoveLead(leadId, 'CONTACTED');
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
