'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — CMS & CONTENT MANAGEMENT CONSOLE
 * Articles, technical blueprints, and enterprise case studies
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  getCMSPostsAction,
  deleteCMSPostAction,
  getCMSCaseStudiesAction,
  deleteCMSCaseStudyAction,
} from '@/server/actions/cms';
import { PostListTable } from '@/components/admin/cms/post-list-table';
import { ConfirmDialog } from '@/components/admin/leads/confirm-dialog';
import type { CMSPost, CMSCaseStudy, ContentStatus } from '@/types/admin';

type CMSTab = 'articles' | 'case-studies';

export default function CMSPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as CMSTab) || 'articles';

  const [activeTab, setActiveTab] = useState<CMSTab>(initialTab);
  const [posts, setPosts] = useState<CMSPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CMSCaseStudy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const loadData = () => {
    setIsLoading(true);
    if (activeTab === 'articles') {
      getCMSPostsAction({ query: searchQuery, status: statusFilter })
        .then((res) => {
          setPosts(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load posts', err);
          setIsLoading(false);
        });
    } else {
      getCMSCaseStudiesAction()
        .then((res) => {
          setCaseStudies(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load case studies', err);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, searchQuery, statusFilter]);

  const handleDeletePost = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Technical Publication?',
      description: 'This will remove the markdown article from the public site.',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await deleteCMSPostAction(id);
        loadData();
      },
    });
  };

  const handleDeleteCaseStudy = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Case Study?',
      description: 'This will remove the client success story and ROI metrics from the public portfolio.',
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        await deleteCMSCaseStudyAction(id);
        loadData();
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Publication Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-mono font-medium text-[#10b981] tracking-wider uppercase">
              CONTENT ENGINE // PRODUCTION RELEASES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            CMS & Publications Engine
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Author and deploy technical blueprints, case studies, and engineering updates.
          </p>
        </div>

        {/* Create Buttons */}
        <div className="flex items-center gap-3">
          {activeTab === 'articles' ? (
            <Link
              href="/admin/cms/editor"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <i className="fa-solid fa-pen-nib text-xs" />
              <span>Write Article</span>
            </Link>
          ) : (
            <Link
              href="/admin/cms/case-studies/editor"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <i className="fa-solid fa-plus text-xs" />
              <span>New Case Study</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-file-lines text-xs" />
          <span>Articles & Releases ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('case-studies')}
          className={`pb-2.5 text-xs font-mono transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'case-studies'
              ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-award text-xs" />
          <span>Case Studies & ROI Blueprints ({caseStudies.length})</span>
        </button>
      </div>

      {/* Search & Filter Bar (Articles Tab) */}
      {activeTab === 'articles' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)]">
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or slug..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'ALL')}
              className="px-2.5 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
          <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
          <span>Loading content registry...</span>
        </div>
      ) : activeTab === 'articles' ? (
        <PostListTable posts={posts} onDelete={handleDeletePost} />
      ) : (
        /* Case Studies Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="rounded-xl bg-[#0c0d12] border border-white/10 hover:border-[#00f0ff]/40 transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="aspect-video w-full rounded-lg bg-[#070709] overflow-hidden mb-3 border border-white/5 relative">
                  <img
                    src={cs.heroImageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-[#00f0ff] border border-white/10 font-bold">
                    {cs.industry}
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#10b981] font-semibold">
                    {cs.clientName}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(cs.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#00f0ff] transition-colors leading-snug">
                  {cs.title}
                </h3>

                {/* ROI Results Metric Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#11131a] border border-white/5 my-3">
                  {cs.results.map((res, i) => (
                    <div key={i} className="text-center font-mono">
                      <div className="text-sm font-bold text-[#10b981]">{res.value}</div>
                      <div className="text-[9px] text-gray-400 truncate">{res.metric}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {cs.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/case-studies/${cs.slug}`}
                  target="_blank"
                  className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                  <span>Preview Page</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/cms/case-studies/editor?id=${cs.id}`}
                    className="px-3 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono transition-colors"
                  >
                    Edit Case Study
                  </Link>
                  <button
                    onClick={() => handleDeleteCaseStudy(cs.id)}
                    className="p-1 text-gray-500 hover:text-red-400 text-xs transition-colors"
                    title="Delete Case Study"
                  >
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
