'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — NEWSLETTER BROADCAST COMPOSER MODAL
 * Targeted email campaign builder with audience segment filtering and scheduling
 * ==============================================================================
 */

import React, { useState } from 'react';
import { createBroadcastAction, type CreateBroadcastInput } from '@/server/actions/newsletter';
import type { NewsletterBroadcast } from '@/types/admin';

interface BroadcastModalProps {
  isOpen: boolean;
  availableTags: string[];
  subscriberCount: number;
  onClose: () => void;
  onCreated: (broadcast: NewsletterBroadcast) => void;
}

export function BroadcastModal({
  isOpen,
  availableTags,
  subscriberCount,
  onClose,
  onCreated,
}: BroadcastModalProps) {
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sendNow, setSendNow] = useState(true);
  const [scheduledFor, setScheduledFor] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setError('Subject and Email Body are required.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const input: CreateBroadcastInput = {
        subject,
        previewText,
        body,
        targetTags: selectedTags,
        sendNow,
        scheduledFor: sendNow ? undefined : scheduledFor,
      };

      const result = await createBroadcastAction(input);
      setIsSending(false);
      onCreated(result);
      onClose();
    } catch (err: unknown) {
      setIsSending(false);
      const msg = err instanceof Error ? err.message : 'Broadcast dispatch failed';
      setError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <h3 className="text-base font-semibold text-white">Compose Agency Broadcast</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Targeted release to verified engineering and enterprise subscribers
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-white/5"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">
              Broadcast Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VARAH Dispatch: Autonomous Multi-Agent Workflows in Production"
              className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">Preview Subtext</label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="How our engineering team eliminated hallucination loops in ERP pipelines..."
              className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          {/* Segment Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-300">Target Audience Segments</label>
              <span className="text-[10px] font-mono text-[#00f0ff]">
                {selectedTags.length === 0
                  ? `All Active Subscribers (${subscriberCount})`
                  : `${selectedTags.length} Tag Filter(s) Active`}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      isSelected
                        ? 'bg-[#00f0ff] text-black font-semibold'
                        : 'bg-[#11131a] text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Textarea */}
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">Email Body Content *</label>
            <textarea
              required
              rows={7}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write broadcast release content, system updates, and architecture links..."
              className="w-full p-3.5 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-[#00f0ff] resize-none leading-relaxed"
            />
          </div>

          {/* Dispatch Mode */}
          <div className="p-3 rounded-lg bg-[#11131a] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-mono">
                <input
                  type="radio"
                  name="dispatchMode"
                  checked={sendNow}
                  onChange={() => setSendNow(true)}
                  className="text-[#00f0ff] focus:ring-0"
                />
                <span>Send Now</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-mono">
                <input
                  type="radio"
                  name="dispatchMode"
                  checked={!sendNow}
                  onChange={() => setSendNow(false)}
                  className="text-[#00f0ff] focus:ring-0"
                />
                <span>Schedule Later</span>
              </label>
            </div>

            {!sendNow && (
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="px-2.5 py-1 bg-black/60 border border-white/10 rounded text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1.5">
              <i className="fa-solid fa-paper-plane text-[#10b981]" />
              <span>Sent via Verified Postmark SMTP</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-50"
              >
                {isSending && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
                <span>{sendNow ? 'Dispatch Broadcast' : 'Schedule Broadcast'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
