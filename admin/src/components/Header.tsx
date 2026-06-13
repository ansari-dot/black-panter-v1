/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Plus, RefreshCw } from 'lucide-react';
import { TTab } from '../types';

interface HeaderProps {
  currentTab: TTab;
  isRefetching: boolean;
  onRefresh: () => void;
  onQuickAdd: () => void;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const labels: Record<TTab, string> = {
  dashboard: 'Overview',
  services: 'Services',
  products: 'Products',
  inquiries: 'Inquiries',
  team: 'Team',
  testimonials: 'Testimonials',
  settings: 'Settings',
};

export default function Header({ currentTab, isRefetching, onRefresh, onQuickAdd }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-white/95 backdrop-blur-md sticky top-0 z-30 shrink-0 shadow-xs">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-sans">
        <span className="text-muted-foreground">Admin</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-semibold">{labels[currentTab]}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">

        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted/40 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin text-primary' : ''}`} />
          <span className="hidden md:inline">{isRefetching ? 'Syncing...' : 'Refresh'}</span>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success/5 border border-success/15">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-medium text-success">Live</span>
        </div>

        <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 relative cursor-pointer transition-all">
          <Bell className="w-4 h-4" strokeWidth={1.8} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        <button
          onClick={onQuickAdd}
          className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Quick Add</span>
        </button>

      </div>
    </header>
  );
}
