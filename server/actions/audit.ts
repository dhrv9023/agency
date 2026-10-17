'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: AUDIT & COMPLIANCE LOG
 * Immutable ledger of mutations, role modifications, logins, and API syncs
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type { AuditLogRecord } from '@/types/admin';

// Seed Audit Log Ledger
let auditStore: AuditLogRecord[] = [
  {
    id: 'aud_001',
    userId: 'usr_owner_001',
    userName: 'Dhruv & Bhavya',
    userEmail: 'admin@varah.ai',
    userAvatar: null,
    action: 'LEAD_STAGE_CHANGE',
    entityType: 'Lead',
    entityId: 'lead_003',
    metadata: { leadName: 'Julian Sterling', company: 'Horizon Capital' },
    diffBefore: { stage: 'CONTACTED' },
    diffAfter: { stage: 'QUALIFIED' },
    ipAddress: '198.51.100.24',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud_002',
    userId: 'usr_admin_002',
    userName: 'Operations Lead',
    userEmail: 'ops@varah.ai',
    userAvatar: null,
    action: 'WEBHOOK_DISPATCH',
    entityType: 'Integration',
    entityId: 'int_slack',
    metadata: { channel: '#agency-leads', status: 200 },
    diffBefore: null,
    diffAfter: { dispatched: true, responseCode: 200 },
    ipAddress: '127.0.0.1 (Internal Cluster)',
    userAgent: 'VARAH-Webhook-Worker/2.0',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud_003',
    userId: 'usr_owner_001',
    userName: 'Dhruv & Bhavya',
    userEmail: 'admin@varah.ai',
    userAvatar: null,
    action: 'CMS_POST_PUBLISH',
    entityType: 'CMSPost',
    entityId: 'post_001',
    metadata: { title: 'Engineering Autonomous Agent Topologies' },
    diffBefore: { status: 'DRAFT', publishedAt: null },
    diffAfter: { status: 'PUBLISHED', publishedAt: new Date().toISOString() },
    ipAddress: '198.51.100.24',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud_004',
    userId: 'usr_owner_001',
    userName: 'Dhruv & Bhavya',
    userEmail: 'admin@varah.ai',
    userAvatar: null,
    action: 'AUTH_LOGIN',
    entityType: 'AdminSession',
    entityId: 'usr_owner_001',
    metadata: { role: 'OWNER', sessionDurationDays: 7 },
    diffBefore: null,
    diffAfter: { activeSession: true },
    ipAddress: '198.51.100.24',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud_005',
    userId: 'usr_owner_001',
    userName: 'Dhruv & Bhavya',
    userEmail: 'admin@varah.ai',
    userAvatar: null,
    action: 'TEAM_ROLE_UPDATE',
    entityType: 'AdminUser',
    entityId: 'usr_editor_003',
    metadata: { targetUser: 'content@varah.ai' },
    diffBefore: { role: 'VIEWER' },
    diffAfter: { role: 'EDITOR' },
    ipAddress: '198.51.100.24',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function getAuditLogsAction(params: {
  query?: string;
  action?: string;
  entityType?: string;
} = {}): Promise<AuditLogRecord[]> {
  const session = assertPermission(await getSession(), 'audit', 'view');

  const { query = '', action = 'ALL', entityType = 'ALL' } = params;

  let filtered = [...auditStore];

  if (action !== 'ALL') {
    filtered = filtered.filter((log) => log.action === action);
  }

  if (entityType !== 'ALL') {
    filtered = filtered.filter((log) => log.entityType === entityType);
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        (log.userName && log.userName.toLowerCase().includes(q)) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
        log.entityType.toLowerCase().includes(q) ||
        (log.entityId && log.entityId.toLowerCase().includes(q))
    );
  }

  return filtered;
}

export async function logAuditEvent(entry: Omit<AuditLogRecord, 'id' | 'createdAt'>): Promise<AuditLogRecord> {
  const newRecord: AuditLogRecord = {
    ...entry,
    id: `aud_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  auditStore.unshift(newRecord);
  return newRecord;
}
