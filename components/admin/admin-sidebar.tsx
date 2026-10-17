'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — COLLAPSIBLE ADMIN SIDEBAR
 * Desktop expanded (260px) / collapsed (68px) + mobile slide-out drawer
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminUser } from '@/types/admin';

interface AdminSidebarProps {
  user: AdminUser;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number | string;
  badgeColor?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  // CORE OPERATIONS
  { section: 'OPERATIONS', title: 'Overview', href: '/admin', icon: 'fa-gauge' },
  { section: 'OPERATIONS', title: 'Leads / CRM', href: '/admin/leads', icon: 'fa-users', badge: '14', badgeColor: '#00f0ff' },
  { section: 'OPERATIONS', title: 'Projects', href: '/admin/projects', icon: 'fa-diagram-project' },
  { section: 'OPERATIONS', title: 'Clients', href: '/admin/clients', icon: 'fa-building' },

  // CONTENT & ASSETS
  { section: 'CONTENT & MARKETING', title: 'CMS Engine', href: '/admin/cms', icon: 'fa-pen-to-square' },
  { section: 'CONTENT & MARKETING', title: 'Media Library', href: '/admin/media', icon: 'fa-photo-film' },
  { section: 'CONTENT & MARKETING', title: 'Newsletter', href: '/admin/newsletter', icon: 'fa-paper-plane' },

  // INTELLIGENCE & CONTROL
  { section: 'SYSTEM', title: 'Analytics', href: '/admin/analytics', icon: 'fa-chart-pie' },
  { section: 'SYSTEM', title: 'Settings', href: '/admin/settings', icon: 'fa-gear' },
  { section: 'SYSTEM', title: 'Audit Log', href: '/admin/settings/audit-log', icon: 'fa-clock-rotate-left' },
];

export function AdminSidebar({ user, isOpenMobile = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore collapsed preference
  useEffect(() => {
    const saved = localStorage.getItem('varah_admin_sidebar_collapsed');
    if (saved) setIsCollapsed(saved === 'true');
  }, []);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('varah_admin_sidebar_collapsed', String(next));
  };

  // Group items by section
  const sections = Array.from(new Set(NAV_ITEMS.map(item => item.section || 'MAIN')));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r transition-all duration-200 select-none
          ${isCollapsed ? 'w-[68px]' : 'w-[260px]'}
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-[#070709] dark:bg-[#070709] border-[rgba(255,255,255,0.08)]
          text-white`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.08)]">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <span className="font-bold text-black text-sm">V</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-wide text-white leading-tight">VARAH SYSTEMS</span>
                <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider">Operations Console</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden lg:flex w-7 h-7 rounded-md items-center justify-center text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-chevron-right text-xs' : 'fa-chevron-left text-xs'}`} />
          </button>
        </div>

        {/* Nav Items List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6 scrollbar-thin">
          {sections.map(section => {
            const items = NAV_ITEMS.filter(i => (i.section || 'MAIN') === section);
            return (
              <div key={section} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold mb-2">
                    {section}
                  </div>
                )}
                {items.map(item => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={isCollapsed ? item.title : undefined}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group
                        ${isActive
                          ? 'bg-[rgba(0,240,255,0.08)] text-[#00f0ff] border border-[rgba(0,240,255,0.25)]'
                          : 'text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-transparent'
                        }`}
                    >
                      <i className={`fa-solid ${item.icon} w-4 text-center shrink-0 text-sm ${isActive ? 'text-[#00f0ff]' : 'text-gray-400 group-hover:text-white'}`} />
                      
                      {!isCollapsed && (
                        <span className="flex-1 truncate tracking-wide">{item.title}</span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold leading-none"
                          style={{
                            background: item.badgeColor ? `${item.badgeColor}20` : 'rgba(255,255,255,0.1)',
                            color: item.badgeColor || '#ffffff',
                            border: `1px solid ${item.badgeColor ? `${item.badgeColor}50` : 'rgba(255,255,255,0.2)'}`,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#171a24] text-white text-xs rounded border border-[rgba(255,255,255,0.15)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff]/20 to-[#10b981]/20 border border-[#00f0ff]/40 flex items-center justify-center font-bold text-xs text-[#00f0ff] shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate leading-tight">{user.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
