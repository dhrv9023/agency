'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: LEADS & CRM
 * Inbound lead processing, Kanban pipeline mutations, notes, and activity tracking
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type {
  Lead,
  LeadStage,
  LeadPriority,
  LeadNote,
  LeadStatusHistory,
  KanbanState,
  KanbanColumn,
  LeadTag,
} from '@/types/admin';

// Live In-Memory Pipeline Storage — Zero Mock Data
let leadsStore: Lead[] = [];
let notesStore: Record<string, LeadNote[]> = {};
let historyStore: Record<string, LeadStatusHistory[]> = {};

export interface LeadFilterParams {
  query?: string;
  stage?: LeadStage | 'ALL';
  priority?: LeadPriority | 'ALL';
  service?: string;
  sortBy?: 'createdAt' | 'name' | 'company' | 'budgetRange' | 'stage';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface GetLeadsResult {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  kanban: KanbanState;
}

/**
 * Fetch filtered, searched, and sorted leads + computed Kanban board state
 */
export async function getLeadsAction(params: LeadFilterParams = {}): Promise<GetLeadsResult> {
  const session = assertPermission(await getSession(), 'leads', 'view');

  const {
    query = '',
    stage = 'ALL',
    priority = 'ALL',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 20,
  } = params;

  let filtered = [...leadsStore];

  // Search filter across name, email, company, and message
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        l.message.toLowerCase().includes(q)
    );
  }

  // Stage filter
  if (stage !== 'ALL') {
    filtered = filtered.filter((l) => l.stage === stage);
  }

  // Priority filter
  if (priority !== 'ALL') {
    filtered = filtered.filter((l) => l.priority === priority);
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    if (sortBy === 'createdAt') {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedLeads = filtered.slice(startIndex, startIndex + pageSize);

  // Build Kanban state
  const stageColumns: Record<LeadStage, KanbanColumn> = {
    NEW: { id: 'NEW', title: 'New Leads', colorHex: '#00f0ff', leadIds: [] },
    CONTACTED: { id: 'CONTACTED', title: 'Contacted', colorHex: '#38bdf8', leadIds: [] },
    QUALIFIED: { id: 'QUALIFIED', title: 'Qualified', colorHex: '#10b981', leadIds: [] },
    PROPOSAL_SENT: { id: 'PROPOSAL_SENT', title: 'Proposal Sent', colorHex: '#f59e0b', leadIds: [] },
    WON: { id: 'WON', title: 'Won Deals', colorHex: '#10b981', leadIds: [] },
    LOST: { id: 'LOST', title: 'Lost / Closed', colorHex: '#f43f5e', leadIds: [] },
  };

  const leadsById: Record<string, Lead> = {};

  leadsStore.forEach((lead) => {
    leadsById[lead.id] = lead;
    if (stageColumns[lead.stage]) {
      stageColumns[lead.stage].leadIds.push(lead.id);
    }
  });

  return {
    leads: paginatedLeads,
    total,
    page,
    pageSize,
    kanban: {
      columns: stageColumns,
      leadsById,
    },
  };
}

/**
 * Fetch detailed lead record including internal notes and stage transition audit
 */
export async function getLeadDetailAction(id: string): Promise<{
  lead: Lead;
  notes: LeadNote[];
  history: LeadStatusHistory[];
} | null> {
  const session = assertPermission(await getSession(), 'leads', 'view');

  const lead = leadsStore.find((l) => l.id === id);
  if (!lead) return null;

  const notes = notesStore[id] || [];
  const history = historyStore[id] || [];

  return { lead, notes, history };
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  budgetRange?: string;
  serviceInterest?: string;
  message: string;
  priority?: LeadPriority;
  stage?: LeadStage;
}

/**
 * Manually register a new inbound lead or CRM prospect
 */
export async function createLeadAction(input: CreateLeadInput): Promise<Lead> {
  const session = assertPermission(await getSession(), 'leads', 'create');

  const newLead: Lead = {
    id: `lead_${Date.now().toString(36)}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    company: input.company?.trim() || null,
    website: input.website?.trim() || null,
    budgetRange: input.budgetRange || '$10,000 - $25,000',
    serviceInterest: input.serviceInterest || 'AI Automation Workflows',
    message: input.message.trim(),
    stage: input.stage || 'NEW',
    priority: input.priority || 'MEDIUM',
    isSpam: false,
    utmSource: 'manual_entry',
    utmMedium: 'admin_console',
    utmCampaign: null,
    convertedOnPage: '/admin/leads',
    referrerUrl: null,
    assignedToId: session.user.id,
    assignedToName: session.user.name,
    assignedToAvatar: session.user.avatarUrl,
    lastContactedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [{ id: `tag_${Date.now()}`, name: 'Manual Add', colorHex: '#00f0ff' }],
    notesCount: 0,
    attachmentsCount: 0,
  };

  leadsStore.unshift(newLead);
  notesStore[newLead.id] = [];
  historyStore[newLead.id] = [
    {
      id: `hist_${Date.now()}`,
      leadId: newLead.id,
      fromStage: 'NEW',
      toStage: newLead.stage,
      changedById: session.user.id,
      changedByName: session.user.name,
      notes: 'Lead created via Admin Console',
      createdAt: new Date().toISOString(),
    },
  ];

  return newLead;
}

/**
 * Update a lead stage (Kanban drag-and-drop or status selector) with audit log
 */
export async function updateLeadStageAction(id: string, newStage: LeadStage): Promise<Lead> {
  const session = assertPermission(await getSession(), 'leads', 'edit');

  const leadIndex = leadsStore.findIndex((l) => l.id === id);
  if (leadIndex === -1) throw new Error('Lead not found.');

  const previousStage = leadsStore[leadIndex].stage;
  leadsStore[leadIndex] = {
    ...leadsStore[leadIndex],
    stage: newStage,
    updatedAt: new Date().toISOString(),
    lastContactedAt:
      newStage !== 'NEW' ? new Date().toISOString() : leadsStore[leadIndex].lastContactedAt,
  };

  if (!historyStore[id]) historyStore[id] = [];
  historyStore[id].unshift({
    id: `hist_${Date.now()}`,
    leadId: id,
    fromStage: previousStage,
    toStage: newStage,
    changedById: session.user.id,
    changedByName: session.user.name,
    notes: `Stage changed from ${previousStage} to ${newStage}`,
    createdAt: new Date().toISOString(),
  });

  return leadsStore[leadIndex];
}

/**
 * Append an internal operational note to a lead
 */
export async function addLeadNoteAction(leadId: string, content: string): Promise<LeadNote> {
  const session = assertPermission(await getSession(), 'leads', 'edit');

  if (!content.trim()) throw new Error('Note content cannot be empty.');

  const newNote: LeadNote = {
    id: `note_${Date.now()}`,
    leadId,
    authorId: session.user.id,
    authorName: session.user.name,
    authorAvatar: session.user.avatarUrl,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!notesStore[leadId]) notesStore[leadId] = [];
  notesStore[leadId].unshift(newNote);

  // Increment lead's notesCount
  const leadIndex = leadsStore.findIndex((l) => l.id === leadId);
  if (leadIndex !== -1) {
    leadsStore[leadIndex] = {
      ...leadsStore[leadIndex],
      notesCount: (leadsStore[leadIndex].notesCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    };
  }

  return newNote;
}

/**
 * Permanently delete a lead record with RBAC assertion
 */
export async function deleteLeadAction(id: string): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'leads', 'delete');

  leadsStore = leadsStore.filter((l) => l.id !== id);
  delete notesStore[id];
  delete historyStore[id];

  return { success: true };
}

/**
 * Bulk updates for selected leads (e.g. bulk stage change, mark as spam)
 */
export async function bulkUpdateLeadsAction(
  ids: string[],
  updates: { stage?: LeadStage; isSpam?: boolean }
): Promise<{ success: boolean; count: number }> {
  const session = assertPermission(await getSession(), 'leads', 'edit');

  let updatedCount = 0;
  leadsStore = leadsStore.map((lead) => {
    if (ids.includes(lead.id)) {
      updatedCount++;
      return {
        ...lead,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return lead;
  });

  return { success: true, count: updatedCount };
}

/**
 * Bulk deletion of selected leads
 */
export async function bulkDeleteLeadsAction(
  ids: string[]
): Promise<{ success: boolean; count: number }> {
  const session = assertPermission(await getSession(), 'leads', 'delete');

  const initialCount = leadsStore.length;
  leadsStore = leadsStore.filter((l) => !ids.includes(l.id));
  ids.forEach((id) => {
    delete notesStore[id];
    delete historyStore[id];
  });

  return { success: true, count: initialCount - leadsStore.length };
}
