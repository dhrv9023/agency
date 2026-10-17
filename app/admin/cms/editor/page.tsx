'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — TECHNICAL ARTICLE & PUBLICATION EDITOR
 * Full-screen Markdown authoring studio with live split preview and SEO inspector
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCMSPostByIdAction, saveCMSPostAction } from '@/server/actions/cms';
import { MarkdownEditor } from '@/components/admin/cms/markdown-editor';
import { SEOMetadataCard } from '@/components/admin/cms/seo-metadata-card';
import { MediaPickerModal } from '@/components/admin/media/media-picker-modal';
import type { CMSPost, ContentStatus } from '@/types/admin';

export default function ArticleEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(['Architecture', 'Agents']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<ContentStatus>('DRAFT');

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [ogImage, setOgImage] = useState<string | null>(null);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!!postId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing post if editing
  useEffect(() => {
    if (!postId) return;

    getCMSPostByIdAction(postId)
      .then((post) => {
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setExcerpt(post.excerpt || '');
          setContent(post.content);
          setCoverImage(post.coverImage);
          setTags(post.tags);
          setStatus(post.status);
          setMetaTitle(post.metaTitle || post.title);
          setMetaDesc(post.metaDesc || post.excerpt || '');
          setOgImage(post.ogImage || post.coverImage);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load post', err);
        setIsLoading(false);
      });
  }, [postId]);

  const handleSave = async (targetStatus?: ContentStatus) => {
    if (!title.trim() || !content.trim()) {
      setError('Article Title and Markdown Content are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const effectiveStatus = targetStatus || status;

    try {
      await saveCMSPostAction({
        id: postId || undefined,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags,
        status: effectiveStatus,
        metaTitle,
        metaDesc,
        ogImage,
      });

      setIsSaving(false);
      router.push('/admin/cms?tab=articles');
    } catch (err: unknown) {
      setIsSaving(false);
      const msg = err instanceof Error ? err.message : 'Failed to publish article';
      setError(msg);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
        <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
        <span>Loading article editor buffer...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editor Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {postId ? 'Edit Technical Article' : 'New Technical Article & Release'}
            </h1>
            <p className="text-xs text-gray-400">
              State: <span className="text-[#00f0ff] font-mono">{status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-1.5"
          >
            {isSaving && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
            <span>Publish to Live Site</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {/* Article Metadata Form */}
      <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Article Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Engineering Autonomous Agent Topologies: Memory Systems & Guardrails"
            className="w-full px-3.5 py-2.5 bg-[#11131a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="engineering-autonomous-agent-topologies"
              className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-300 block mb-1">Cover Image</label>
            <div className="flex items-center gap-3">
              {coverImage ? (
                <div className="w-14 h-9 rounded bg-[#11131a] border border-white/10 overflow-hidden shrink-0">
                  <img src={coverImage} alt="" className="w-full h-full object-cover" />
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2 flex-1"
              >
                <i className="fa-solid fa-photo-film text-[#00f0ff]" />
                <span className="truncate">{coverImage ? 'Change Cover' : 'Choose Cover from Media CDN'}</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Summary / Excerpt</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Concise summary for feed cards and newsletter previews..."
            className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1.5">Article Tags</label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded text-xs font-mono bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-red-400"
                >
                  <i className="fa-solid fa-xmark text-[10px]" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ Add tag & press Enter..."
              className="px-3 py-1 bg-[#11131a] border border-white/10 rounded text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>
      </div>

      {/* Split Markdown Editor Pane */}
      <div>
        <label className="text-xs font-semibold text-white block mb-2">
          Markdown Content Specification
        </label>
        <MarkdownEditor content={content} onChange={(val) => setContent(val)} />
      </div>

      {/* SEO Metadata Card */}
      <SEOMetadataCard
        metaTitle={metaTitle}
        metaDesc={metaDesc}
        slug={slug}
        ogImage={ogImage}
        onChangeTitle={(t) => setMetaTitle(t)}
        onChangeDesc={(d) => setMetaDesc(d)}
        onChangeOgImage={(img) => setOgImage(img)}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => setCoverImage(url)}
        title="Select Article Cover Image"
      />
    </div>
  );
}
