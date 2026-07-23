import { Bell, ChevronRight, RefreshCw } from 'lucide-react';
import { TTab } from '../types';

interface HeaderProps {
  currentTab: TTab;
  isRefetching: boolean;
  onRefresh: () => void;
  onQuickAdd: () => void;
  user?: { id: string; name: string; email: string; role: string } | null;
}

const LABELS: Record<TTab, string> = {
  dashboard:           'Dashboard',
  homePage:            'Home Page',
  services:            'Services',
  products:            'Products',
  projects:            'Projects',
  inquiries:           'Inquiries',
  team:                'Team',
  testimonials:        'Testimonials',
  partners:            'Partners',
  settings:            'Settings',
  quotations:          'Quotations',
  createQuotation:     'Quotations',
  quotationTemplates:  'Quotations',
};

const SECTIONS: Record<TTab, string> = {
  dashboard:           'Overview',
  homePage:            'Home Page',
  services:            'Services',
  products:            'Products',
  projects:            'Projects',
  inquiries:           'Inquiries',
  team:                'Team',
  testimonials:        'Testimonials',
  partners:            'Partners',
  settings:            'Settings',
  quotations:          'All Quotations',
  createQuotation:     'Create New Quotation',
  quotationTemplates:  'Templates',
};

export default function Header({ currentTab, isRefetching, onRefresh, user }: HeaderProps) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <header
      className="flex items-center justify-between sticky top-0 z-30 shrink-0"
      style={{
        height: 56,
        padding: '0 32px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e2e2',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#8a8a8a' }}>
        <span>Admin</span>
        <ChevronRight size={14} strokeWidth={2.5} />
        <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{SECTIONS[currentTab]}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="cursor-pointer transition-colors disabled:opacity-50"
          style={{ color: '#8a8a8a', background: 'none', border: 'none', padding: 0 }}
          title="Refresh"
        >
          <RefreshCw size={18} strokeWidth={1.8} className={isRefetching ? 'animate-spin' : ''} />
        </button>

        {/* Bell */}
        <div className="relative">
          <Bell size={20} strokeWidth={1.8} style={{ color: '#1a1a1a' }} />
          <div
            className="absolute flex items-center justify-center font-bold"
            style={{
              top: -4, right: -4,
              width: 16, height: 16,
              borderRadius: '50%',
              backgroundColor: '#e84b10',
              color: '#fff',
              fontSize: 10,
            }}
          >
            5
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div
            className="rounded-full flex items-center justify-center shrink-0 overflow-hidden"
            style={{ width: 32, height: 32, backgroundColor: '#e84b10' }}
          >
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{initials}</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.3 }}>
              {user?.name || 'Admin User'}
            </div>
            <div style={{ fontSize: 11, color: '#8a8a8a', lineHeight: 1.3 }}>
              {user?.role || 'Administrator'}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
