'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — MANUAL LEAD CREATION MODAL
 * High-fidelity prospect capture modal with input validation and pipeline placement
 * ==============================================================================
 */

import React, { useState } from 'react';
import { createLeadAction, type CreateLeadInput } from '@/server/actions/leads';
import type { LeadPriority, LeadStage } from '@/types/admin';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const BUDGET_OPTIONS = [
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
];

const SERVICE_OPTIONS = [
  'AI Automation Workflows',
  'AI Agents & Assistants',
  'CRM & System Integrations',
  'Reporting & Intelligence Systems',
  'Data Extraction & Pipelines',
  'Custom Enterprise Architecture',
];

export function CreateLeadModal({ isOpen, onClose, onCreated }: CreateLeadModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[1]);
  const [serviceInterest, setServiceInterest] = useState(SERVICE_OPTIONS[0]);
  const [priority, setPriority] = useState<LeadPriority>('HIGH');
  const [stage, setStage] = useState<LeadStage>('NEW');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please provide Name, Work Email, and Initial Requirements Message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const input: CreateLeadInput = {
        name,
        email,
        phone,
        company,
        website,
        budgetRange,
        serviceInterest,
        priority,
        stage,
        message,
      };

      await createLeadAction(input);
      setIsSubmitting(false);
      onCreated();
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Failed to register lead';
      setError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <h3 className="text-base font-semibold text-white">Create Inbound Lead</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Add a new prospect to the agency CRM pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-white/5"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client Name"
                className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Client Company Inc."
                className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                Budget Range
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                Primary Service Interest
              </label>
              <select
                value={serviceInterest}
                onChange={(e) => setServiceInterest(e.target.value)}
                className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                {SERVICE_OPTIONS.map((svc) => (
                  <option key={svc} value={svc}>
                    {svc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LeadPriority)}
                className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">
                Initial Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="WON">Won Deal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">
              Requirements / Prospect Message *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detail operational bottleneck, target integrations, and expected outcomes..."
              className="w-full p-3 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-50"
            >
              {isSubmitting && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
              <span>Save Lead to Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
