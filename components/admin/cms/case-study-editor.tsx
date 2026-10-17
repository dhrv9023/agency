'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — CASE STUDY & ARCHITECTURE EDITOR
 * Enterprise client success stories, metrics & ROI builder, and tech stack tagging
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCMSCaseStudyAction } from '@/server/actions/cms';
import { MediaPickerModal } from '@/components/admin/media/media-picker-modal';
import type { CMSCaseStudy, CaseStudyResult, ContentStatus } from '@/types/admin';

interface CaseStudyEditorProps {
  initialData?: CMSCaseStudy | null;
  onSaved?: (saved: CMSCaseStudy) => void;
}

export function CaseStudyEditor({ initialData, onSaved }: CaseStudyEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [industry, setIndustry] = useState(initialData?.industry || '');
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialData?.heroImageUrl ||
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  );
  const [featured, setFeatured] = useState(initialData?.featured ?? true);
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'PUBLISHED');

  // ROI Results Metrics
  const [results, setResults] = useState<CaseStudyResult[]>(
    initialData?.results || [
      { metric: 'Manual Processing Hours', value: '45h / week', change: '-87%' },
      { metric: 'Reconciliation Accuracy', value: '99.4%', change: '+14%' },
    ]
  );

  // Tech Stack Tags
  const [techStack, setTechStack] = useState<string[]>(
    initialData?.techStack || ['Python', 'FastAPI', 'OpenAI Vision', 'SAP BAPI', 'pgvector']
  );
  const [newTagInput, setNewTagInput] = useState('');

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMetric = () => {
    setResults([...results, { metric: 'Cycle Time', value: '3.2 min', change: '-90%' }]);
  };

  const handleUpdateMetric = (index: number, field: keyof CaseStudyResult, value: string) => {
    const next = [...results];
    next[index] = { ...next[index], [field]: value };
    setResults(next);
  };

  const handleRemoveMetric = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleAddTechTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(newTagInput.trim())) {
        setTechStack([...techStack, newTagInput.trim()]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim() || !clientName.trim()) {
      setError('Title and Client Name are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const saved = await saveCMSCaseStudyAction({
        id: initialData?.id,
        title,
        slug,
        clientName,
        industry,
        challenge,
        solution,
        results,
        techStack,
        heroImageUrl,
        featured,
        status,
      });

      setIsSaving(false);
      if (onSaved) onSaved(saved);
      else router.push('/admin/cms?tab=case-studies');
    } catch (err: unknown) {
      setIsSaving(false);
      const msg = err instanceof Error ? err.message : 'Failed to save case study';
      setError(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {initialData ? 'Edit Architecture Case Study' : 'New Client Architecture Case Study'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Document verified business ROI, technical specifications, and system integration schematics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            className="px-3 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-[#00f0ff] focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-50"
          >
            {isSaving && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
            <span>Save Case Study</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {/* Core Credentials */}
      <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">
            Case Study Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Autonomous SAP Invoice & Manifest Extraction Engine"
            className="w-full px-3.5 py-2.5 bg-[#11131a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">
              Client / Organization *
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Supply Chain Logistics"
              className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Global Freight & Supply Chain"
              className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-supply-chain-logistics"
              className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        {/* Hero Architecture Image */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">
            Hero Architecture Diagram / Cover Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 rounded-lg bg-[#11131a] border border-white/10 overflow-hidden relative group">
              <img src={heroImageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setIsMediaPickerOpen(true)}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-photo-film text-[#00f0ff]" />
              <span>Choose from Media CDN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Challenge & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold block">
            1. Operational Bottleneck / Challenge
          </label>
          <textarea
            rows={5}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Describe the operational inefficiency, manual costs, or integration gaps before automation..."
            className="w-full p-3 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff] resize-none leading-relaxed"
          />
        </div>

        <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#10b981] font-semibold block">
            2. Engineered Architecture / Solution
          </label>
          <textarea
            rows={5}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Detail the autonomous pipelines, models, guardrails, and APIs deployed..."
            className="w-full p-3 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff] resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* ROI & Results Metric Builder */}
      <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Verified Business ROI Metrics</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Highlight empirical percentage improvements and hours saved
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddMetric}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#00f0ff] transition-colors flex items-center gap-1.5"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            <span>Add Metric</span>
          </button>
        </div>

        <div className="space-y-3">
          {results.map((res, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[#11131a] border border-white/5 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  value={res.metric}
                  onChange={(e) => handleUpdateMetric(i, 'metric', e.target.value)}
                  placeholder="Metric Name (e.g. Processing Time)"
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white"
                />
              </div>
              <div className="w-full sm:w-36">
                <input
                  type="text"
                  value={res.value}
                  onChange={(e) => handleUpdateMetric(i, 'value', e.target.value)}
                  placeholder="Outcome (e.g. 3.2 min)"
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded text-xs font-mono text-[#10b981]"
                />
              </div>
              <div className="w-full sm:w-28">
                <input
                  type="text"
                  value={res.change || ''}
                  onChange={(e) => handleUpdateMetric(i, 'change', e.target.value)}
                  placeholder="Delta (-87%)"
                  className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded text-xs font-mono text-[#00f0ff]"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMetric(i)}
                className="text-gray-500 hover:text-red-400 p-1.5"
              >
                <i className="fa-solid fa-trash-can text-xs" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Tags */}
      <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-3">
        <label className="text-xs font-semibold text-white block">
          Integrated Technologies & APIs
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {techStack.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-gray-200 flex items-center gap-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTechTag(tag)}
                className="text-gray-500 hover:text-red-400"
              >
                <i className="fa-solid fa-xmark text-[10px]" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleAddTechTag}
            placeholder="Type technology & press Enter (e.g. PostgreSQL, Redis)..."
            className="px-3 py-1 bg-[#11131a] border border-white/10 rounded-md text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff] min-w-[260px]"
          />
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setHeroImageUrl(url)}
        title="Select Case Study Architecture Cover Image"
      />
    </div>
  );
}
