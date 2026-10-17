'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — CONFIRMATION DIALOG MODAL
 * Accessible destructive action confirmation modal with loading feedback
 * ==============================================================================
 */

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
              isDestructive
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30'
            }`}
          >
            <i
              className={`fa-solid ${
                isDestructive ? 'fa-triangle-exclamation' : 'fa-circle-question'
              }`}
            />
          </div>
          <div>
            <h3 id="confirm-dialog-title" className="text-base font-semibold text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-[#00f0ff] hover:bg-[#38bdf8] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
            }`}
          >
            {isLoading && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
