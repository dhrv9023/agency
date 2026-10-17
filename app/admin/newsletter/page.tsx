'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — NEWSLETTER & SUBSCRIBER CONSOLE
 * Audience segment directory, CSV exports, broadcast history, and open telemetry
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  getSubscribersAction,
  getBroadcastsAction,
  deleteSubscriberAction,
} from '@/server/actions/newsletter';
import { BroadcastModal } from '@/components/admin/newsletter/broadcast-modal';
import { ConfirmDialog } from '@/components/admin/leads/confirm-dialog';
import { downloadCsvFile } from '@/lib/export/csv';
import type { NewsletterSubscriber, NewsletterBroadcast } from '@/types/admin';

type NewsletterTab = 'subscribers' | 'broadcasts';

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<NewsletterTab>('subscribers');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [broadcasts, setBroadcasts] = useState<NewsletterBroadcast[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tagFilter, setTagFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = () => {
    setIsLoading(true);
    if (activeTab === 'subscribers') {
      getSubscribersAction({ query: search, status: statusFilter, tag: tagFilter })
        .then((res) => {
          setSubscribers(res.subscribers);
          setAvailableTags(res.tags);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load subscribers', err);
          setIsLoading(false);
        });
    } else {
      getBroadcastsAction()
        .then((res) => {
          setBroadcasts(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load broadcasts', err);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, search, statusFilter, tagFilter]);

  const handleExportCsv = () => {
    const rows = [
      'Subscriber ID,Email,Status,Source,Tags,Joined Date',
      ...subscribers.map(
        (s) =>
          `"${s.id}","${s.email}","${s.status}","${s.source}","${s.segmentTags.join(
            '; '
          )}","${s.subscribedAt}"`
      ),
    ];
    downloadCsvFile(rows.join('\r\n'), 'varah_subscribers_export.csv');
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteSubscriberAction(deletingId);
    setDeletingId(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-mono font-medium text-[#10b981] tracking-wider uppercase">
              SUBSCRIBER RELAY // AUDIENCE CLUSTERS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Newsletter & Audience Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Maintain segmented subscriber lists and broadcast technical engineering releases.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-file-arrow-down text-gray-400" />
            <span>Export Subscribers</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-2"
          >
            <i className="fa-solid fa-paper-plane text-xs" />
            <span>Compose Broadcast</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-users text-xs" />
          <span>Subscribers Directory ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'broadcasts'
              ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-clock-rotate-left text-xs" />
          <span>Dispatched Broadcasts ({broadcasts.length})</span>
        </button>
      </div>

      {/* Filter Bar (Subscribers Tab) */}
      {activeTab === 'subscribers' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)]">
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email address or acquisition source..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBSCRIBED">Subscribed</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">All Tags</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
          <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
          <span>Syncing audience records...</span>
        </div>
      ) : activeTab === 'subscribers' ? (
        /* Subscribers Table */
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12] overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
            <thead className="bg-[#11131a] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Subscriber Email</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Acquisition Source</th>
                <th className="py-3 px-4 font-semibold">Segment Tags</th>
                <th className="py-3 px-4 font-semibold">Subscribed Date</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-sans font-semibold text-white">
                    {sub.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        sub.status === 'SUBSCRIBED'
                          ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">{sub.source}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1">
                      {sub.segmentTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.2 rounded text-[10px] bg-white/5 border border-white/10 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setDeletingId(sub.id)}
                      className="p-1 text-gray-500 hover:text-red-400 text-xs"
                      title="Unsubscribe / Remove"
                    >
                      <i className="fa-solid fa-user-minus" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Broadcasts Table */
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12] overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
            <thead className="bg-[#11131a] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Subject & Preview</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Target Audience</th>
                <th className="py-3 px-4 font-semibold">Recipients</th>
                <th className="py-3 px-4 font-semibold">Open Rate</th>
                <th className="py-3 px-4 font-semibold">Click Rate</th>
                <th className="py-3 px-4 font-semibold">Dispatched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {broadcasts.map((bc) => (
                <tr key={bc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 min-w-[280px]">
                    <span className="font-sans font-semibold text-white block truncate">
                      {bc.subject}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate block mt-0.5">
                      {bc.previewText}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold">
                      {bc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">
                    {bc.targetTags.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-white font-semibold">
                    {bc.recipientCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-[#00f0ff] font-bold">
                    {bc.openRate}%
                  </td>
                  <td className="py-3.5 px-4 text-[#10b981] font-bold">
                    {bc.clickRate}%
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {bc.sentAt ? new Date(bc.sentAt).toLocaleDateString() : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Broadcast Composer Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        availableTags={availableTags}
        subscriberCount={subscribers.filter((s) => s.status === 'SUBSCRIBED').length}
        onClose={() => setIsBroadcastModalOpen(false)}
        onCreated={() => {
          loadData();
          setActiveTab('broadcasts');
        }}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Remove Subscriber?"
        description="This will permanently delete this subscriber from the mailing list."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
