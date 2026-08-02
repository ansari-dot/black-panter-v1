import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from './PageLayout';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaHeart, FaFileAlt, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';
import portalBg from '../assets/herosections/about.webp';

export const UserPortalLayout = ({ currentTab, children, title, subtitle, icon: TitleIcon }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'settings', label: 'Account Settings', icon: FaUser, path: '/settings' },
    { id: 'orders', label: 'My Orders', icon: FaBoxOpen, path: '/orders' },
    { id: 'track', label: 'Track Order', icon: FaMapMarkerAlt, path: '/track' },
    { id: 'wishlist', label: 'My Wishlist', icon: FaHeart, path: '/wishlist' },
    { id: 'quotes', label: 'Quotations', icon: FaFileAlt, path: '/quotes' }
  ];

  const currentNavItem = navItems.find(item => item.id === currentTab);
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const heroContent = (
    <div className="flex flex-col items-start mt-4 md:mt-8 ml-2 md:ml-4">
      <div className="flex items-center gap-2 mb-3" style={{ fontSize: '11px' }}>
        <Link to="/" className="text-white/60 hover:text-white transition-colors font-medium">Home</Link>
        <FaChevronRight className="text-white/30" style={{ fontSize: '7px' }} />
        <span className="text-white/90 font-semibold">My Account</span>
        {currentNavItem && (
          <>
            <FaChevronRight className="text-white/30" style={{ fontSize: '7px' }} />
            <span className="text-[#FF8803] font-semibold">{currentNavItem.label}</span>
          </>
        )}
      </div>
      <h1
        className="font-black leading-tight tracking-tight"
        style={{
          fontSize: 'clamp(18px, 3vw, 28px)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4D6 55%, #F3B38A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        My Account
      </h1>
      <p className="text-white/60 mt-1 max-w-md font-medium" style={{ fontSize: '12px' }}>
        Manage your profile, orders, wishlist and quotations
      </p>
    </div>
  );

  return (
    <PageLayout
      smallHeader={true}
      heroContent={heroContent}
      vectorBackground={portalBg}
    >
      <style>{`
        .portal-nav-link { position: relative; transition: all 0.2s ease; }
        .portal-nav-link:hover { background: rgba(240,97,35,0.04); }
        .portal-nav-link.active { background: linear-gradient(135deg, rgba(240,97,35,0.07) 0%, rgba(255,136,3,0.03) 100%); }
        .portal-nav-link.active::after {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 0 3px 3px 0;
          background: linear-gradient(180deg, #F06123, #FF8803);
        }
        .portal-fade { animation: pFadeIn 0.35s ease-out; }
        @keyframes pFadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        .portal-scroll::-webkit-scrollbar { display: none; }
        .portal-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-[#f4f5f7] pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

            {/* ===== SIDEBAR ===== */}
            <div className="w-full lg:w-[250px] xl:w-[260px] shrink-0">
              <div className="bg-white rounded-xl overflow-hidden lg:sticky lg:top-[100px]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>

                {/* User Card */}
                <div className="px-5 pt-5 pb-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(240,97,35,0.04) 0%, rgba(255,136,3,0.02) 100%)' }}>
                  <div className="mx-auto mb-3" style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #F06123, #FF8803)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(240,97,35,0.25)' }}>
                    <span className="text-white font-bold" style={{ fontSize: '16px' }}>{userInitials}</span>
                  </div>
                  <p className="font-bold text-gray-800 truncate" style={{ fontSize: '13px' }}>{user?.name || 'User'}</p>
                  <p className="text-gray-400 truncate mt-0.5" style={{ fontSize: '11px' }}>{user?.email}</p>
                </div>

                <div className="mx-4 border-t border-gray-100/80" />

                {/* Desktop Nav */}
                <nav className="p-2.5 hidden lg:block">
                  {navItems.map((item) => {
                    const isActive = currentTab === item.id;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`portal-nav-link flex items-center gap-2.5 px-3 py-2.5 rounded-lg group ${isActive ? 'active' : ''}`}
                      >
                        <div
                          className="shrink-0 flex items-center justify-center rounded-md transition-all"
                          style={{
                            width: '28px', height: '28px',
                            background: isActive ? 'linear-gradient(135deg, #F06123, #FF8803)' : '#f5f5f5',
                            boxShadow: isActive ? '0 2px 8px rgba(240,97,35,0.25)' : 'none'
                          }}
                        >
                          <Icon style={{ fontSize: '11px', color: isActive ? '#fff' : '#9ca3af' }} className="group-hover:text-[#F06123] transition-colors" />
                        </div>
                        <span
                          className={`font-semibold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}
                          style={{ fontSize: '12.5px' }}
                        >
                          {item.label}
                        </span>
                        {isActive && <FaChevronRight className="ml-auto text-[#F06123]/50" style={{ fontSize: '8px' }} />}
                      </Link>
                    );
                  })}

                  <div className="my-1.5 mx-2 border-t border-gray-100/60" />
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-red-50/60 group"
                  >
                    <div className="shrink-0 flex items-center justify-center rounded-md" style={{ width: '28px', height: '28px', background: '#fef2f2' }}>
                      <FaSignOutAlt className="text-red-400 group-hover:text-red-500" style={{ fontSize: '11px' }} />
                    </div>
                    <span className="text-red-500 group-hover:text-red-600 font-semibold" style={{ fontSize: '12.5px' }}>Sign Out</span>
                  </button>
                </nav>

                {/* Mobile Nav */}
                <div className="lg:hidden p-2.5">
                  <div className="portal-scroll flex gap-1.5 overflow-x-auto pb-0.5">
                    {navItems.map((item) => {
                      const isActive = currentTab === item.id;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap shrink-0 transition-all"
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            background: isActive ? 'linear-gradient(135deg, #F06123, #FF8803)' : '#f5f5f5',
                            color: isActive ? '#fff' : '#6b7280',
                            boxShadow: isActive ? '0 2px 8px rgba(240,97,35,0.2)' : 'none'
                          }}
                        >
                          <Icon style={{ fontSize: '10px' }} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="flex-1 min-w-0 portal-fade">
              {/* Page Header */}
              {(title || TitleIcon) && (
                <div className="bg-white rounded-xl mb-5 px-5 py-4"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-3">
                    {TitleIcon && (
                      <div className="shrink-0 flex items-center justify-center rounded-lg"
                        style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #F06123, #FF8803)', boxShadow: '0 2px 8px rgba(240,97,35,0.2)' }}>
                        <TitleIcon style={{ fontSize: '13px', color: '#fff' }} />
                      </div>
                    )}
                    <div>
                      <h1 className="font-bold text-gray-800" style={{ fontSize: '14px', lineHeight: 1.3 }}>{title}</h1>
                      {subtitle && <p className="text-gray-400 font-medium mt-0.5" style={{ fontSize: '11px' }}>{subtitle}</p>}
                    </div>
                  </div>
                </div>
              )}

              {children}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};
