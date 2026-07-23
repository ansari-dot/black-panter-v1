import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Zap, Battery, Mail, Users, Star, Settings,
  GalleryHorizontalEnd, LogOut, FolderKanban, LayoutTemplate, ChevronDown, Archive, Home, Warehouse, FileText,
} from 'lucide-react';
import { TTab } from '../types';
import logoImg from '../../assets/logo.jpeg';

interface AdminSidebarProps {
  currentTab: TTab;
  setCurrentTab: (tab: TTab) => void;
  onLogout?: () => void;
}

const DASHBOARD_ITEM = { id: 'dashboard' as TTab, label: 'Dashboard', icon: LayoutDashboard };

const NAV_ITEMS: { id: TTab; label: string; icon: React.ElementType }[] = [
  { id: 'services',     label: 'Services',     icon: Zap },
  { id: 'projects',     label: 'Projects',     icon: FolderKanban },
  { id: 'inquiries',    label: 'Inquiries',    icon: Mail },
  { id: 'team',         label: 'Team',         icon: Users },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'partners',     label: 'Partners',     icon: GalleryHorizontalEnd },
  { id: 'settings',     label: 'Settings',     icon: Settings },
];

export default function AdminSidebar({ currentTab, setCurrentTab, onLogout }: AdminSidebarProps) {
  const [adminName, setAdminName] = useState('Black Panther Batteries');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const load = () => {
      const t = localStorage.getItem('bp_settings_adminTitle');
      const a = localStorage.getItem('bp_settings_avatarUrl');
      if (t) setAdminName(t);
      setAvatar(a || '');
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('localStorageUpdate', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('localStorageUpdate', load);
    };
  }, []);

  return (
    <div
      className="flex flex-col shrink-0"
      style={{ width: 210, minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#ffffff' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          className="flex items-center justify-center rounded-md shrink-0 overflow-hidden"
          style={{ width: 36, height: 36, backgroundColor: 'transparent' }}
        >
          {avatar
            ? <img src={avatar} alt="Logo" className="w-full h-full object-cover rounded-md" />
            : <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-md" />}
        </div>
        <div>
          <div className="font-bold text-xs leading-tight" style={{ color: '#ffffff' }}>
            BLACK PANTHER
          </div>
          <div className="font-bold text-xs leading-tight" style={{ color: '#ffffff' }}>
            BATTERIES
          </div>
          <div className="text-xs font-bold leading-tight" style={{ color: '#e84b10' }}>
            POWER UNLEASHED
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {/* Render Dashboard first */}
        {(() => {
          const active = currentTab === DASHBOARD_ITEM.id;
          const Icon = DASHBOARD_ITEM.icon;
          return (
            <button
              onClick={() => setCurrentTab(DASHBOARD_ITEM.id)}
              className="flex items-center gap-3 w-full text-left cursor-pointer transition-colors"
              style={{
                padding: '10px 16px', fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? '#ffffff' : '#888888',
                backgroundColor: active ? 'rgba(232,75,16,0.2)' : 'transparent',
                borderLeft: active ? '2px solid #e84b10' : '2px solid transparent',
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{DASHBOARD_ITEM.label}</span>
            </button>
          );
        })()}

        {/* Quotations with sub-menu */}
        {(() => {
          const quotActive = ['quotations','createQuotation','quotationTemplates'].includes(currentTab);
          const QUOT_SUBS: { id: TTab; label: string }[] = [
            { id: 'quotations', label: 'All Quotations' },
            { id: 'createQuotation', label: 'Create Quotation' },
            { id: 'quotationTemplates', label: 'Templates' },
          ];
          return (
            <div>
              <button
                onClick={() => setCurrentTab('quotations')}
                className="flex items-center gap-3 w-full text-left cursor-pointer transition-colors"
                style={{
                  padding: '10px 16px', fontSize: 12,
                  fontWeight: quotActive ? 600 : 400,
                  color: quotActive ? '#ffffff' : '#888888',
                  backgroundColor: quotActive ? 'rgba(241,90,34,0.2)' : 'transparent',
                  borderLeft: quotActive ? '2px solid #f15a22' : '2px solid transparent',
                }}
              >
                <FileText size={16} strokeWidth={quotActive ? 2.5 : 2} />
                <span className="flex-1">Quotations</span>
                <ChevronDown size={14} strokeWidth={2.5} style={{
                  color: quotActive ? '#f15a22' : '#888',
                  transform: quotActive ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }} />
              </button>
              {quotActive && (
                <div style={{ marginLeft: 40, marginTop: 2, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {QUOT_SUBS.map(sub => (
                    <button key={sub.id} onClick={() => setCurrentTab(sub.id)}
                      className="text-left cursor-pointer rounded"
                      style={{ padding: '6px 12px', fontSize: 12, color: currentTab === sub.id ? '#f15a22' : '#888888', fontWeight: currentTab === sub.id ? 600 : 400, background: 'transparent', border: 'none' }}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Home Page with sub-menu */}
        {(() => {
          const homeActive = ['homepageProducts','homepageServices','homepageProjects'].includes(currentTab);
          const HOME_SUBS: { id: TTab; label: string }[] = [
            { id: 'homepageProducts', label: 'Products' },
            { id: 'homepageServices', label: 'Services' },
            { id: 'homepageProjects', label: 'Projects' },
          ];
          return (
            <div>
              <button
                onClick={() => setCurrentTab('homepageProducts')}
                className="flex items-center gap-3 w-full text-left cursor-pointer transition-colors"
                style={{
                  padding: '10px 16px', fontSize: 12,
                  fontWeight: homeActive ? 600 : 400,
                  color: homeActive ? '#ffffff' : '#888888',
                  backgroundColor: homeActive ? 'rgba(232,75,16,0.2)' : 'transparent',
                  borderLeft: homeActive ? '2px solid #e84b10' : '2px solid transparent',
                }}
              >
                <Home size={16} strokeWidth={homeActive ? 2.5 : 2} />
                <span className="flex-1">Home Page</span>
                <ChevronDown size={14} strokeWidth={2.5} style={{
                  color: homeActive ? '#e84b10' : '#888',
                  transform: homeActive ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }} />
              </button>
              {homeActive && (
                <div style={{ marginLeft: 40, marginTop: 2, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {HOME_SUBS.map(sub => (
                    <button key={sub.id} onClick={() => setCurrentTab(sub.id)}
                      className="text-left cursor-pointer rounded"
                      style={{ padding: '6px 12px', fontSize: 12, color: currentTab === sub.id ? '#e84b10' : '#888888', fontWeight: currentTab === sub.id ? 600 : 400, background: 'transparent', border: 'none' }}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Inventory with sub-menu */}
        <div>
          <button
            onClick={() => setCurrentTab('products')}
            className="flex items-center gap-3 w-full text-left cursor-pointer transition-colors"
            style={{
              padding: '10px 16px',
              fontSize: 12,
              fontWeight: ['inventory','products','categories','warehouses'].includes(currentTab) ? 600 : 400,
              color: ['inventory','products','categories','warehouses'].includes(currentTab) ? '#ffffff' : '#888888',
              backgroundColor: ['inventory','products','categories','warehouses'].includes(currentTab) ? 'rgba(232,75,16,0.2)' : 'transparent',
              borderLeft: ['inventory','products','categories','warehouses'].includes(currentTab) ? '2px solid #e84b10' : '2px solid transparent',
            }}
          >
            <Archive size={16} strokeWidth={['inventory','products','categories','warehouses'].includes(currentTab) ? 2.5 : 2} />
            <span className="flex-1">Inventory</span>
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              style={{
                color: ['inventory','products','categories','warehouses'].includes(currentTab) ? '#e84b10' : '#888',
                transform: ['inventory','products','categories','warehouses'].includes(currentTab) ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
          {(['inventory','products','categories','warehouses'] as const).includes(currentTab as any) && (
            <div style={{ marginLeft: 40, marginTop: 2, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Temporarily hidden Overview navitem
              <button
                onClick={() => setCurrentTab('inventory')}
                className="text-left cursor-pointer rounded flex items-center gap-2"
                style={{ padding: '6px 12px', fontSize: 12, color: currentTab === 'inventory' ? '#e84b10' : '#888888', fontWeight: currentTab === 'inventory' ? 600 : 400, background: 'transparent', border: 'none' }}
              >
                Overview
              </button>
              */}
              <button
                onClick={() => setCurrentTab('products')}
                className="text-left cursor-pointer rounded flex items-center gap-2"
                style={{ padding: '6px 12px', fontSize: 12, color: currentTab === 'products' ? '#e84b10' : '#888888', fontWeight: currentTab === 'products' ? 600 : 400, background: 'transparent', border: 'none' }}
              >
                Products
              </button>
              <button
                onClick={() => setCurrentTab('categories')}
                className="text-left cursor-pointer rounded flex items-center gap-2"
                style={{ padding: '6px 12px', fontSize: 12, color: currentTab === 'categories' ? '#e84b10' : '#888888', fontWeight: currentTab === 'categories' ? 600 : 400, background: 'transparent', border: 'none' }}
              >
                Categories
              </button>
              {/* Temporarily hidden Warehouses navitem
              <button
                onClick={() => setCurrentTab('warehouses')}
                className="text-left cursor-pointer rounded flex items-center gap-2"
                style={{ padding: '6px 12px', fontSize: 12, color: currentTab === 'warehouses' ? '#e84b10' : '#888888', fontWeight: currentTab === 'warehouses' ? 600 : 400, background: 'transparent', border: 'none' }}
              >
                Warehouses
              </button>
              */}
            </div>
          )}
        </div>

        {/* Render rest of NAV_ITEMS */}
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentTab(id)}
              className="flex items-center gap-3 w-full text-left cursor-pointer transition-colors"
              style={{
                padding: '10px 16px', fontSize: 12,
                fontWeight: active ? 600 : 400,
                color: active ? '#ffffff' : '#888888',
                backgroundColor: active ? 'rgba(232,75,16,0.2)' : 'transparent',
                borderLeft: active ? '2px solid #e84b10' : '2px solid transparent',
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{label}</span>
              {(id === 'products' || id === 'services' || id === 'projects') && !active && (
                <ChevronDown size={14} strokeWidth={2.5} style={{ color: '#888' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div
          className="rounded-full flex items-center justify-center shrink-0 overflow-hidden"
          style={{ width: 32, height: 32, backgroundColor: 'transparent' }}
        >
          {avatar
            ? <img src={avatar} alt="Logo" className="w-full h-full object-cover rounded-full" />
            : <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-full" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate" style={{ color: '#ffffff' }}>
            {adminName}
          </div>
          <div className="text-xs" style={{ color: '#888888' }}>Admin Panel</div>
          <div className="text-xs" style={{ color: '#888888' }}>Version 1.0.0</div>
        </div>
        <button
          onClick={onLogout}
          className="cursor-pointer transition-colors p-1 rounded"
          style={{ color: '#888888' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#888888')}
        >
          <LogOut size={16} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

