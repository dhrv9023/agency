'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — GLOBAL COMMAND PALETTE (⌘K / Ctrl+K)
 * Raycast / Linear-grade keyboard command center with navigation & quick actions
 * ==============================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal?: () => void;
  onOpenProjectModal?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: 'NAVIGATION' | 'ACTIONS' | 'SYSTEM' | 'RECENT';
  icon: string;
  badge?: string;
  shortcut?: string[];
  action: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenLeadModal,
  onOpenProjectModal,
}: CommandPaletteProps) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Focus input when opened & reset search
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Navigate helper
  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  // Commands Registry
  const commands: CommandItem[] = useMemo(
    () => [
      // QUICK ACTIONS
      {
        id: 'act-new-lead',
        title: 'Create Inbound Lead',
        description: 'Record a new prospect, company, and budget into CRM pipeline',
        category: 'ACTIONS',
        icon: 'fa-user-plus',
        badge: 'CRM',
        shortcut: ['N', 'L'],
        action: () => {
          onClose();
          if (onOpenLeadModal) onOpenLeadModal();
          else router.push('/admin/leads?action=new');
        },
      },
      {
        id: 'act-new-project',
        title: 'New Client Project',
        description: 'Initialize a new automation project delivery board',
        category: 'ACTIONS',
        icon: 'fa-folder-plus',
        badge: 'DELIVERY',
        shortcut: ['N', 'P'],
        action: () => {
          onClose();
          if (onOpenProjectModal) onOpenProjectModal();
          else router.push('/admin/projects?action=new');
        },
      },
      {
        id: 'act-new-post',
        title: 'Create CMS Article / Case Study',
        description: 'Open the markdown / rich-text system release editor',
        category: 'ACTIONS',
        icon: 'fa-file-circle-plus',
        badge: 'CMS',
        action: () => navigate('/admin/cms?action=new'),
      },
      {
        id: 'act-upload-media',
        title: 'Upload Media Asset',
        description: 'Direct upload image, video, or diagram to CDN asset storage',
        category: 'ACTIONS',
        icon: 'fa-cloud-arrow-up',
        badge: 'CDN',
        action: () => navigate('/admin/media?action=upload'),
      },
      {
        id: 'act-compose-broadcast',
        title: 'Compose Newsletter Broadcast',
        description: 'Draft or trigger an email blast to verified agency subscribers',
        category: 'ACTIONS',
        icon: 'fa-paper-plane',
        badge: 'EMAIL',
        action: () => navigate('/admin/newsletter?action=compose'),
      },
      {
        id: 'act-export-leads',
        title: 'Export CRM Leads (CSV)',
        description: 'Download filtered pipeline data in RFC 4180 CSV format',
        category: 'ACTIONS',
        icon: 'fa-file-export',
        badge: 'DATA',
        action: () => navigate('/admin/leads?action=export'),
      },

      // NAVIGATION
      {
        id: 'nav-overview',
        title: 'Overview Dashboard',
        description: 'KPI indicators, revenue velocity, real-time funnel metrics',
        category: 'NAVIGATION',
        icon: 'fa-gauge',
        shortcut: ['G', 'D'],
        action: () => navigate('/admin'),
      },
      {
        id: 'nav-leads',
        title: 'Leads & CRM Pipeline',
        description: 'Inbound submissions, drag-and-drop Kanban, lead scoring',
        category: 'NAVIGATION',
        icon: 'fa-users',
        shortcut: ['G', 'L'],
        action: () => navigate('/admin/leads'),
      },
      {
        id: 'nav-projects',
        title: 'Client Projects',
        description: 'Active automation engineering sprints and milestone tracks',
        category: 'NAVIGATION',
        icon: 'fa-diagram-project',
        shortcut: ['G', 'P'],
        action: () => navigate('/admin/projects'),
      },
      {
        id: 'nav-clients',
        title: 'Client Accounts & Portals',
        description: 'Organization profiles, SLA contracts, and billing contacts',
        category: 'NAVIGATION',
        icon: 'fa-building',
        action: () => navigate('/admin/clients'),
      },
      {
        id: 'nav-cms',
        title: 'CMS Engine',
        description: 'Case studies, architecture blueprints, and blog articles',
        category: 'NAVIGATION',
        icon: 'fa-pen-to-square',
        action: () => navigate('/admin/cms'),
      },
      {
        id: 'nav-media',
        title: 'Media Asset Library',
        description: 'Optimized WebP, SVGs, architecture diagrams, and system clips',
        category: 'NAVIGATION',
        icon: 'fa-photo-film',
        action: () => navigate('/admin/media'),
      },
      {
        id: 'nav-newsletter',
        title: 'Newsletter Subscribers',
        description: 'Subscriber list, segmentation tags, and open/click analytics',
        category: 'NAVIGATION',
        icon: 'fa-envelope-open-text',
        action: () => navigate('/admin/newsletter'),
      },
      {
        id: 'nav-analytics',
        title: 'Analytics & Traffic Telemetry',
        description: 'Conversion rates, page view funnel, UTM campaign attribution',
        category: 'NAVIGATION',
        icon: 'fa-chart-pie',
        shortcut: ['G', 'A'],
        action: () => navigate('/admin/analytics'),
      },
      {
        id: 'nav-settings',
        title: 'Console Settings',
        description: 'Team permissions, webhook endpoints, and API security keys',
        category: 'NAVIGATION',
        icon: 'fa-gear',
        shortcut: ['G', 'S'],
        action: () => navigate('/admin/settings'),
      },
      {
        id: 'nav-audit',
        title: 'Audit & Compliance Log',
        description: 'Immutable system audit ledger of all mutations and logins',
        category: 'NAVIGATION',
        icon: 'fa-clock-rotate-left',
        action: () => navigate('/admin/settings/audit-log'),
      },

      // SYSTEM & PREFERENCES
      {
        id: 'sys-theme',
        title: 'Toggle Theme (Dark / Light)',
        description: 'Switch between technical dark canvas and high-contrast light mode',
        category: 'SYSTEM',
        icon: 'fa-circle-half-stroke',
        shortcut: ['T'],
        action: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'sys-public-site',
        title: 'Open Public Website',
        description: 'View the live production website in a new browser tab',
        category: 'SYSTEM',
        icon: 'fa-arrow-up-right-from-square',
        action: () => {
          window.open('/', '_blank');
          onClose();
        },
      },
      {
        id: 'sys-signout',
        title: 'Sign Out of Admin Console',
        description: 'Terminate active session and clear secure authentication cookie',
        category: 'SYSTEM',
        icon: 'fa-arrow-right-from-bracket',
        action: () => {
          onClose();
          router.push('/admin/login?action=logout');
        },
      },
    ],
    [router, toggleTheme, onOpenLeadModal, onOpenProjectModal]
  );

  // Filter commands by search term
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const q = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        (cmd.badge && cmd.badge.toLowerCase().includes(q))
    );
  }, [commands, search]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Keyboard navigation within list
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? filteredCommands.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const active = filteredCommands[selectedIndex];
        if (active) {
          active.action();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group filtered commands
  const categories: ('ACTIONS' | 'NAVIGATION' | 'SYSTEM')[] = ['ACTIONS', 'NAVIGATION', 'SYSTEM'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0d12] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(0,240,255,0.06)] overflow-hidden flex flex-col text-white animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(255,255,255,0.08)] bg-[#11131a]/80">
          <i className="fa-solid fa-magnifying-glass text-[#00f0ff] text-base mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search... (e.g. leads, new project, theme)"
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 mr-2"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-black/40 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <i className="fa-solid fa-ghost text-2xl text-gray-600 mb-2 block" />
              <p className="text-sm font-medium">No matching commands or navigation routes</p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for "lead", "project", "cms", or "theme"
              </p>
            </div>
          ) : (
            <ul ref={listRef} role="listbox" className="space-y-4">
              {categories.map((category) => {
                const categoryItems = filteredCommands.filter((c) => c.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <li key={category} className="space-y-1">
                    <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-500">
                      {category}
                    </div>
                    <div className="space-y-0.5">
                      {categoryItems.map((cmd) => {
                        const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <div
                            key={cmd.id}
                            role="option"
                            aria-selected={isSelected}
                            data-active={isSelected}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#00f0ff]/10 text-white border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                                : 'text-gray-300 hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-colors ${
                                  isSelected
                                    ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                                    : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'
                                }`}
                              >
                                <i className={`fa-solid ${cmd.icon}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate">{cmd.title}</span>
                                  {cmd.badge && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-gray-400">
                                      {cmd.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 truncate max-w-md">
                                  {cmd.description}
                                </p>
                              </div>
                            </div>

                            {/* Shortcut Badges */}
                            {cmd.shortcut && (
                              <div className="hidden sm:flex items-center gap-1 shrink-0 ml-3">
                                {cmd.shortcut.map((key) => (
                                  <kbd
                                    key={key}
                                    className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded ${
                                      isSelected
                                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                                        : 'bg-white/5 text-gray-400 border border-white/10'
                                    }`}
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2.5 bg-[#090a0e] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.2 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.2 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.2 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">ESC</kbd>
              Dismiss
            </span>
          </div>
          <span className="text-[#00f0ff]/80 flex items-center gap-1.5">
            <i className="fa-solid fa-bolt text-[10px]" />
            VARAH Console v2.0
          </span>
        </div>
      </div>
    </div>
  );
}
