'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — AUDIT & COMPLIANCE LEDGER
 * Immutable audit logs tracking all console mutations, logins, and API dispatches
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuditLogsAction } from '@/server/actions/audit';
import { DiffViewerModal } from '@/components/admin/settings/diff-viewer-modal';
import { downloadCsvFile } from '@/lib/export/csv';
import type { AuditLogRecord } from '@/types/admin';

const ACTION_COLORS: Record<string, string> = {
  AUTH_LOGIN: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  LEAD_STAGE_CHANGE: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
  CMS_POST_PUBLISH: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
  TEAM_ROLE_UPDATE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  WEBHOOK_DISPATCH: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  const loadLogs = () => {
    setIsLoading(true);
    getAuditLogsAction({ query: search, action: actionFilter })
      .then((res) => {
        setLogs(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load audit logs', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadLogs();
  }, [search, actionFilter]);

  const handleExportCsv = () => {
    const rows = [
      'Record ID,Timestamp,Operator,Email,Action,Entity Type,Entity ID,IP Address',
      ...logs.map(
        (l) =>
          `"${l.id}","${l.createdAt}","${l.userName || 'System'}","${l.userEmail || ''}","${
            l.action
          }","${l.entityType}","${l.entityId || ''}","${l.ipAddress || ''}"`
      ),
    ];
    downloadCsvFile(rows.join('\r\n'), 'varah_compliance_audit_log.csv');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-mono font-medium text-[#10b981] tracking-wider uppercase">
              COMPLIANCE AUDIT // IMMUTABLE LEDGER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Audit & Mutation Log
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tamper-evident record of all operator actions, state mutations, and API events.
          </p>
        </div>

        {/* Back Link & Export */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-file-arrow-down text-gray-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)]">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by operator, action, or entity ID..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">All Actions</option>
            <option value="LEAD_STAGE_CHANGE">Lead Stage Changes</option>
            <option value="AUTH_LOGIN">Logins</option>
            <option value="CMS_POST_PUBLISH">CMS Publications</option>
            <option value="TEAM_ROLE_UPDATE">Team Role Updates</option>
            <option value="WEBHOOK_DISPATCH">Webhook Dispatches</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
          <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
          <span>Verifying cryptographic log ledger...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-16 text-center text-gray-500 font-mono text-xs bg-[#0c0d12] rounded-xl border border-white/10">
          No audit records matched current filter.
        </div>
      ) : (
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12] overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
            <thead className="bg-[#11131a] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Operator</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Target Entity</th>
                <th className="py-3 px-4 font-semibold">IP Address</th>
                <th className="py-3 px-4 text-right font-semibold">State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {logs.map((log) => {
                const badgeClass =
                  ACTION_COLORS[log.action] || 'bg-white/10 text-gray-300 border-white/20';

                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-semibold text-white truncate">
                        {log.userName || 'System Engine'}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">{log.userEmail || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium">{log.entityType}</span>
                      {log.entityId && (
                        <span className="text-gray-500 text-[10px] block truncate">
                          ID: {log.entityId}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono transition-colors"
                      >
                        Inspect Diff
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Diff Modal */}
      <DiffViewerModal
        isOpen={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
