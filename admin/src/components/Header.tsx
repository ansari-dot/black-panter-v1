import { Bell, ChevronRight, RefreshCw, Check, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { TTab } from '../types';
import { useState, useEffect, useRef } from 'react';
import { notificationsApi } from '../utils/api';

const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

interface HeaderProps {
  currentTab: TTab;
  isRefetching: boolean;
  onRefresh: () => void;
  onQuickAdd: () => void;
  user?: { id: string; name: string; email: string; role: string } | null;
  onNavigate?: (tab: TTab) => void;
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

export default function Header({ currentTab, isRefetching, onRefresh, user, onNavigate }: HeaderProps) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.get();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = io('http://localhost:3000', {
      withCredentials: true,
    });

    socket.on('newNotification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    // Optionally keep polling as a fallback, or rely purely on sockets. Let's keep a slow poll just in case.
    const interval = setInterval(fetchNotifications, 300000); // Check every 5 minutes as fallback
    
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      if (link && onNavigate) {
        // Very basic mapping from link to tab
        if (link.includes('inquiries')) onNavigate('inquiries');
        else if (link.includes('orders') || link.includes('products')) onNavigate('products');
        else if (link.includes('quotations')) onNavigate('quotations');
        setShowNotifications(false);
      }
    } catch (err) {
      console.error('Error marking as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationsApi.clearAll();
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications', err);
    }
  };

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

        {/* Bell / Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="relative cursor-pointer transition-colors hover:text-orange-600"
            style={{ background: 'none', border: 'none', padding: 0 }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} strokeWidth={1.8} style={{ color: '#1a1a1a' }} />
            {unreadCount > 0 && (
              <div
                className="absolute flex items-center justify-center font-bold shadow-sm"
                style={{
                  top: -4, right: -4,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#e84b10',
                  color: '#fff',
                  fontSize: 10,
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
              style={{ width: 340, zIndex: 100 }}
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                <span className="font-semibold text-sm text-gray-800">Notifications</span>
                <div className="flex gap-2">
                  <button onClick={handleMarkAllAsRead} className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1" title="Mark all as read">
                    <Check size={14} />
                  </button>
                  <button onClick={handleClearAll} className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1" title="Clear all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">No new notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => handleMarkAsRead(notif._id, notif.link)}
                      className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-orange-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-semibold ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                          {timeAgo(new Date(notif.createdAt))}
                        </span>
                      </div>
                      <p className={`text-xs ${!notif.isRead ? 'text-gray-800' : 'text-gray-500'} line-clamp-2`}>
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
