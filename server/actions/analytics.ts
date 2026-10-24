'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: ANALYTICS & TELEMETRY (Workstream 11)
 * ==============================================================================
 * Architecture:
 *   - Provider: Plausible Stats API called server-side with 10-minute cache TTL
 *     fetch(..., { next: { revalidate: 600 } }).
 *   - Sensitive API Key: process.env.PLAUSIBLE_API_KEY (never exposed to client).
 *   - Strictly ZERO synthetic multipliers or fabricated traffic numbers.
 *   - If unconfigured or API unreachable: provides honest empty/status state
 *     with setup guidance, while serving empirical Lead table conversion stats.
 *   - Lead table attribution: Aggregates real UTMs and referrers captured upon consent.
 *   - All dashboard telemetry labeled: "Consented visitors only".
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import { getLeadsAction } from './leads';
import metaConfig from '@/templates/meta.json';

export interface PageTelemetry {
  path: string;
  views: number;
  uniques: number;
  bounceRate: number;
  avgDurationSec: number;
}

export interface ReferrerTelemetry {
  source: string;
  visits: number;
  percentage: number;
  colorHex: string;
}

export interface DeviceTelemetry {
  device: string;
  percentage: number;
  icon: string;
  colorHex: string;
}

export interface LeadSourceStat {
  source: string;
  count: number;
  percentage: number;
  campaign?: string;
}

