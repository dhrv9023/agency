'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — AGENCY CONSOLE SETTINGS
 * General branding, 4-tier RBAC team management, and external webhook integrations
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getSiteSettingsAction,
  updateSiteSettingsAction,
  getTeamMembersAction,
  updateTeamMemberRoleAction,
  revokeTeamMemberAction,
  getIntegrationsAction,
  toggleIntegrationAction,
} from '@/server/actions/settings';
import { InviteUserModal } from '@/components/admin/settings/invite-user-modal';
import { ConfirmDialog } from '@/components/admin/leads/confirm-dialog';
import type { SiteSettingsData, AdminUser, IntegrationRecord, UserRole } from '@/types/admin';

type SettingsTab = 'general' | 'team' | 'integrations';

const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  siteName: 'VARAH SYSTEMS',
  siteUrl: 'https://varah.ai',
  logoUrl: '/assets/logo.svg',
  contactEmail: 'contact@varah.ai',
  supportEmail: 'ops@varah.ai',
  phone: '+1 (555) 902-3100',
  socialLinks: {
    twitter: 'https://x.com/varahsystems',
    linkedin: 'https://linkedin.com/company/varah-systems',
    github: 'https://github.com/varah-systems',
  },
  defaultMetaTitle: 'VARAH SYSTEMS // Autonomous AI Automation & Systems Engineering',
  defaultMetaDesc: 'We don\'t just build AI tools. We engineer intelligent systems that solve enterprise operational bottlenecks with immediate ROI.',
  defaultOgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://varah.ai/sitemap.xml',
  sitemapEnabled: true,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_TEAM_MEMBERS: AdminUser[] = [
  {
    id: 'usr_owner_001',
    email: 'admin@varah.ai',
    name: 'Dhruv & Bhavya (Founders)',
    avatarUrl: null,
    role: 'OWNER',
    isActive: true,
    twoFactorEnabled: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_INTEGRATIONS: IntegrationRecord[] = [
  {
    id: 'int_slack',
    type: 'SLACK_WEBHOOK',
    name: 'Slack Inbound Leads Channel',
    description: 'Post structured notification card to #agency-leads upon contact form submission',
    isEnabled: true,
    configMasked: { webhookUrl: 'https://hooks.slack.com/services/••••••••••••' },
    apiKeyMasked: null,
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'int_calendly',
    type: 'CALENDLY',
    name: 'Calendly Discovery Call Sync',
    description: 'Poll booked calendar events and link prospective client names to CRM records',
    isEnabled: true,
    configMasked: { organizationUri: 'https://api.calendly.com/users/••••••••••••' },
    apiKeyMasked: 'cal_live_••••••••••••••••••••••••',
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [team, setTeam] = useState<AdminUser[]>(DEFAULT_TEAM_MEMBERS);
  const [integrations, setIntegrations] = useState<IntegrationRecord[]>(DEFAULT_INTEGRATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Invite & Confirm modals
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [revokingUserId, setRevokingUserId] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([getSiteSettingsAction(), getTeamMembersAction(), getIntegrationsAction()])
      .then(([s, t, i]) => {
        if (s) setSettings(s);
        if (t && t.length) setTeam(t);
        if (i && i.length) setIntegrations(i);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Settings action fallback to default configuration:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await updateSiteSettingsAction(settings);
      setSettings(updated);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save settings', err);
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateTeamMemberRoleAction(userId, newRole);
      setTeam((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Failed to change role', err);
    }
  };

  const handleConfirmRevoke = async () => {
    if (!revokingUserId) return;
    await revokeTeamMemberAction(revokingUserId);
    setRevokingUserId(null);
    loadData();
  };

  const handleToggleIntegration = async (id: string, currentState: boolean) => {
    try {
      await toggleIntegrationAction(id, !currentState);
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEnabled: !currentState } : item))
      );
    } catch (err) {
      console.error('Failed to toggle integration', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-black/10 dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
            <span className="text-xs font-mono font-medium text-sky-600 dark:text-[#00f0ff] tracking-wider uppercase">
              CONSOLE CONFIGURATION // CLUSTER GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Agency Console Settings
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Global site metadata, role-based operator permissions, and external webhook relays.
          </p>
        </div>

        {/* Audit Log Quick Navigation Link */}
        <Link
          href="/admin/settings/audit-log"
          className="px-3.5 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <i className="fa-solid fa-clock-rotate-left text-sky-600 dark:text-[#00f0ff]" />
          <span>Audit Log</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-sky-500 dark:border-[#00f0ff] text-sky-600 dark:text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <i className="fa-solid fa-sliders text-xs" />
          <span>General & SEO</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'team'
              ? 'border-sky-500 dark:border-[#00f0ff] text-sky-600 dark:text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <i className="fa-solid fa-users text-xs" />
          <span>Team & Roles ({team.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'integrations'
              ? 'border-sky-500 dark:border-[#00f0ff] text-sky-600 dark:text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <i className="fa-solid fa-bolt text-xs" />
          <span>Webhooks & Integrations ({integrations.length})</span>
        </button>
      </div>

      {isLoading && !settings ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 font-mono text-xs space-y-2">
          <i className="fa-solid fa-circle-notch fa-spin text-xl text-sky-500 dark:text-[#00f0ff]" />
          <span>Loading console configuration...</span>
        </div>
      ) : activeTab === 'general' ? (
        /* General Settings Tab */
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          <div className="p-6 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Agency Identity & Contact Points</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Agency Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Production URL</label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Inbound Leads Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Operations & Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail || ''}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Direct Phone</label>
                <input
                  type="tel"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Social & Network Profiles</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">X / Twitter</label>
                <input
                  type="text"
                  value={settings.socialLinks.twitter || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">LinkedIn Company</label>
                <input
                  type="text"
                  value={settings.socialLinks.linkedin || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">GitHub Organization</label>
                <input
                  type="text"
                  value={settings.socialLinks.github || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, github: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#11131a] border border-black/10 dark:border-white/10 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-sky-500 dark:focus:border-[#00f0ff]"
                />
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-between pt-2">
            {saveSuccess && (
              <span className="text-xs font-mono text-[#10b981] flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check" />
                <span>Configuration changes persisted to cluster!</span>
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-50"
              >
                {isSaving && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
                <span>Save Site Settings</span>
              </button>
            </div>
          </div>
        </form>
      ) : activeTab === 'team' ? (
        /* Team & Roles Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Authorized Console Operators</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                4-tier Role-Based Access Control matrix (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER`)
              </p>
            </div>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_12px_rgba(0,240,255,0.2)] flex items-center gap-1.5"
            >
              <i className="fa-solid fa-user-plus text-xs" />
              <span>Invite Operator</span>
            </button>
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12] overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
              <thead className="bg-[#11131a] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 font-semibold">Operator</th>
                  <th className="py-3 px-4 font-semibold">Work Email</th>
                  <th className="py-3 px-4 font-semibold">Assigned Role</th>
                  <th className="py-3 px-4 font-semibold">Two-Factor</th>
                  <th className="py-3 px-4 font-semibold">Last Active</th>
                  <th className="py-3 px-4 text-right font-semibold">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-white">
                      {member.name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{member.email}</td>
                    <td className="py-3.5 px-4">
                      {member.role === 'OWNER' ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
                          ROOT OWNER
                        </span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                          className="px-2 py-1 rounded bg-[#11131a] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {member.twoFactorEnabled ? (
                        <span className="text-[#10b981] flex items-center gap-1.5 text-[11px]">
                          <i className="fa-solid fa-shield-check" />
                          <span>Enabled</span>
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {member.lastLoginAt
                        ? new Date(member.lastLoginAt).toLocaleDateString()
                        : 'Never logged in'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {member.role !== 'OWNER' && (
                        <button
                          onClick={() => setRevokingUserId(member.id)}
                          className="text-gray-500 hover:text-red-400 p-1 text-xs"
                          title="Revoke Access"
                        >
                          <i className="fa-solid fa-user-xmark" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Webhooks & Integrations Tab */
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">External Relays & Webhooks</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Automated notifications and CRM sync relays to Slack, Calendly, and SMTP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrations.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#00f0ff]">
                      {item.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleIntegration(item.id, item.isEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.isEnabled ? 'bg-[#10b981]' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-gray-500 flex items-center justify-between">
                  <span>Last synced:</span>
                  <span className="text-gray-300">
                    {item.lastSyncedAt
                      ? new Date(item.lastSyncedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Never'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvited={() => {
          loadData();
          setIsInviteOpen(false);
        }}
      />

      {/* Revoke Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!revokingUserId}
        title="Revoke Operator Access?"
        description="The operator will immediately lose access to the administrative console and all active sessions will be terminated."
        onConfirm={handleConfirmRevoke}
        onCancel={() => setRevokingUserId(null)}
      />
    </div>
  );
}
