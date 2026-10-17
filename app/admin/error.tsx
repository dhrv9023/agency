'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — GLOBAL ADMIN ERROR BOUNDARY
 * Resilient App Router error boundary with diagnostic inspection, state recovery,
 * and seamless retry mechanisms.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Log unexpected errors to telemetry buffer
    console.error('[VARAH_ADMIN_ERROR_BOUNDARY]:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  const handleCopyDiagnostics = async () => {
    const diagnosticPayload = {
      timestamp: new Date().toISOString(),
      digest: error.digest || 'ERR_UNSPECIFIED_DIAGNOSTIC',
      message: error.message,
      stack: error.stack || 'No stack trace captured',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(JSON.stringify(diagnosticPayload, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-2xl bg-[#0b0c10] border border-rose-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-rose-400 uppercase">
                  Telemetry Alert
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {error.digest ? `DIGEST:${error.digest.slice(0, 8)}` : 'SYS_EXC'}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-white mt-0.5">
                Runtime Exception Encountered
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyDiagnostics}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14161f] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-gray-400 hover:text-white hover:border-[#00f0ff]/40 transition-colors"
            title="Copy diagnostic payload for engineering triage"
          >
            <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-copy'}`} />
            <span>{copied ? 'Copied' : 'Copy Anomaly'}</span>
          </button>
        </div>

        {/* Error Description */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-300 leading-relaxed">
            The active console process caught an unhandled exception while executing this operation.
            State changes have been protected from corrupting the master database ledger.
          </p>

          <div className="p-3.5 rounded-xl bg-black/40 border border-[rgba(255,255,255,0.06)] font-mono text-xs text-rose-300/90 break-words">
            <span className="text-gray-500 select-none mr-2">&gt;</span>
            {error.message || 'An unexpected internal error interrupted server rendering.'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs font-semibold tracking-wide uppercase shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right" />
            <span>Re-calibrate &amp; Retry</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14161f] hover:bg-[#1a1c26] text-gray-200 text-xs font-semibold border border-[rgba(255,255,255,0.08)] transition-all cursor-pointer"
          >
            <i className="fa-solid fa-gauge-high text-gray-400" />
            <span>Console Overview</span>
          </button>

          <Link
            href="/admin/settings/audit-log"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14161f] hover:bg-[#1a1c26] text-gray-200 text-xs font-semibold border border-[rgba(255,255,255,0.08)] transition-all"
          >
            <i className="fa-solid fa-file-shield text-gray-400" />
            <span>Audit Ledger</span>
          </Link>
        </div>

        {/* Collapsible Technical Trace */}
        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.08)]">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-gray-200 transition-colors"
          >
            <i className={`fa-solid fa-chevron-${showDetails ? 'down' : 'right'} text-[10px]`} />
            <span>{showDetails ? 'Hide' : 'Inspect'} Raw Exception Stack</span>
          </button>

          {showDetails && (
            <div className="mt-3 p-4 rounded-xl bg-black/60 border border-[rgba(255,255,255,0.06)] overflow-x-auto max-h-56 text-[11px] font-mono text-gray-400 space-y-1">
              <div className="text-gray-500">// Stack trace dump</div>
              <pre className="whitespace-pre-wrap leading-relaxed text-gray-300">
                {error.stack || error.message || 'No stack trace available for this environment.'}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
