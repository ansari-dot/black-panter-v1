/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LayoutDashboard, Zap, Battery, Mail, Users, Star, Settings, GalleryHorizontalEnd, LogOut, FolderKanban } from 'lucide-react';
import { TTab } from '../types';

interface AdminSidebarProps {
  currentTab: TTab;
  setCurrentTab: (tab: TTab) => void;
  onLogout?: () => void;
}

export default function AdminSidebar({ currentTab, setCurrentTab, onLogout }: AdminSidebarProps) {
  const [title, setTitle] = useState('Black Panther');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const load = () => {
      const t = localStorage.getItem('bp_settings_adminTitle');
      const a = localStorage.getItem('bp_settings_avatarUrl');
      if (t) setTitle(t); else setTitle('Black Panther');
      setAvatar(a || '');
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('localStorageUpdate', load);
    return () => { window.removeEventListener('storage', load); window.removeEventListener('localStorageUpdate', load); };
  }, []);

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services' as const, label: 'Services', icon: Zap },
    { id: 'products' as const, label: 'Products', icon: Battery },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'inquiries' as const, label: 'Inquiries', icon: Mail },
    { id: 'team' as const, label: 'Team', icon: Users },
    { id: 'testimonials' as const, label: 'Testimonials', icon: Star },
    { id: 'partners' as const, label: 'Partners', icon: GalleryHorizontalEnd },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-60 min-h-screen bg-white border-r border-slate-100 shrink-0">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center overflow-hidden shrink-0">
            {avatar
              ? <img src={avatar} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              : <Zap className="w-4 h-4 text-amber-500" strokeWidth={2.5} />}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-800 truncate">{title}</div>
            <div className="text-[10px] text-slate-400 font-medium">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest px-3 mb-2">Menu</p>
        {menuItems.map(({ id, label, icon: Icon }) => {
          const active = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => setCurrentTab(id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
                active
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-700 truncate">Super Admin</div>
            <div className="text-[10px] text-slate-400 truncate">admin@blackpanther.com</div>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-300 hover:text-red-400 transition-colors cursor-pointer p-1 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

    </div>
  );
}
