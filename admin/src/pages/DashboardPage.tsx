/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Zap, Battery, Eye, Plus, Server } from 'lucide-react';
import { TInquiry, TService, TProduct, TSystemLog, TSystemStatus, TTab } from '../types';
import StatCard from '../components/StatCard';
import RecentInquiries from '../components/RecentInquiries';
import ServicesManager from '../components/ServicesManager';

interface DashboardPageProps {
  inquiries: TInquiry[];
  services: TService[];
  products: TProduct[];
  logs: TSystemLog[];
  systemStatus: TSystemStatus;
  onRefresh: () => void;
  setCurrentTab: (tab: TTab) => void;
  markInquiryRead: (id: string) => void;
  replyToInquiry: (id: string, replyText: string) => void;
  deleteInquiry: (id: string) => void;
  addService: (service: {
    name: string;
    slug: string;
    description: string;
    category: string;
    status: 'Active' | 'Inactive';
    iconName: string;
    serviceTagline: string;
    heroDescription: string;
    imageUrl: string;
    ctaText: string;
    secondaryText: string;
    keyHighlights: string[];
    technicalProcedures: Array<{ title: string; description: string; icon: string }>;
    displayOrder: number;
  }) => Promise<void> | void;
  updateServiceStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  deleteService: (id: string) => Promise<void> | void;
  onOpenQuickAdd: (selection: 'service' | 'product') => void;
}

export default function DashboardPage({
  inquiries,
  services,
  products,
  logs,
  systemStatus,
  onRefresh,
  setCurrentTab,
  markInquiryRead,
  replyToInquiry,
  deleteInquiry,
  addService,
  updateServiceStatus,
  deleteService,
  onOpenQuickAdd,
}: DashboardPageProps) {
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;
  const activeServicesCount = services.filter((s) => s.status === 'Active').length;
  const productsCount = products.length;

  return (
    <div id="tab-dashboard" className="animate-fade-in flex flex-col gap-6 font-sans">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back — here's what's happening with Black Panther Batteries today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          idPrefix="new-inquiries"
          title="New Inquiries"
          value={newInquiriesCount}
          trendText="+3 today"
          trendType="positive"
          icon={Mail}
          onClickInfo={() => setCurrentTab('inquiries')}
        />
        <StatCard
          idPrefix="active-services"
          title="Active Services"
          value={activeServicesCount}
          trendText="+1 this week"
          trendType="positive"
          icon={Zap}
          onClickInfo={() => setCurrentTab('services')}
        />
        <StatCard
          idPrefix="products-listed"
          title="Products Listed"
          value={productsCount}
          trendText="No change"
          trendType="neutral"
          icon={Battery}
          onClickInfo={() => setCurrentTab('products')}
        />
        <StatCard
          idPrefix="site-visits"
          title="Site Visits Today"
          value="284"
          trendText="+18%"
          trendType="positive"
          icon={Eye}
          onClickInfo={onRefresh}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Inquiries — col span 3 */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <RecentInquiries
            inquiries={inquiries}
            onReply={replyToInquiry}
            onMarkRead={markInquiryRead}
            onDelete={deleteInquiry}
            isCompact={true}
          />
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentTab('inquiries')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all inquiries ({inquiries.length}) →
            </button>
          </div>
        </div>

        {/* Right — col span 2 */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          <ServicesManager
            services={services}
            onAddService={addService}
            onUpdateStatus={updateServiceStatus}
            onDeleteService={deleteService}
            isCompact={true}
          />

          {/* Quick actions */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-semibold font-headings text-foreground mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Add New Service', icon: Plus, action: () => onOpenQuickAdd('service') },
                { label: 'Add New Product', icon: Battery, action: () => onOpenQuickAdd('product') },
                { label: 'System Settings', icon: Server, action: () => setCurrentTab('settings') },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 text-left transition-all cursor-pointer group"
                >
                  <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </span>
                  <span className="text-xs font-medium text-foreground">{label}</span>
                  <span className="ml-auto text-muted-foreground group-hover:text-primary text-xs transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
