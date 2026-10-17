'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — MEDIA ASSET LIBRARY CONSOLE
 * Global CDN asset management, drag & drop uploads, folder organization, and usage tracking
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  getMediaItemsAction,
  uploadMediaAction,
  type GetMediaParams,
} from '@/server/actions/media';
import { MediaDetailModal } from '@/components/admin/media/media-detail-modal';
import type { MediaItem, MediaFolder } from '@/types/admin';

type ViewMode = 'grid' | 'list';

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [selectedFolderId, setSelectedFolderId] = useState('fld_all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mimeFilter, setMimeFilter] = useState<'all' | 'image' | 'svg' | 'document'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [inspectingAsset, setInspectingAsset] = useState<MediaItem | null>(null);

  const loadMedia = () => {
    setIsLoading(true);
    const params: GetMediaParams = {
      folderId: selectedFolderId,
      query: searchQuery,
      mimeGroup: mimeFilter,
    };

    getMediaItemsAction(params)
      .then((res) => {
        setItems(res.items);
        setFolders(res.folders);
        setTotalSize(res.totalSize);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load media assets', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadMedia();
  }, [selectedFolderId, searchQuery, mimeFilter]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadMediaAction({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type || 'image/webp',
        altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        folderId: selectedFolderId !== 'fld_all' ? selectedFolderId : 'fld_uploads',
      });
      setIsUploading(false);
      loadMedia();
    } catch (err) {
      console.error('Upload failed', err);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Storage Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
            <span className="text-xs font-mono font-medium text-[#00f0ff] tracking-wider uppercase">
              ASSET STORAGE // EDGE CDN CLUSTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Media & Asset Library
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Centrally manage architecture diagrams, case study assets, vector emblems, and client deliverables.
          </p>
        </div>

        {/* Storage Pill & Upload Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#11131a] border border-white/10 text-xs font-mono text-gray-300">
            <i className="fa-solid fa-server text-[#10b981]" />
            <span>{(totalSize / (1024 * 1024)).toFixed(2)} MB Used</span>
          </div>

          <label className="cursor-pointer px-4 py-2 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up text-xs" />
            <span>{isUploading ? 'Optimizing & Uploading...' : 'Upload Media Asset'}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Folder Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {folders.map((folder) => {
          const isActive = selectedFolderId === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#00f0ff] text-black font-semibold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'bg-[#11131a] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <span>{folder.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] ${
                  isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                }`}
              >
                {folder.fileCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by filename or alt text..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] font-sans"
          />
        </div>

        {/* Format Filter & View Mode Toggles */}
        <div className="flex items-center gap-3">
          <select
            value={mimeFilter}
            onChange={(e) =>
              setMimeFilter(e.target.value as 'all' | 'image' | 'svg' | 'document')
            }
            className="px-2.5 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="all">All Formats</option>
            <option value="image">Images (WebP, PNG, JPG)</option>
            <option value="svg">Vector SVGs</option>
            <option value="document">PDFs & Documents</option>
          </select>

          <div className="flex items-center p-0.5 bg-[#11131a] rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-[#00f0ff] text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <i className="fa-solid fa-grip" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'list' ? 'bg-[#00f0ff] text-black' : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <i className="fa-solid fa-list" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Asset Canvas */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
          <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
          <span>Scanning CDN storage nodes...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center rounded-xl bg-[#0c0d12] border border-dashed border-white/10 p-8">
          <i className="fa-solid fa-folder-open text-3xl text-gray-600 mb-3 block" />
          <h3 className="text-sm font-semibold text-white">No Assets Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Drag and drop images or diagrams to upload them directly into the current folder.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const isImage = item.mimeType.startsWith('image/');

            return (
              <div
                key={item.id}
                onClick={() => setInspectingAsset(item)}
                className="group rounded-xl bg-[#0c0d12] border border-white/10 hover:border-[#00f0ff]/50 p-3 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] flex flex-col justify-between"
              >
                {/* Thumbnail Display */}
                <div className="aspect-video w-full rounded-lg bg-[#070709] overflow-hidden mb-3 relative flex items-center justify-center border border-white/5">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <i className="fa-solid fa-file-pdf text-3xl text-red-400" />
                  )}

                  {/* Format & Usage Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 backdrop-blur-sm text-gray-200 border border-white/10">
                      {item.mimeType.split('/')[1]?.toUpperCase()}
                    </span>
                  </div>

                  {item.usageCount > 0 && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 font-semibold">
                      {item.usageCount}x Used
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div>
                  <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#00f0ff] transition-colors">
                    {item.filename}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mt-1.5">
                    <span>{Math.round(item.fileSize / 1024)} KB</span>
                    <span>{item.width && item.height ? `${item.width}×${item.height}` : 'Vector'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12] overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
            <thead className="bg-[#11131a] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Asset</th>
                <th className="py-3 px-4 font-semibold">Folder</th>
                <th className="py-3 px-4 font-semibold">Dimensions</th>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Usage</th>
                <th className="py-3 px-4 font-semibold">Uploaded</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setInspectingAsset(item)}
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-7 rounded bg-[#11131a] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-sans font-semibold text-white group-hover:text-[#00f0ff] truncate max-w-xs">
                        {item.filename}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{item.folderName}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {item.width && item.height ? `${item.width} × ${item.height}` : 'Vector'}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{Math.round(item.fileSize / 1024)} KB</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-gray-300">
                      {item.usageCount} refs
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingAsset(item);
                      }}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[11px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Detail & Inspector Modal */}
      <MediaDetailModal
        isOpen={!!inspectingAsset}
        asset={inspectingAsset}
        folders={folders}
        onClose={() => setInspectingAsset(null)}
        onUpdated={(updated) => {
          setInspectingAsset(updated);
          loadMedia();
        }}
        onDeleted={() => {
          setInspectingAsset(null);
          loadMedia();
        }}
      />
    </div>
  );
}
