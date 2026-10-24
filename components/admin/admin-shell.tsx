'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SITE-MATCHING ADMIN SHELL
 * Top operational bar identical to agency site, full-width viewport, zero sidebar
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette } from './command-palette';
import { useTheme } from './theme-provider';
import type { AdminUser } from '@/types/admin';

interface AdminShellProps {
  user: AdminUser | null;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const isLoginPage = pathname === '/admin/login';

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoginPage) {
    return <main className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">{children}</main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] flex items-center justify-center p-4">
        <div className="text-center p-8 border border-white/10 rounded-xl bg-black/40 max-w-md">
          <i className="fa-solid fa-lock text-3xl text-red-400 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Authentication Required</h2>
          <p className="text-sm text-gray-400 mb-6">You must authenticate to access the agency operations console.</p>
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f0ff] text-black font-semibold rounded-lg text-sm"
          >
            Go to Admin Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] flex flex-col font-sans transition-colors duration-200 selection:bg-[#00f0ff]/20 selection:text-[#00f0ff]">
      {/* Top Operational Bar (Exact match to site) */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/admin" className="admin-brand">
            <div className="admin-brand-icon">
              <img src="/assets/logo.svg" alt="Agency Logo" />
            </div>
            <div className="admin-title-group">
              <h1>
                AGENCY OPERATIONS
                <span className="admin-badge">Internal Hub</span>
              </h1>
            </div>
          </Link>

          <div className="admin-nav-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginRight: '8px' }}>
              <span className="admin-status-pulse" />
              <span>NODE: LIVE</span>
            </div>

            <Link
              href="/admin"
              className={`tool-btn ${pathname === '/admin' ? 'active' : ''}`}
              style={pathname === '/admin' ? (resolvedTheme === 'light' ? { background: 'rgba(2, 132, 199, 0.12)', borderColor: '#0284c7', color: '#0284c7', fontWeight: 600 } : { background: 'rgba(0, 240, 255, 0.12)', borderColor: '#00f0ff', color: '#00f0ff' }) : {}}
            >
              <i className="fa-solid fa-gauge" /> Overview
            </Link>

            <Link
              href="/admin/leads"
              className={`tool-btn ${pathname === '/admin/leads' ? 'active' : ''}`}
              style={pathname === '/admin/leads' ? (resolvedTheme === 'light' ? { background: 'rgba(2, 132, 199, 0.12)', borderColor: '#0284c7', color: '#0284c7', fontWeight: 600 } : { background: 'rgba(0, 240, 255, 0.12)', borderColor: '#00f0ff', color: '#00f0ff' }) : {}}
            >
              <i className="fa-solid fa-users" /> Leads / CRM
            </Link>

            <Link
              href="/admin/analytics"
              className={`tool-btn ${pathname === '/admin/analytics' ? 'active' : ''}`}
              style={pathname === '/admin/analytics' ? (resolvedTheme === 'light' ? { background: 'rgba(16, 185, 129, 0.12)', borderColor: '#059669', color: '#059669', fontWeight: 600 } : { background: 'rgba(16, 185, 129, 0.12)', borderColor: '#10b981', color: '#6ee7b7' }) : {}}
            >
              <i className="fa-solid fa-chart-line" /> Analytics
            </Link>

            <Link
              href="/admin/settings"
              className={`tool-btn ${pathname === '/admin/settings' ? 'active' : ''}`}
              style={pathname === '/admin/settings' ? (resolvedTheme === 'light' ? { background: 'rgba(217, 119, 6, 0.12)', borderColor: '#d97706', color: '#b45309', fontWeight: 600 } : { background: 'rgba(245, 158, 11, 0.12)', borderColor: '#f59e0b', color: '#fcd34d' }) : {}}
            >
              <i className="fa-solid fa-gear" /> Settings
            </Link>

            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="tool-btn"
              title="Search console (⌘K)"
            >
              <i className="fa-solid fa-magnifying-glass" />
              <span style={{ fontSize: '0.7rem', opacity: 0.6, fontFamily: 'monospace' }}>⌘K</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="tool-btn theme-toggle-btn-admin"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              <i className={`fa-solid ${resolvedTheme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-sky-600'}`} />
              <span className="hidden md:inline" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            <a href="/index.html" className="tool-btn" target="_blank" rel="noopener noreferrer">
              <i className="fa-solid fa-arrow-up-right-from-square" /> Public Site
            </a>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="admin-main">
        {children}
      </main>

      {/* Global ⌘K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
