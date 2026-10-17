'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — EMAIL QUICK-REPLY MODAL
 * Template-driven operator outbound email composer with dynamic variable replacement
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import type { Lead } from '@/types/admin';

interface EmailReplyModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSent?: (leadId: string, subject: string) => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: 'discovery',
    name: 'Discovery Call Invitation',
    subject: 'VARAH SYSTEMS // Architectural Discovery for {{company}}',
    body: `Hi {{name}},

Thank you for reaching out to VARAH SYSTEMS regarding your {{service}} requirements.

We reviewed your inquiry: "{{message_snippet}}"

We specialize in designing high-reliability automation pipelines and AI agents for enterprise operations. I would love to walk through our technical architecture blueprint and discuss how we can deploy this solution for {{company}}.

Are you available for a 25-minute technical discovery call this week? You can pick a convenient slot directly on our calendar here:
https://varah.ai/book

Best regards,
Dhruv & Bhavya
Founding Automation Engineers | VARAH SYSTEMS`,
  },
  {
    id: 'proposal',
    name: 'Architecture Proposal & Timeline',
    subject: 'Proposal & Scope: {{service}} for {{company}}',
    body: `Hi {{name}},

Following our discovery analysis, our engineering team has finalized the technical scope and delivery milestones for {{company}}.

Key deliverables:
1. Systems Architecture Specification & API Integrations
2. Autonomous Agent Pipeline with Error Recovery
3. Testing, Validation, and Deployment to Production

Contract value budget estimate: {{budget}}
Delivery timeline: 3-4 Weeks with continuous SLA monitoring.

Let me know when you would like to review the formal contract document.

Best regards,
Operations Lead | VARAH SYSTEMS`,
  },
  {
    id: 'qualification',
    name: 'Technical Qualification Follow-Up',
    subject: 'Quick question regarding your {{service}} integration at {{company}}',
    body: `Hi {{name}},

Thanks for your inquiry. Before we design the system schematic, could you clarify two quick technical details:

1. What existing software tools / databases are in your current stack (e.g. ERP, CRM, Postgres)?
2. Do you have dedicated webhook endpoints or API access available?

Once confirmed, we can prepare an exact integration prototype for {{company}}.

Best regards,
VARAH SYSTEMS Engineering`,
  },
];

export function EmailReplyModal({ isOpen, lead, onClose, onSent }: EmailReplyModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('discovery');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  // Apply template with variable substitution
  useEffect(() => {
    if (!lead) return;

    const template = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

    const messageSnippet =
      lead.message.length > 90 ? `${lead.message.slice(0, 90)}...` : lead.message;

    const replaceVars = (text: string) =>
      text
        .replace(/{{name}}/g, lead.name)
        .replace(/{{company}}/g, lead.company || 'your organization')
        .replace(/{{service}}/g, lead.serviceInterest || 'automation systems')
        .replace(/{{budget}}/g, lead.budgetRange || '$10k-$25k')
        .replace(/{{message_snippet}}/g, messageSnippet);

    setSubject(replaceVars(template.subject));
    setBody(replaceVars(template.body));
    setIsSentSuccess(false);
  }, [selectedTemplateId, lead]);

  if (!isOpen || !lead) return null;

  const handleSend = () => {
    setIsSending(true);

    // Simulate server outbound dispatch via SMTP / Postmark
    setTimeout(() => {
      setIsSending(false);
      setIsSentSuccess(true);
      setTimeout(() => {
        if (onSent) onSent(lead.id, subject);
        onClose();
      }, 1000);
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl p-6 text-white flex flex-col space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <h3 className="text-base font-semibold text-white">
                Compose Outbound Response
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              To: <span className="text-white font-medium">{lead.name}</span> &lt;
              <span className="text-[#00f0ff]">{lead.email}</span>&gt;
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-white/5"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
            Select Agency Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`p-2 rounded-lg text-left text-xs font-mono border transition-all ${
                  selectedTemplateId === tmpl.id
                    ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40 font-semibold shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                    : 'bg-[#11131a] text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Input */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#11131a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#00f0ff] font-sans"
          />
        </div>

        {/* Message Body Textarea */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Message Body</label>
          <textarea
            rows={9}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3.5 bg-[#11131a] border border-white/10 rounded-lg text-xs leading-relaxed text-gray-200 font-mono focus:outline-none focus:border-[#00f0ff] resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="text-[11px] font-mono text-gray-500 flex items-center gap-2">
            <i className="fa-solid fa-lock text-[#10b981]" />
            <span>Outbound tracked via Webhook</span>
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
              type="button"
              disabled={isSending || isSentSuccess}
              onClick={handleSend}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                  <span>Dispatching Email...</span>
                </>
              ) : isSentSuccess ? (
                <>
                  <i className="fa-solid fa-check text-xs" />
                  <span>Email Sent!</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs" />
                  <span>Send Response</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