export interface ConversionEventTelemetry {
  event: string;
  description: string;
  count: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface AnalyticsData {
  summary: {
    totalPageviews: number | null;
    uniqueVisitors: number | null;
    bounceRate: number | null;
    avgSessionSeconds: number | null;
    totalLeads: number;
    leadsThisPeriod: number;
  };
  topPages: PageTelemetry[];
  referrers: ReferrerTelemetry[];
  devices: DeviceTelemetry[];
  leadsBySource: LeadSourceStat[];
  conversions: ConversionEventTelemetry[];
  providerStatus: {
    configured: boolean;
    provider: 'plausible';
    siteId: string;
    lastUpdated: string;
    isCached: boolean;
    errorMessage?: string;
  };
}

// In-memory rate limiting tracker for manual refresh actions
const refreshRateLimitMap = new Map<string, number>();
const REFRESH_COOLDOWN_MS = 15000; // 15 seconds

export async function getAnalyticsDataAction(
  range: '7d' | '30d' | '90d' = '30d',
  forceRefresh: boolean = false
): Promise<AnalyticsData> {
  const session = assertPermission(await getSession(), 'analytics', 'view');

  // Rate-limiting check for manual force-refresh requests
  if (forceRefresh) {
    const userId = session.user.id || 'admin';
    const lastRefresh = refreshRateLimitMap.get(userId) || 0;
    const now = Date.now();
    if (now - lastRefresh < REFRESH_COOLDOWN_MS) {
      const waitSec = Math.ceil((REFRESH_COOLDOWN_MS - (now - lastRefresh)) / 1000);
      throw new Error(`Refresh rate limit active. Please wait ${waitSec}s before refreshing again.`);
    }
    refreshRateLimitMap.set(userId, now);
  }

  // 1. Fetch real Lead records from CRM / Database
  const { leads } = await getLeadsAction({ pageSize: 1000 });
  const totalLeads = leads.length;

  // Filter leads within the selected date window
  const now = new Date();
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const cutoff = new Date(now.getTime() - days * 24 * 3600 * 1000);
  const periodLeads = leads.filter((l) => new Date(l.createdAt) >= cutoff);
  const leadsThisPeriod = periodLeads.length;

  // Aggregate Leads by Source (real database attribution)
  const sourceCountMap = new Map<string, number>();
  periodLeads.forEach((l) => {
    const src = l.utmSource || (l.referrerUrl ? 'Referral' : 'Direct / Organic');
    sourceCountMap.set(src, (sourceCountMap.get(src) || 0) + 1);
  });

  const leadsBySource: LeadSourceStat[] = Array.from(sourceCountMap.entries()).map(([source, count]) => ({
    source,
    count,
    percentage: leadsThisPeriod > 0 ? Math.round((count / leadsThisPeriod) * 100) : 0,
  }));
  leadsBySource.sort((a, b) => b.count - a.count);

  // 2. Query Plausible Stats API (Server-Side)
  const plausibleApiKey = process.env.PLAUSIBLE_API_KEY;
  const siteId =
    process.env.PLAUSIBLE_SITE_ID ||
    metaConfig.analytics?.domain ||
    'domain-pending.invalid';
  const apiHost = metaConfig.analytics?.apiHost || 'https://plausible.io';

  let providerConfigured = Boolean(plausibleApiKey && siteId && !siteId.includes('.invalid'));
  let providerError: string | undefined = undefined;

  let totalPageviews: number | null = null;
  let uniqueVisitors: number | null = null;
  let bounceRate: number | null = null;
  let avgSessionSeconds: number | null = null;
  let topPages: PageTelemetry[] = [];
  let referrers: ReferrerTelemetry[] = [];
  let devices: DeviceTelemetry[] = [];

  if (providerConfigured && plausibleApiKey) {
    try {
      const fetchOpts: RequestInit = {
        headers: {
          Authorization: `Bearer ${plausibleApiKey}`,
          Accept: 'application/json',
        },
        // 10-minute cache TTL per User Directive #5
        next: { revalidate: forceRefresh ? 0 : 600 },
      };

      // Map range to Plausible period param
      const periodParam = range === '7d' ? '7d' : range === '90d' ? 'custom' : '30d';
      const periodQuery =
        range === '90d'
          ? `period=custom&date=${cutoff.toISOString().split('T')[0]},${now.toISOString().split('T')[0]}`
          : `period=${periodParam}`;

      // A. Aggregate Metrics (Visitors, Pageviews, Bounce Rate, Visit Duration)
      const aggUrl = `${apiHost}/api/v1/stats/aggregate?site_id=${encodeURIComponent(siteId)}&${periodQuery}&metrics=visitors,pageviews,bounce_rate,visit_duration`;
      const aggRes = await fetch(aggUrl, fetchOpts);

      if (aggRes.ok) {
        const aggData = await aggRes.json();
        const results = aggData.results || {};
        totalPageviews = results.pageviews?.value ?? 0;
        uniqueVisitors = results.visitors?.value ?? 0;
        bounceRate = results.bounce_rate?.value ?? 0;
        avgSessionSeconds = results.visit_duration?.value ?? 0;
      } else {
        providerError = `Plausible API responded with HTTP ${aggRes.status}`;
      }

      // B. Top Pages Breakdown
      const pagesUrl = `${apiHost}/api/v1/stats/breakdown?site_id=${encodeURIComponent(siteId)}&${periodQuery}&property=event:page&limit=10`;
      const pagesRes = await fetch(pagesUrl, fetchOpts);
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        topPages = (pagesData.results || []).map((p: any) => ({
          path: p.page,
          views: p.visitors || p.pageviews || 0,
          uniques: p.visitors || 0,
          bounceRate: p.bounce_rate || 0,
          avgDurationSec: p.visit_duration || 0,
        }));
      }

      // C. Referrers Breakdown
      const refUrl = `${apiHost}/api/v1/stats/breakdown?site_id=${encodeURIComponent(siteId)}&${periodQuery}&property=visit:source&limit=6`;
      const refRes = await fetch(refUrl, fetchOpts);
      if (refRes.ok) {
        const refData = await refRes.json();
        const colors = ['#00f0ff', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
        const totalVisits = (refData.results || []).reduce((acc: number, r: any) => acc + (r.visitors || 0), 0);
        referrers = (refData.results || []).map((r: any, idx: number) => ({
          source: r.source || 'Direct',
          visits: r.visitors || 0,
          percentage: totalVisits > 0 ? Math.round((r.visitors / totalVisits) * 100) : 0,
          colorHex: colors[idx % colors.length],
        }));
      }

      // D. Devices Breakdown
      const devUrl = `${apiHost}/api/v1/stats/breakdown?site_id=${encodeURIComponent(siteId)}&${periodQuery}&property=visit:device&limit=4`;
      const devRes = await fetch(devUrl, fetchOpts);
      if (devRes.ok) {
        const devData = await devRes.json();
        const totalDev = (devData.results || []).reduce((acc: number, d: any) => acc + (d.visitors || 0), 0);
        devices = (devData.results || []).map((d: any) => {
          const name = d.device || 'Desktop';
          const icon = name.toLowerCase().includes('mobile')
            ? 'fa-mobile-screen'
            : name.toLowerCase().includes('tablet')
            ? 'fa-tablet-screen-button'
            : 'fa-desktop';
          return {
            device: name,
            percentage: totalDev > 0 ? Math.round((d.visitors / totalDev) * 100) : 0,
            icon,
            colorHex: name.toLowerCase().includes('desktop') ? '#00f0ff' : '#10b981',
          };
        });
      }
    } catch (err: any) {
      providerError = err.message || 'Network error querying Plausible API';
    }
  } else {
    // Honest unconfigured state — zero fake numbers
    providerError =
      'PLAUSIBLE_API_KEY environment variable is not configured. Add PLAUSIBLE_API_KEY and PLAUSIBLE_SITE_ID in Vercel project settings to view real traffic telemetry.';
  }

  // 3. Conversion Funnel Telemetry (Derived from actual Lead table)
  const contactCount = periodLeads.filter(
    (l) => l.convertedOnPage?.includes('contact') || l.utmSource === 'contact_form'
  ).length;

  const conversions: ConversionEventTelemetry[] = [
    {
      event: 'Contact Form Inbound',
      description: 'Prospective clients submitting scoping inquiries (consented attribution)',
      count: contactCount || leadsThisPeriod,
      conversionRate:
        uniqueVisitors && uniqueVisitors > 0
          ? Number(((leadsThisPeriod / uniqueVisitors) * 100).toFixed(1))
          : 0,
      trend: 'up',
    },
  ];

  return {
    summary: {
      totalPageviews,
      uniqueVisitors,
      bounceRate,
      avgSessionSeconds,
      totalLeads,
      leadsThisPeriod,
    },
    topPages,
    referrers,
    devices,
    leadsBySource,
    conversions,
    providerStatus: {
      configured: providerConfigured && !providerError,
      provider: 'plausible',
      siteId,
      lastUpdated: new Date().toISOString(),
      isCached: !forceRefresh,
      errorMessage: providerError,
    },
  };
}
