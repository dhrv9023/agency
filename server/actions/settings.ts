'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: SETTINGS & TEAM MANAGEMENT
 * General agency metadata, webhook integration keys, and 4-tier RBAC team access
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type { AdminUser, UserRole, SiteSettingsData, IntegrationRecord } from '@/types/admin';

// Seed General Site Settings
let settingsStore: SiteSettingsData = {
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

// Seed Team Operators
let teamStore: AdminUser[] = [
  {
    id: 'usr_owner_001',
    email: 'admin@varah.ai',
    name: 'Dhruv & Bhavya (Founders)',
    avatarUrl: null,
    role: 'OWNER',
    isActive: true,
    twoFactorEnabled: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_admin_002',
    email: 'ops@varah.ai',
    name: 'Operations & DevOps Lead',
    avatarUrl: null,
    role: 'ADMIN',
    isActive: true,
    twoFactorEnabled: true,
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_editor_003',
    email: 'content@varah.ai',
    name: 'Technical Writer & CMS Editor',
    avatarUrl: null,
    role: 'EDITOR',
    isActive: true,
    twoFactorEnabled: false,
    lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_viewer_004',
    email: 'auditor@varah.ai',
    name: 'Compliance Auditor',
    avatarUrl: null,
    role: 'VIEWER',
    isActive: true,
    twoFactorEnabled: false,
    lastLoginAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Seed Integrations
let integrationsStore: IntegrationRecord[] = [
  {
    id: 'int_slack',
    type: 'SLACK_WEBHOOK',
    name: 'Slack Inbound Leads Channel',
    description: 'Post structured notification card to #agency-leads upon contact form submission',
    isEnabled: true,
    configMasked: { webhookUrl: 'https://hooks.slack.com/services/T00/B00/••••••••••••' },
    apiKeyMasked: null,
    lastSyncedAt: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
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
    lastSyncedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'int_smtp',
    type: 'SMTP',
    name: 'Postmark Outbound SMTP Service',
    description: 'Transactional email provider for quick operator responses and client notices',
    isEnabled: true,
    configMasked: { host: 'smtp.postmarkapp.com', port: '587', from: 'operations@varah.ai' },
    apiKeyMasked: 'pm_live_••••••••••••••••••••••••',
    lastSyncedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getSiteSettingsAction(): Promise<SiteSettingsData> {
  const session = assertPermission(await getSession(), 'settings', 'view');
  return { ...settingsStore };
}

export async function updateSiteSettingsAction(updates: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
  const session = assertPermission(await getSession(), 'settings', 'edit');
  settingsStore = {
    ...settingsStore,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return settingsStore;
}

export async function getTeamMembersAction(): Promise<AdminUser[]> {
  const session = assertPermission(await getSession(), 'team', 'view');
  return [...teamStore];
}

export async function inviteTeamMemberAction(input: {
  email: string;
  name: string;
  role: UserRole;
}): Promise<AdminUser> {
  const session = assertPermission(await getSession(), 'team', 'create');

  const newMember: AdminUser = {
    id: `usr_${input.role.toLowerCase()}_${Date.now().toString(36)}`,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    avatarUrl: null,
    role: input.role,
    isActive: true,
    twoFactorEnabled: false,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  teamStore.push(newMember);
  return newMember;
}

export async function updateTeamMemberRoleAction(id: string, role: UserRole): Promise<AdminUser> {
  const session = assertPermission(await getSession(), 'team', 'edit');

  const index = teamStore.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('Member not found.');

  teamStore[index] = {
    ...teamStore[index],
    role,
    updatedAt: new Date().toISOString(),
  };

  return teamStore[index];
}

export async function revokeTeamMemberAction(id: string): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'team', 'delete');
  teamStore = teamStore.filter((u) => u.id !== id);
  return { success: true };
}

export async function getIntegrationsAction(): Promise<IntegrationRecord[]> {
  const session = assertPermission(await getSession(), 'settings', 'view');
  return [...integrationsStore];
}

export async function toggleIntegrationAction(id: string, isEnabled: boolean): Promise<IntegrationRecord> {
  const session = assertPermission(await getSession(), 'settings', 'edit');

  const index = integrationsStore.findIndex((i) => i.id === id);
  if (index === -1) throw new Error('Integration not found.');

  integrationsStore[index] = {
    ...integrationsStore[index],
    isEnabled,
    updatedAt: new Date().toISOString(),
  };

  return integrationsStore[index];
}
