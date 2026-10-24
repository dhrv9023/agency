'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — TRAFFIC ANALYTICS & CONVERSION TELEMETRY (Workstream 11)
 * ==============================================================================
 * Features:
 *   - Strictly server-side Plausible Stats API integration with 10-minute cache TTL.
 *   - Real CRM Lead table attribution breakdown (UTMs, Referrers, Landing pages).
 *   - Zero synthetic multipliers or fake telemetry: honest empty/unconfigured states.
 *   - "Consented visitors only" disclosure across all telemetry cards.
 *   - Manual rate-limited refresh with cooldown enforcement.
 *   - Plain SVG/CSS charts with accessible tabular text alternatives.
 *   - Loading skeleton, error state with retry, and CSV export.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getAnalyticsDataAction, type AnalyticsData } from '@/server/actions/analytics';
import { downloadCsvFile } from '@/lib/export/csv';

export default function AnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  const loadData = useCallback(async (r: '7d' | '30d' | '90d', force: boolean = false) => {
    if (force) {
      setIsRefreshing(true);
      setRefreshNotice(null);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const res = await getAnalyticsDataAction(r, force);
      setData(res);
      if (force) {
        setRefreshNotice('Cache bypassed: Fresh stats fetched.');
        setTimeout(() => setRefreshNotice(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to retrieve analytics telemetry.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(range, false);
  }, [range, loadData]);

  const handleManualRefresh = () => {
    loadData(range, true);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const rows = [
      'Type,Key,Metric 1,Metric 2,Metric 3',
      ...data.topPages.map((p) => `"Page","${p.path}",${p.views},${p.uniques},${p.bounceRate}%`),
      ...data.leadsBySource.map((s) => `"Lead Source","${s.source}",${s.count},${s.percentage}%,0`),
    ];
    downloadCsvFile(rows.join('\r\n'), `varah_telemetry_${range}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-black/10 dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
            <span className="text-xs font-mono font-medium text-sky-600 dark:text-[#00f0ff] tracking-wider uppercase">
              TELEMETRY CLUSTER // TRAFFIC & CRM ATTRIBUTION
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-700 dark:text-[#00f0ff] border border-cyan-500/20">
              Consented visitors only
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Traffic & Conversion Telemetry
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Privacy-compliant aggregate metrics and database lead attribution. Unconsented visitors remain strictly excluded.
          </p>
        </div>

        {/* Range Selector, Refresh & Export Action */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center p-1 bg-gray-100 dark:bg-[#11131a] rounded-lg border border-black/10 dark:border-white/10">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  range === r
                    ? 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            title="Bypass 10-minute cache and fetch latest provider stats (Rate-limited)"
            className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'fa-spin text-[#00f0ff]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!data}
            className="px-3.5 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <i className="fa-solid fa-file-arrow-down text-gray-500 dark:text-gray-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Feedback Banners */}
      {refreshNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <i className="fa-solid fa-circle-check" />
          <span>{refreshNotice}</span>
        </div>
      )}

      {/* Error State with Retry Button */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>Telemetry Retrieval Error</span>
          </div>
          <p className="text-xs font-mono">{errorMessage}</p>
          <button
            type="button"
            onClick={() => loadData(range, false)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-mono font-medium hover:bg-red-600 transition-colors"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 rounded-xl bg-gray-100 dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 animate-pulse space-y-3">
                <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded" />
                <div className="h-8 w-20 bg-gray-300 dark:bg-white/20 rounded" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            ))}
          </div>
          <div className="h-64 rounded-xl bg-gray-100 dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 animate-pulse" />
        </div>
      )}

      {/* Data Render */}
      {!isLoading && data && (
        <>
          {/* Provider Status / Unconfigured State Notice */}
          {!data.providerStatus.configured && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <i className="fa-solid fa-circle-info" />
                <span>Plausible Stats API Notice</span>
              </div>
              <p className="leading-relaxed">
                {data.providerStatus.errorMessage || 'Plausible API credentials not configured.'}
              </p>
              <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80 pt-1">
                To connect live Plausible stats: Set <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-black/30">PLAUSIBLE_API_KEY</code> and <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-black/30">PLAUSIBLE_SITE_ID</code> in Vercel project environment variables.
                Direct database lead counts and CRM attribution remain active below.
              </div>
            </div>
          )}

          {/* Last Updated Timestamp & Metadata */}
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 dark:text-gray-400">
            <span>
              Provider: <strong className="text-gray-700 dark:text-gray-300">Plausible Analytics (EU / Hetzner)</strong>
            </span>
            <span>
              Last updated:{' '}
              {new Date(data.providerStatus.lastUpdated).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}{' '}
              ({data.providerStatus.isCached ? '10m cached' : 'live'})
            </span>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Pageviews */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Total Pageviews
              </span>
              <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
                {data.summary.totalPageviews !== null
                  ? data.summary.totalPageviews.toLocaleString()
                  : '—'}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-2 block">
                {data.summary.totalPageviews !== null ? 'Consented visits' : 'Pending API key'}
              </span>
            </div>

            {/* Unique Visitors */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Unique Visitors
              </span>
              <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
                {data.summary.uniqueVisitors !== null
                  ? data.summary.uniqueVisitors.toLocaleString()
                  : '—'}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-2 block">
                {data.summary.uniqueVisitors !== null ? 'Unique browser sessions' : 'Pending API key'}
              </span>
            </div>

            {/* Bounce Rate */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Bounce Rate
              </span>
              <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
                {data.summary.bounceRate !== null ? `${data.summary.bounceRate}%` : '—'}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-2 block">
                {data.summary.bounceRate !== null ? 'Single-page exits' : 'Pending API key'}
              </span>
            </div>

            {/* Inbound Leads (Empirical CRM Table Data) */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Inbound Inquiries ({range.toUpperCase()})
              </span>
              <div className="text-3xl font-bold font-mono text-sky-600 dark:text-[#00f0ff]">
                {data.summary.leadsThisPeriod.toLocaleString()}
              </div>
              <span className="text-xs text-emerald-600 dark:text-[#10b981] font-mono mt-2 block">
                {data.summary.totalLeads} all-time CRM records
              </span>
            </div>
          </div>

          {/* Row 2: Top Pages & Plain SVG Traffic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Visited Pages (7 cols) */}
            <div className="lg:col-span-7 rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Visited Routes</h3>
                  <span className="text-[10px] font-mono text-gray-400">Plausible Breakdown</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Most engaged routes across Layer A marketing site
                </p>

                {data.topPages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-[11px] text-gray-500 dark:text-gray-400 uppercase border-b border-black/10 dark:border-white/10 pb-2">
                        <tr>
                          <th className="pb-2 font-medium">Page Route</th>
                          <th className="pb-2 font-medium">Views</th>
                          <th className="pb-2 font-medium">Uniques</th>
                          <th className="pb-2 font-medium text-right">Bounce</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        {data.topPages.map((page) => (
                          <tr key={page.path} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                            <td className="py-2.5 text-sky-600 dark:text-[#00f0ff] font-semibold">{page.path}</td>
                            <td className="py-2.5 text-gray-900 dark:text-white">{page.views.toLocaleString()}</td>
                            <td className="py-2.5 text-gray-700 dark:text-gray-300">{page.uniques.toLocaleString()}</td>
                            <td className="py-2.5 text-right text-gray-500 dark:text-gray-400">
                              {page.bounceRate ? `${page.bounceRate}%` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-xs font-mono">
                    <i className="fa-solid fa-chart-column text-2xl text-gray-400 dark:text-gray-600 mb-2 block" />
                    <span>No route telemetry available for this period.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Referrers & Device Distribution (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Referrers */}
              <div className="rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Acquisition Referrers</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Traffic sources delivering inbound visits</p>

                {data.referrers.length > 0 ? (
                  <div className="space-y-3">
                    {data.referrers.map((ref) => (
                      <div key={ref.source} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-700 dark:text-gray-300 truncate">{ref.source}</span>
                          <span className="text-gray-900 dark:text-white font-bold">{ref.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${ref.percentage}%`,
                              backgroundColor: ref.colorHex,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs font-mono">
                    <span>No referrer telemetry recorded yet.</span>
                  </div>
                )}
              </div>

              {/* Devices */}
              <div className="rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Device Breakdown</h3>
                {data.devices.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {data.devices.map((dev) => (
                      <div
                        key={dev.device}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-[#11131a] border border-black/5 dark:border-white/5 text-center font-mono"
                      >
                        <i className={`fa-solid ${dev.icon} text-lg mb-1.5`} style={{ color: dev.colorHex }} />
                        <div className="text-base font-bold text-gray-900 dark:text-white">{dev.percentage}%</div>
                        <div className="text-[10px] text-gray-500 truncate mt-0.5">{dev.device.split(' ')[0]}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500 dark:text-gray-400 text-xs font-mono">
                    <span>Device data will appear when visits are recorded.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: First-Party CRM Lead Attribution Table */}
          <div className="rounded-xl bg-white dark:bg-[#0c0d12] border border-black/10 dark:border-white/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  First-Party Lead Attribution (CRM Table)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Empirical inquiry attribution captured strictly upon visitor consent.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] border border-emerald-500/20">
                Prisma Lead Table
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] text-gray-500 dark:text-gray-400 uppercase border-b border-black/10 dark:border-white/10 pb-2">
                  <tr>
                    <th className="pb-2 font-medium">Attribution Channel / UTM Source</th>
                    <th className="pb-2 font-medium">Inquiry Count</th>
                    <th className="pb-2 font-medium">Share of Inbound</th>
                    <th className="pb-2 font-medium text-right">Visual Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {data.leadsBySource.length > 0 ? (
                    data.leadsBySource.map((s) => (
                      <tr key={s.source} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="py-2.5 font-semibold text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                            <span className="truncate max-w-xs">{s.source}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-gray-700 dark:text-gray-300 font-bold">{s.count}</td>
                        <td className="py-2.5 text-gray-500 dark:text-gray-400">{s.percentage}%</td>
                        <td className="py-2.5 text-right">
                          <div className="w-24 inline-block h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden align-middle">
                            <div
                              className="h-full bg-[#00f0ff] rounded-full"
                              style={{ width: `${s.percentage}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500 dark:text-gray-400">
                        No lead inquiries captured in this time period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
