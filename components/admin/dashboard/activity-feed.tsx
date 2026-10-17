'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — RECENT ACTIVITY FEED
 * Real-time operational audit log stream of mutations, milestones, and webhooks
 * ==============================================================================
 */

import React from 'react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  type: 'LEAD' | 'PROJECT' | 'CONTENT' | 'SYSTEM';
  action: string;
  title: string;
  timestamp: string;
  user: {
    name: string;
    avatarUrl: string | null;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const TYPE_CONFIG: Record<
  'LEAD' | 'PROJECT' | 'CONTENT' | 'SYSTEM',
  { icon: string; color: string; badge: string }
> = {
  LEAD: {
    icon: 'fa-user-plus',
    color: '#00f0ff',
    badge: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
  },
  PROJECT: {
    icon: 'fa-diagram-project',
    color: '#10b981',
    badge: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
  },
  CONTENT: {
    icon: 'fa-pen-to-square',
    color: '#f59e0b',
    badge: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
  },
  SYSTEM: {
    icon: 'fa-bolt',
    color: '#8b5cf6',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="p-5 rounded-xl bg-[#0c0d12] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Recent Activity</h3>
          <p className="text-xs text-gray-400 mt-0.5">Live operational event stream</p>
        </div>
        <Link
          href="/admin/settings/audit-log"
          className="text-xs font-mono text-gray-400 hover:text-[#00f0ff] transition-colors"
        >
          View Full Audit →
        </Link>
      </div>

      <div className="divide-y divide-[rgba(255,255,255,0.06)] my-1">
        {activities.map((act) => {
          const config = TYPE_CONFIG[act.type] || TYPE_CONFIG.SYSTEM;
          const time = new Date(act.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={act.id} className="py-3 flex items-start gap-3 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 transition-colors"
                style={{ backgroundColor: `${config.color}15`, color: config.color }}
              >
                <i className={`fa-solid ${config.icon}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${config.badge}`}>
                    {act.type}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">{time}</span>
                </div>
                <p className="text-xs text-gray-200 mt-1 font-medium group-hover:text-white transition-colors">
                  {act.title}
                </p>
                <span className="text-[11px] text-gray-500 font-mono mt-0.5 block">
                  by {act.user.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-gray-500 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
        <span>Log retention</span>
        <span className="text-gray-400">90 days active rolling</span>
      </div>
    </div>
  );
}
