'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — REUSABLE MEDIA PICKER MODAL
 * Invoked from CMS editors to select or upload CDN images and SVG diagrams
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { getMediaItemsAction, uploadMediaAction } from '@/server/actions/media';
import type { MediaItem } from '@/types/admin';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, asset: MediaItem) => void;
  title?: string;
  allowedTypes?: 'images' | 'all';
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  allowedTypes = 'images',
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('fld_all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    getMediaItemsAction({
      folderId: selectedFolder,
      query: search,
      mimeGroup: allowedTypes === 'images' ? 'image' : 'all',
    })
      .then((res) => {
        setItems(res.items);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load media picker items', err);
        setIsLoading(false);
      });
  }, [isOpen, selectedFolder, search, allowedTypes]);

  if (!isOpen) return null;

  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const newItem = await uploadMediaAction({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type || 'image/webp',
        altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        folderId: selectedFolder !== 'fld_all' ? selectedFolder : 'fld_uploads',
      });

      setItems((prev) => [newItem, ...prev]);
      setIsUploading(false);
      onSelect(newItem.url, newItem);
      onClose();
    } catch (err) {
      console.error('Upload failed', err);
      setIsUploading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl text-white flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#11131a]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-photo-film text-[#00f0ff]" />
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <i className="fa-solid fa-cloud-arrow-up text-xs" />
              <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*,.svg"
                onChange={handleSimulatedUpload}
                disabled={isUploading}
              />
            </label>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-white/5"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 border-b border-white/10 bg-[#0c0d12] flex items-center gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets by name or alt text..."
              className="w-full pl-8 pr-4 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>

          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-1.5 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="fld_all">All Folders</option>
            <option value="fld_case_studies">Case Studies</option>
            <option value="fld_blueprints">Blueprints</option>
            <option value="fld_brand">Brand & Emblems</option>
            <option value="fld_uploads">Uploads</option>
          </select>
        </div>

        {/* Media Grid */}
        <div className="p-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 font-mono text-xs space-y-2">
              <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#00f0ff]" />
              <span>Scanning CDN assets...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-gray-500 font-mono text-xs">
              No matching assets found in current folder.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item.url, item);
                    onClose();
                  }}
                  className="group relative rounded-lg border border-white/10 hover:border-[#00f0ff] bg-[#11131a] p-2 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] flex flex-col justify-between"
                >
                  <div className="aspect-video w-full rounded bg-black/40 overflow-hidden mb-2 relative flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.altText || item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-black/70 text-gray-300 border border-white/10">
                      {item.mimeType.split('/')[1]?.toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate group-hover:text-[#00f0ff] transition-colors">
                      {item.filename}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mt-1">
                      <span>{Math.round(item.fileSize / 1024)} KB</span>
                      <span>Used {item.usageCount}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#0c0d12] flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span>Click any image to select</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
