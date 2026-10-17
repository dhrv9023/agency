'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — MEDIA ASSET DETAIL MODAL
 * High-resolution preview, CDN link copying, alt-text editor, and safe deletion
 * ==============================================================================
 */

import React, { useState } from 'react';
import { updateMediaAction, deleteMediaAction } from '@/server/actions/media';
import type { MediaItem, MediaFolder } from '@/types/admin';

interface MediaDetailModalProps {
  isOpen: boolean;
  asset: MediaItem | null;
  folders: MediaFolder[];
  onClose: () => void;
  onUpdated: (updated: MediaItem) => void;
  onDeleted: (id: string) => void;
}

export function MediaDetailModal({
  isOpen,
  asset,
  folders,
  onClose,
  onUpdated,
  onDeleted,
}: MediaDetailModalProps) {
  const [altText, setAltText] = useState(asset?.altText || '');
  const [folderId, setFolderId] = useState(asset?.folderId || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync state when asset changes
  React.useEffect(() => {
    if (asset) {
      setAltText(asset.altText || '');
      setFolderId(asset.folderId || '');
      setDeleteError(null);
      setIsCopied(false);
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSaveMetadata = async () => {
    setIsSaving(true);
    try {
      const updated = await updateMediaAction(asset.id, {
        altText,
        folderId,
      });
      onUpdated(updated);
      setIsSaving(false);
    } catch (err) {
      console.error('Failed to update asset metadata', err);
      setIsSaving(false);
    }
  };

  const handleDelete = async (force: boolean = false) => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteMediaAction(asset.id, force);
      setIsDeleting(false);
      onDeleted(asset.id);
      onClose();
    } catch (err: unknown) {
      setIsDeleting(false);
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setDeleteError(msg);
    }
  };

  const isImage = asset.mimeType.startsWith('image/');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#0c0d12] border border-[rgba(255,255,255,0.14)] rounded-xl shadow-2xl text-white flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Preview Canvas */}
        <div className="w-full md:w-1/2 bg-[#070709] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
          {isImage ? (
            <img
              src={asset.url}
              alt={asset.altText || asset.filename}
              className="max-h-[340px] max-w-full object-contain rounded-lg border border-white/10 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-gray-400 space-y-2">
              <i className="fa-solid fa-file-pdf text-4xl text-red-400" />
              <span className="text-xs font-mono uppercase">{asset.mimeType.split('/')[1]}</span>
            </div>
          )}

          {/* Quick Copy Link Pill */}
          <button
            onClick={handleCopyUrl}
            className="mt-4 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <i className={`fa-solid ${isCopied ? 'fa-check text-[#10b981]' : 'fa-copy'}`} />
            <span>{isCopied ? 'CDN URL Copied!' : 'Copy Direct CDN Link'}</span>
          </button>
        </div>

        {/* Right: Technical Inspector & Controls */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white truncate max-w-[220px]">
                {asset.filename}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-white/5"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Safety Warning if Active References Exist */}
            {asset.usageCount > 0 && (
              <div className="p-3 mb-3 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-xs text-gray-300 flex items-start gap-2">
                <i className="fa-solid fa-link text-[#00f0ff] mt-0.5 shrink-0" />
                <span>
                  Actively referenced in{' '}
                  <strong className="text-[#00f0ff]">{asset.usageCount} location(s)</strong> across
                  published case studies & pages.
                </span>
              </div>
            )}

            {/* Error Banner */}
            {deleteError && (
              <div className="p-3 mb-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span>{deleteError}</span>
                </div>
                <button
                  onClick={() => handleDelete(true)}
                  className="px-2.5 py-1 rounded bg-red-500 text-white font-semibold text-[11px] self-start hover:bg-red-600 transition-colors"
                >
                  Force Delete Anyway
                </button>
              </div>
            )}

            {/* Technical Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-3 rounded-lg bg-[#11131a] border border-white/5 mb-4">
              <div>
                <span className="text-gray-500 block">File Size</span>
                <span className="text-gray-200">{Math.round(asset.fileSize / 1024)} KB</span>
              </div>
              <div>
                <span className="text-gray-500 block">Format</span>
                <span className="text-gray-200">{asset.mimeType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Dimensions</span>
                <span className="text-gray-200">
                  {asset.width && asset.height ? `${asset.width} × ${asset.height} px` : 'Vector / N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Uploaded</span>
                <span className="text-gray-200">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">
                  Folder Category
                </label>
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
                >
                  {folders
                    .filter((f) => f.id !== 'fld_all')
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">
                  Accessible Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe this image for screen readers and search bots..."
                  className="w-full px-3 py-2 bg-[#11131a] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => handleDelete(false)}
              disabled={isDeleting}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-red-500/10 transition-colors"
            >
              <i className="fa-solid fa-trash-can" />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSaveMetadata}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#38bdf8] text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                {isSaving && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
                <span>Save Metadata</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
