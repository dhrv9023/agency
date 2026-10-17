'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — LEAD DETAIL DRAWER
 * Comprehensive slide-over inspector for lead records, internal notes, and audit history
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  getLeadDetailAction,
  updateLeadStageAction,
  addLeadNoteAction,
} from '@/server/actions/leads';
import type { Lead, LeadNote, LeadStatusHistory, LeadStage, LeadPriority } from '@/types/admin';

interface LeadDrawerProps {
  isOpen: boolean;
  leadId: string | null;
  onClose: () => void;
  onUpdateLead?: (updatedLead: Lead) => void;
  onDeleteLead?: (leadId: string) => void;
  onOpenReplyModal?: (lead: Lead) => void;
}

const STAGES: { id: LeadStage; label: string }[] = [
  { id: 'NEW', label: 'New' },
  { id: 'CONTACTED', label: 'Contacted' },
  { id: 'QUALIFIED', label: 'Qualified' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { id: 'WON', label: 'Won Deal' },
  { id: 'LOST', label: 'Lost / Closed' },
];

export function LeadDrawer({
  isOpen,
  leadId,
  onClose,
  onUpdateLead,
  onDeleteLead,
  onOpenReplyModal,
}: LeadDrawerProps) {
  const [data, setData] = useState<{
    lead: Lead;
    notes: LeadNote[];
    history: LeadStatusHistory[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'NOTES' | 'HISTORY'>('OVERVIEW');

  // Load lead details on ID change
  useEffect(() => {
    if (!isOpen || !leadId) {
      setData(null);
      return;
    }

    let active = true;
    setIsLoading(true);

    getLeadDetailAction(leadId)
      .then((res) => {
        if (active && res) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching lead detail', err);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, leadId]);

  if (!isOpen || !leadId) return null;

  const handleStageChange = async (newStage: LeadStage) => {
    if (!data) return;
    try {
      const updated = await updateLeadStageAction(data.lead.id, newStage);
      setData((prev) =>
        prev
          ? {
              ...prev,
              lead: updated,
              history: [
                {
                  id: `hist_${Date.now()}`,
                  leadId: updated.id,
                  fromStage: prev.lead.stage,
                  toStage: newStage,
                  changedById: 'current_user',
                  changedByName: 'Operator',
                  notes: `Stage changed to ${newStage}`,
                  createdAt: new Date().toISOString(),
                },
                ...prev.history,
              ],
            }
          : null
      );
      if (onUpdateLead) onUpdateLead(updated);
    } catch (err) {
      console.error('Failed to update lead stage', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !newNoteContent.trim()) return;

    setIsAddingNote(true);
    try {
      const createdNote = await addLeadNoteAction(data.lead.id, newNoteContent);
      setData((prev) =>
        prev
          ? {
              ...prev,
              notes: [createdNote, ...prev.notes],
              lead: {
                ...prev.lead,
                notesCount: prev.lead.notesCount + 1,
              },
            }
          : null
      );
      setNewNoteContent('');
      setIsAddingNote(false);
    } catch (err) {
      console.error('Failed to add note', err);
      setIsAddingNote(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0c0d12] border-l border-[rgba(255,255,255,0.12)] h-full overflow-y-auto text-white flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !data ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
            <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
            <span>Fetching prospect dossier...</span>
          </div>
        ) : (
          <>
            {/* Drawer Header */}
            <div className="p-6 border-b border-[rgba(255,255,255,0.08)] bg-[#11131a]/80 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    LEAD DOSSIER // {data.lead.id}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-sm" />
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">{data.lead.name}</h2>
                  <p className="text-sm text-gray-300 font-medium mt-0.5">
                    {data.lead.company || 'Private Organization'}
                  </p>
                </div>

                {/* Stage Selector Dropdown */}
                <select
                  value={data.lead.stage}
                  onChange={(e) => handleStageChange(e.target.value as LeadStage)}
                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#11131a] text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => onOpenReplyModal && onOpenReplyModal(data.lead)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  <i className="fa-solid fa-reply text-xs" />
                  <span>Reply via Email</span>
                </button>
                <a
                  href={`mailto:${data.lead.email}`}
                  className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-envelope" />
                  <span>Mailto</span>
                </a>
                {onDeleteLead && (
                  <button
                    onClick={() => onDeleteLead(data.lead.id)}
                    className="py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition-colors"
                  >
                    <i className="fa-solid fa-trash-can" />
                  </button>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-4 mt-5 pt-1 text-xs font-mono">
                {(['OVERVIEW', 'NOTES', 'HISTORY'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-1.5 border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'OVERVIEW' && 'Overview'}
                    {tab === 'NOTES' && `Internal Notes (${data.notes.length})`}
                    {tab === 'HISTORY' && `Audit Log (${data.history.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 flex-1 space-y-6">
              {activeTab === 'OVERVIEW' && (
                <>
                  {/* Contact Credentials */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#11131a] border border-white/5 text-xs">
                    <div>
                      <span className="text-gray-500 font-mono text-[10px] uppercase block">
                        Work Email
                      </span>
                      <a
                        href={`mailto:${data.lead.email}`}
                        className="text-[#00f0ff] hover:underline font-medium break-all"
                      >
                        {data.lead.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500 font-mono text-[10px] uppercase block">
                        Direct Phone
                      </span>
                      <span className="text-gray-200">{data.lead.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-mono text-[10px] uppercase block">
                        Budget Range
                      </span>
                      <span className="text-[#10b981] font-semibold">
                        {data.lead.budgetRange || 'Unspecified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-mono text-[10px] uppercase block">
                        Service Interest
                      </span>
                      <span className="text-gray-200 font-medium">
                        {data.lead.serviceInterest || 'General Automation'}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Inbound Requirements Specification
                    </h4>
                    <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                      {data.lead.message}
                    </div>
                  </div>

                  {/* Acquisition & Attribution Telemetry */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Acquisition Attribution & UTM
                    </h4>
                    <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Converted On Page:</span>
                        <span className="text-[#00f0ff]">{data.lead.convertedOnPage || '/'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">UTM Source:</span>
                        <span className="text-gray-200">{data.lead.utmSource || 'direct'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">UTM Medium:</span>
                        <span className="text-gray-200">{data.lead.utmMedium || 'none'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">UTM Campaign:</span>
                        <span className="text-gray-200">{data.lead.utmCampaign || 'organic'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Inbound Timestamp:</span>
                        <span className="text-gray-400">
                          {new Date(data.lead.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'NOTES' && (
                <div className="space-y-4">
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={3}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Add an internal note with @mention or timestamp..."
                      className="w-full p-3 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-sans resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isAddingNote || !newNoteContent.trim()}
                        className="px-3 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors disabled:opacity-50"
                      >
                        {isAddingNote ? 'Saving...' : 'Add Note'}
                      </button>
                    </div>
                  </form>

                  {/* Notes Timeline */}
                  <div className="space-y-3 pt-2">
                    {data.notes.length === 0 ? (
                      <p className="text-xs text-gray-500 font-mono py-4 text-center">
                        No internal notes recorded yet.
                      </p>
                    ) : (
                      data.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3.5 rounded-lg bg-[#11131a] border border-white/5 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-white font-semibold">{note.authorName}</span>
                            <span className="text-gray-500">
                              {new Date(note.createdAt).toLocaleString([], {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                          <p className="text-gray-300 leading-relaxed font-sans">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'HISTORY' && (
                <div className="space-y-3 font-mono text-xs">
                  {data.history.length === 0 ? (
                    <p className="text-gray-500 py-4 text-center">No stage transitions logged.</p>
                  ) : (
                    data.history.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3 rounded-lg bg-[#11131a] border border-white/5 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400">
                            {hist.fromStage} →{' '}
                            <span className="text-[#00f0ff] font-bold">{hist.toStage}</span>
                          </span>
                          <span className="text-gray-500">
                            {new Date(hist.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-[11px] font-sans">{hist.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
