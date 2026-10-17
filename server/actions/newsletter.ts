'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: NEWSLETTER & SUBSCRIBERS
 * Audience segmentation, subscriber lifecycle, and broadcast dispatch analytics
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type { NewsletterSubscriber, NewsletterBroadcast, SubscriberStatus } from '@/types/admin';

// Seed Subscribers
let subscribersStore: NewsletterSubscriber[] = [
  {
    id: 'sub_001',
    email: 'alex.chen@vanguardtech.io',
    source: 'homepage_footer',
    status: 'SUBSCRIBED',
    segmentTags: ['AI-Engineering', 'Executive-Briefing'],
    subscribedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    unsubscribedAt: null,
  },
  {
    id: 'sub_002',
    email: 'katherine.ross@meridianlogistics.com',
    source: 'calculator_gate',
    status: 'SUBSCRIBED',
    segmentTags: ['Enterprise-Ops', 'Logistics'],
    subscribedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    unsubscribedAt: null,
  },
  {
    id: 'sub_003',
    email: 'devin.miller@apexcapital.co',
    source: 'case_study_modal',
    status: 'SUBSCRIBED',
    segmentTags: ['Fintech', 'Executive-Briefing'],
    subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    unsubscribedAt: null,
  },
  {
    id: 'sub_004',
    email: 'priya.nair@biogenetix.org',
    source: 'whitepaper_download',
    status: 'SUBSCRIBED',
    segmentTags: ['Healthcare', 'AI-Engineering'],
    subscribedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    unsubscribedAt: null,
  },
  {
    id: 'sub_005',
    email: 'samuel.wright@optima-erp.com',
    source: 'solutions_cta',
    status: 'UNSUBSCRIBED',
    segmentTags: ['Enterprise-Ops'],
    subscribedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    unsubscribedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Seed Broadcasts
let broadcastsStore: NewsletterBroadcast[] = [
  {
    id: 'bc_001',
    subject: 'VARAH Dispatch #14: Autonomous Multi-Agent Workflows in Production',
    previewText: 'How our engineering team eliminated hallucination loops in ERP document pipelines.',
    body: 'Enterprise systems demand strict deterministic execution...',
    targetTags: ['AI-Engineering', 'Executive-Briefing'],
    status: 'SENT',
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledFor: null,
    recipientCount: 842,
    openRate: 46.8, // 46.8%
    clickRate: 14.2, // 14.2%
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bc_002',
    subject: 'Case Study Release: 87% Cost Reduction for Acme Supply Chain',
    previewText: 'A detailed architecture blueprint of our SAP invoice reconciliation deployment.',
    body: 'We are thrilled to publish our latest verified client case study...',
    targetTags: ['Enterprise-Ops', 'Logistics'],
    status: 'SENT',
    sentAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledFor: null,
    recipientCount: 710,
    openRate: 51.4,
    clickRate: 18.9,
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function getSubscribersAction(params: {
  query?: string;
  status?: string;
  tag?: string;
} = {}): Promise<{ subscribers: NewsletterSubscriber[]; tags: string[] }> {
  const session = assertPermission(await getSession(), 'newsletter', 'view');

  const { query = '', status = 'ALL', tag = 'ALL' } = params;

  let filtered = [...subscribersStore];

  if (status !== 'ALL') {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (tag !== 'ALL') {
    filtered = filtered.filter((s) => s.segmentTags.includes(tag));
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (s) => s.email.toLowerCase().includes(q) || s.source.toLowerCase().includes(q)
    );
  }

  const allTags = Array.from(new Set(subscribersStore.flatMap((s) => s.segmentTags)));

  return { subscribers: filtered, tags: allTags };
}

export async function getBroadcastsAction(): Promise<NewsletterBroadcast[]> {
  const session = assertPermission(await getSession(), 'newsletter', 'view');
  return [...broadcastsStore];
}

export interface CreateBroadcastInput {
  subject: string;
  previewText: string;
  body: string;
  targetTags: string[];
  sendNow: boolean;
  scheduledFor?: string;
}

export async function createBroadcastAction(input: CreateBroadcastInput): Promise<NewsletterBroadcast> {
  const session = assertPermission(await getSession(), 'newsletter', 'create');

  const newBroadcast: NewsletterBroadcast = {
    id: `bc_${Date.now().toString(36)}`,
    subject: input.subject,
    previewText: input.previewText,
    body: input.body,
    targetTags: input.targetTags.length > 0 ? input.targetTags : ['All Subscribers'],
    status: input.sendNow ? 'SENT' : 'SCHEDULED',
    sentAt: input.sendNow ? new Date().toISOString() : null,
    scheduledFor: input.sendNow ? null : input.scheduledFor || null,
    recipientCount: input.sendNow ? subscribersStore.filter((s) => s.status === 'SUBSCRIBED').length : 0,
    openRate: input.sendNow ? 0 : 0,
    clickRate: input.sendNow ? 0 : 0,
    createdAt: new Date().toISOString(),
  };

  broadcastsStore.unshift(newBroadcast);
  return newBroadcast;
}

export async function deleteSubscriberAction(id: string): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'newsletter', 'delete');
  subscribersStore = subscribersStore.filter((s) => s.id !== id);
  return { success: true };
}
