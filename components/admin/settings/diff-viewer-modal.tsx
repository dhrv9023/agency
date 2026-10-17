'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — AUDIT DIFF VIEWER MODAL
 * Structured mutation inspection comparing previous vs. new state attributes
 * ==============================================================================
 */

import React from 'react';
import type { AuditLogRecord } from '@/types/admin';

interface DiffViewerModalProps {
  isOpen: boolean;
  log: AuditLogRecord | null;
  onClose: () => void;
}

export function DiffViewerModal({ isOpen, log, onClose }: DiffViewerModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl p-6 text-white space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
              <h3 className="text-base font-semibold text-white">Mutation Diff Inspector</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              Action: <span className="text-[#00f0ff] font-bold">{log.action}</span> // Entity:{' '}
              {log.entityType} ({log.entityId || 'N/A'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-white/5"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Actor & Session Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-[#11131a] border border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-gray-500 block">Operator</span>
            <span className="text-white truncate block">{log.userName || 'System'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">IP Address</span>
            <span className="text-gray-300 truncate block">{log.ipAddress || '127.0.0.1'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Timestamp</span>
            <span className="text-gray-300 truncate block">
              {new Date(log.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Audit Record</span>
            <span className="text-gray-400 truncate block">{log.id}</span>
          </div>
        </div>

        {/* Diff View Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Diff Before */}
          <div className="p-3.5 rounded-lg bg-[#11131a] border border-red-500/20 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/5">
              <span className="text-red-400 font-bold uppercase tracking-wider">
                State Before Mutation
              </span>
              <span className="text-gray-500 text-[10px]">PREVIOUS</span>
            </div>
            {log.diffBefore ? (
              <pre className="text-gray-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(log.diffBefore, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-600 text-xs italic py-4 text-center">
                Initial creation / No prior state
              </p>
            )}
          </div>

          {/* Diff After */}
          <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#10b981]/30 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/5">
              <span className="text-[#10b981] font-bold uppercase tracking-wider">
                State After Mutation
              </span>
              <span className="text-gray-500 text-[10px]">COMMITTED</span>
            </div>
            {log.diffAfter ? (
              <pre className="text-gray-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(log.diffAfter, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-600 text-xs italic py-4 text-center">
                Record deleted / No after state
              </p>
            )}
          </div>
        </div>

        {/* Metadata Payload if Present */}
        {log.metadata && (
          <div className="p-3 rounded-lg bg-[#11131a] border border-white/5 font-mono text-xs space-y-1">
            <span className="text-[10px] uppercase text-gray-500 block">Context Metadata</span>
            <pre className="text-gray-300 text-[11px] overflow-x-auto">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
