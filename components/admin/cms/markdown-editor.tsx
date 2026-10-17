'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SPLIT-PANE MARKDOWN EDITOR
 * Live preview rendering, format toolbar, syntax shortcuts, and CDN media insertion
 * ==============================================================================
 */

import React, { useState, useRef } from 'react';
import { MediaPickerModal } from '@/components/admin/media/media-picker-modal';

interface MarkdownEditorProps {
  content: string;
  onChange: (val: string) => void;
  minHeight?: string;
}

export function MarkdownEditor({ content, onChange, minHeight = '420px' }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute Word & Reading Metrics
  const words = content.split(/\s+/).filter(Boolean).length;
  const chars = content.length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = content.substring(start, end);

    const replacement = `${prefix}${selection || 'text'}${suffix}`;
    const nextContent = content.substring(0, start) + replacement + content.substring(end);

    onChange(nextContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selection.length || 4));
    }, 50);
  };

  const handleInsertMedia = (url: string) => {
    insertFormat(`\n![Media Asset](${url})\n`);
  };

  // Lightweight resilient Markdown to HTML preview renderer
  const renderPreview = (markdown: string) => {
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2 pb-1 border-b border-white/10">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-[#00f0ff]">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-200">$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="p-3 my-3 rounded-lg bg-[#070709] border border-white/10 font-mono text-xs overflow-x-auto text-[#00f0ff]">$1</pre>')
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-[#00f0ff]">$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-2 border-[#00f0ff] pl-3 my-2 text-gray-400 italic text-xs">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-300 text-xs">$1</li>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="my-4 rounded-lg border border-white/10 max-h-80 w-auto object-cover" />')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" class="text-[#00f0ff] hover:underline">$1</a>')
      .replace(/\n$/gim, '<br />');

    return { __html: html };
  };

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0d12] flex flex-col overflow-hidden">
      {/* Editor Formatting Toolbar */}
      <div className="p-2.5 border-b border-white/10 bg-[#11131a] flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Heading 2"
            onClick={() => insertFormat('## ')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center"
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => insertFormat('### ')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center"
          >
            H3
          </button>
          <span className="w-[1px] h-4 bg-white/10 mx-1" />
          <button
            type="button"
            title="Bold"
            onClick={() => insertFormat('**', '**')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center justify-center"
          >
            <i className="fa-solid fa-bold" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => insertFormat('*', '*')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center justify-center"
          >
            <i className="fa-solid fa-italic" />
          </button>
          <button
            type="button"
            title="Code Block"
            onClick={() => insertFormat('```\n', '\n```')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center justify-center"
          >
            <i className="fa-solid fa-code" />
          </button>
          <button
            type="button"
            title="Bullet List"
            onClick={() => insertFormat('- ')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center justify-center"
          >
            <i className="fa-solid fa-list-ul" />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() => insertFormat('> ')}
            className="w-7 h-7 rounded hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center justify-center"
          >
            <i className="fa-solid fa-quote-left" />
          </button>
          <span className="w-[1px] h-4 bg-white/10 mx-1" />
          <button
            type="button"
            title="Insert CDN Media Asset"
            onClick={() => setIsMediaPickerOpen(true)}
            className="px-2.5 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <i className="fa-solid fa-photo-film text-[10px]" />
            <span>Media Asset</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-black/40 rounded-lg border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2 py-0.5 rounded ${
              viewMode === 'edit' ? 'bg-[#00f0ff] text-black font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-2 py-0.5 rounded ${
              viewMode === 'split' ? 'bg-[#00f0ff] text-black font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2 py-0.5 rounded ${
              viewMode === 'preview' ? 'bg-[#00f0ff] text-black font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Pane Layout */}
      <div className="flex-1 flex divide-x divide-white/10" style={{ minHeight }}>
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="flex-1 flex flex-col">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="# Write markdown release notes, systems architecture specs, or code samples..."
              className="w-full flex-1 p-4 bg-[#0c0d12] text-xs font-mono leading-relaxed text-gray-200 placeholder-gray-600 focus:outline-none resize-none"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-5 overflow-y-auto bg-[#070709] max-h-[600px]">
            {content.trim() ? (
              <div
                className="prose prose-invert max-w-none text-xs leading-relaxed"
                dangerouslySetInnerHTML={renderPreview(content)}
              />
            ) : (
              <p className="text-gray-600 font-mono text-xs py-8 text-center">
                Live Markdown preview will render here...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Metrics Bar */}
      <div className="px-4 py-2 border-t border-white/10 bg-[#11131a] flex items-center justify-between text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-4">
          <span>{words} Words</span>
          <span>{chars} Characters</span>
          <span className="text-[#10b981]">{readingTimeMin} min read</span>
        </div>
        <span className="text-gray-500">Markdown v2.4 (GFM)</span>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => handleInsertMedia(url)}
        title="Insert CDN Asset into Article"
      />
    </div>
  );
}
