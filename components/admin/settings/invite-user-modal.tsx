'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — INVITE OPERATOR MODAL
 * 4-Tier RBAC operator invitation flow with email dispatch and role scoping
 * ==============================================================================
 */

import React, { useState } from 'react';
import { inviteTeamMemberAction } from '@/server/actions/settings';
import type { UserRole, AdminUser } from '@/types/admin';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvited: (user: AdminUser) => void;
}

const ROLES: { id: UserRole; title: string; desc: string }[] = [
  { id: 'ADMIN', title: 'Admin', desc: 'Manage CRM leads, projects, CMS and team operations' },
  { id: 'EDITOR', title: 'Editor', desc: 'Publish technical articles, case studies, and upload CDN media' },
  { id: 'VIEWER', title: 'Viewer', desc: 'Read-only access to metrics, audit logs, and lead records' },
];

export function InviteUserModal({ isOpen, onClose, onInvited }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError('Please provide operator Name and Work Email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newUser = await inviteTeamMemberAction({ email, name, role });
      setIsSubmitting(false);
      onInvited(newUser);
      onClose();
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Invitation failed';
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
        className="w-full max-w-md bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl p-6 text-white space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <h3 className="text-base font-semibold text-white">Invite Agency Operator</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Provision scoped RBAC credentials to the administrative console
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
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Jenkins"
              className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="s.jenkins@varah.ai"
              className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-2">Role Scope</label>
            <div className="space-y-2">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-white'
                        : 'bg-[#11131a] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{r.title}</span>
                      {isSelected && (
                        <i className="fa-solid fa-circle-check text-[#00f0ff] text-xs" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
