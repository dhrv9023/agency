'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — CMS ARTICLES & RELEASES TABLE
 * High-density table listing technical posts, publishing states, and quick actions
 * ==============================================================================
 */

import React from 'react';
import Link from 'next/link';
import type { CMSPost, ContentStatus } from '@/types/admin';

interface PostListTableProps {
  posts: CMSPost[];
  onDelete: (id: string) => void;
}

const STATUS_BADGES: Record<ContentStatus, { label: string; class: string }> = {
  DRAFT: { label: 'Draft', class: 'bg-white/10 text-gray-300 border-white/20' },
  PUBLISHED: { label: 'Published', class: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30 font-bold' },
  SCHEDULED: { label: 'Scheduled', class: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  ARCHIVED: { label: 'Archived', class: 'bg-gray-500/10 text-gray-500 border-gray-500/30' },
};

export function PostListTable({ posts, onDelete }: PostListTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12]">
      <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
        <thead className="bg-[#11131a] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10 select-none">
          <tr>
            <th className="py-3 px-4 font-semibold">Article / Release Title</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Reading Time</th>
            <th className="py-3 px-4 font-semibold">Tags</th>
            <th className="py-3 px-4 font-semibold">Author</th>
            <th className="py-3 px-4 font-semibold">Published</th>
            <th className="py-3 px-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-gray-500 font-mono">
                No technical articles match current filter.
              </td>
            </tr>
          ) : (
            posts.map((post) => {
              const statusBadge = STATUS_BADGES[post.status] || STATUS_BADGES.DRAFT;

              return (
                <tr
                  key={post.id}
                  className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 min-w-[280px]">
                    <Link
                      href={`/admin/cms/editor?id=${post.id}`}
                      className="font-semibold text-white group-hover:text-[#00f0ff] transition-colors block truncate"
                    >
                      {post.title}
                    </Link>
                    <span className="text-[11px] font-mono text-gray-500 truncate block mt-0.5">
                      /case-studies/{post.slug}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${statusBadge.class}`}
                    >
                      {statusBadge.label}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-gray-300 whitespace-nowrap">
                    {post.readingTimeMin} min read
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap font-medium">
                    {post.authorName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap text-[11px]">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/cms/editor?id=${post.id}`}
                        className="px-2.5 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(post.id)}
                        className="p-1 text-gray-500 hover:text-red-400 text-xs transition-colors"
                        title="Delete Post"
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
