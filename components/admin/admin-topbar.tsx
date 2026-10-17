'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — STICKY ADMIN TOPBAR
 * Global ⌘K trigger, breadcrumbs, notifications bell, theme switch, user menu
 * ==============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './theme-provider';
import type { AdminUser } from '@/types/admin';

interface AdminTopbarProps {
  user: AdminUser;
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export function AdminTopbar({ user, onOpenMobileSidebar, onOpenCommandPalette }: AdminTopbarProps) {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const segments: string[] = pathname.replace('/admin', '').split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [
    { label: 'Admin', href: '/admin', isLast: segments.length === 0 },
    ...segments.map((seg: string, i: number) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: `/admin/${segments.slice(0, i + 1).join('/')}`,
      isLast: i === segments.length - 1,
    })),
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070709]/90 dark:bg-[#070709]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)] px-4 lg:px-6 flex items-center justify-between text-white">
      {/* Left: Mobile Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-gray-400 hover:text-white"
          aria-label="Open navigation menu"
        >
          <i className="fa-solid fa-bars text-sm" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              {idx > 0 && <span className="text-gray-600">/</span>}
              {crumb.isLast || idx === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-gray-400 hover:text-gray-200 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search, Notifications, Theme Toggle, User Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Global ⌘K Command Palette Button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-xs text-gray-400 hover:text-white transition-all shadow-sm"
        >
          <i className="fa-solid fa-magnifying-glass text-[11px]" />
          <span className="hidden sm:inline">Search console...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[rgba(255,255,255,0.08)] rounded text-gray-300 border border-[rgba(255,255,255,0.1)]">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Notifications Bell with Unreplied Leads Ping */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-gray-400 hover:text-white transition-colors relative"
            aria-label="Notifications"
          >
            <i className="fa-regular fa-bell text-sm" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00f0ff] ring-4 ring-[#070709]" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#11131a] border border-[rgba(255,255,255,0.12)] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(255,255,255,0.08)]">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Operations Alerts</span>
                <span className="text-[10px] font-mono text-[#00f0ff]">0 Pending</span>
              </div>
              <div className="p-3 text-center text-xs text-gray-400">
                All systems healthy. No unreplied inquiries.
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          title={`Current theme: ${resolvedTheme}. Click to toggle.`}
        >
          <i className={`fa-solid ${resolvedTheme === 'dark' ? 'fa-moon text-[#00f0ff]' : 'fa-sun text-amber-400'} text-sm`} />
        </button>

        {/* User Avatar Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            aria-label="User account menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff]/30 to-[#10b981]/30 border border-[#00f0ff]/50 flex items-center justify-center font-bold text-xs text-[#00f0ff]">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#11131a] border border-[rgba(255,255,255,0.12)] shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.08)] mb-1">
                <div className="font-semibold text-white truncate">{user.name}</div>
                <div className="text-gray-400 text-[11px] font-mono truncate">{user.email}</div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
                  {user.role}
                </span>
              </div>

              <Link
                href="/admin/settings/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <i className="fa-regular fa-user w-4 text-center text-gray-400" />
                <span>My Profile &amp; 2FA</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <i className="fa-solid fa-sliders w-4 text-center text-gray-400" />
                <span>Console Settings</span>
              </Link>

              <a
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <i className="fa-solid fa-arrow-up-right-from-square w-4 text-center text-gray-400" />
                <span>View Public Site</span>
              </a>

              <div className="border-t border-[rgba(255,255,255,0.08)] my-1" />

              <form action="/admin/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
