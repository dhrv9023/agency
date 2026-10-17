'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SEO & SOCIAL METADATA CARD
 * Live Google SERP preview, OpenGraph social card, and canonical URL settings
 * ==============================================================================
 */

import React, { useState } from 'react';
import { MediaPickerModal } from '@/components/admin/media/media-picker-modal';

interface SEOMetadataProps {
  metaTitle: string;
  metaDesc: string;
  slug: string;
  ogImage: string | null;
  onChangeTitle: (val: string) => void;
  onChangeDesc: (val: string) => void;
  onChangeOgImage: (val: string | null) => void;
}

export function SEOMetadataCard({
  metaTitle,
  metaDesc,
  slug,
  ogImage,
  onChangeTitle,
  onChangeDesc,
  onChangeOgImage,
}: SEOMetadataProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const currentUrl = `https://varah.ai/case-studies/${slug || 'untitled-release'}`;
  const displayTitle = metaTitle || 'Untitled Architecture Release | VARAH SYSTEMS';
  const displayDesc =
    metaDesc ||
    'Autonomous AI automation pipelines and multi-agent systems engineered for immediate enterprise ROI.';

  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white">Search & Social Optimization (SEO)</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Google search result indexing and OpenGraph social card previews
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
          SERP PREVIEW
        </span>
      </div>

      {/* Live Google Search Snippet Preview */}
      <div className="p-4 rounded-lg bg-[#11131a] border border-white/5 font-sans space-y-1">
        <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5 truncate">
          <span className="text-[#00f0ff]">varah.ai</span>
          <span className="text-gray-600">›</span>
          <span className="text-gray-400 truncate">case-studies › {slug || 'untitled'}</span>
        </div>
        <h4 className="text-sm font-medium text-[#38bdf8] hover:underline cursor-pointer truncate">
          {displayTitle}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {/* SEO Form Inputs */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-300">Meta Title</label>
            <span
              className={`text-[10px] font-mono ${
                metaTitle.length > 60 ? 'text-amber-400' : 'text-gray-500'
              }`}
            >
              {metaTitle.length}/60 chars
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="High-impact search title..."
            className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-300">Meta Description</label>
            <span
              className={`text-[10px] font-mono ${
                metaDesc.length > 160 ? 'text-amber-400' : 'text-gray-500'
              }`}
            >
              {metaDesc.length}/160 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={metaDesc}
            onChange={(e) => onChangeDesc(e.target.value)}
            placeholder="Compelling SERP description summarizing business impact..."
            className="w-full p-3 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff] resize-none"
          />
        </div>

        {/* OpenGraph Image Selector */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1.5">
            OpenGraph Social Card Image (1200×630px)
          </label>
          <div className="flex items-center gap-3">
            {ogImage ? (
              <div className="relative w-28 h-16 rounded-lg bg-black/40 overflow-hidden border border-white/10 group">
                <img src={ogImage} alt="OG Card" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChangeOgImage(null)}
                  className="absolute inset-0 bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                >
                  Remove
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setIsMediaPickerOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-photo-film text-[#00f0ff]" />
              <span>{ogImage ? 'Replace Social Image' : 'Select Social Image'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => onChangeOgImage(url)}
        title="Select OpenGraph Social Image"
      />
    </div>
  );
}
