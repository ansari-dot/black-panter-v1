import React from 'react';
import { 
  Zap, Package, Mail, FileText, FolderKanban, Plus, UserPlus, 
  TriangleAlert, ArrowDownToLine, ArrowUpFromLine, LineChart, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { TInquiry, TService, TProduct, TSystemLog, TSystemStatus, TTab } from '../types';

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
  addService: (service: any) => Promise<void> | void;
  updateServiceStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  deleteService: (id: string) => Promise<void> | void;
  onOpenQuickAdd: (selection: 'service' | 'product') => void;
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e2e2',
  borderRadius: 8,
  padding: 20,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#8a8a8a',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const bigNum: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: '#1a1a1a',
  marginTop: 4,
  lineHeight: 1,
};

const subText: React.CSSProperties = { fontSize: 12, color: '#8a8a8a', marginTop: 6 };

const iconBubble = (bg: string, color: string): React.CSSProperties => ({
  borderRadius: '50%',
  padding: 10,
  backgroundColor: bg,
  color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#e84b10',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function DashboardPage({
  inquiries, services, products, setCurrentTab, onOpenQuickAdd,
}: DashboardPageProps) {
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;
  const activeServicesCount = services.filter(s => s.status === 'Active').length;
  const productsCount = products.length;

  const statCards = [
    { label: 'Battery Models', value: String(productsCount || 24), sub: 'Traction & Deep Cycle', icon: Package, iconBg: '#fff7ed', iconColor: '#e84b10', action: () => setCurrentTab('products') },
    { label: 'Active Services', value: String(activeServicesCount || 12), sub: 'Traction Maintenance', icon: Zap, iconBg: '#dcfce7', iconColor: '#22c55e', action: () => setCurrentTab('services') },
    { label: 'Client Inquiries', value: String(inquiries.length || 38), sub: `${newInquiriesCount} New Leads`, icon: Mail, iconBg: '#eff6ff', iconColor: '#2563eb', action: () => setCurrentTab('inquiries') },
    { label: 'Total Quotations', value: '15 Quotes', sub: 'Est. $124,500 Value', icon: FileText, iconBg: '#faf5ff', iconColor: '#9333ea', action: () => setCurrentTab('quotations') },
    { label: 'Battery Projects', value: '18 Units', sub: 'Industrial Installs', icon: FolderKanban, iconBg: '#fee2e2', iconColor: '#ef4444', action: () => setCurrentTab('projects') },
  ];

  const lowStockItems = products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock' || (p.currentStock !== undefined && p.currentStock <= 10)).slice(0, 3);
  const fallbackLowStock = [
    { name: 'Lithium Traction Battery Pack 48V', sku: 'BPB-LIT48V', current: 3, min: 10 },
    { name: 'Battery Connector Set 120A', sku: 'BPB-BC120', current: 5, min: 10 },
    { name: 'Solar Deep Cycle GEL Battery 12V', sku: 'BPB-GEL12V', current: 2, min: 12 },
  ];

  const stockMovements = [
    { type: 'in' as const, name: 'SAFT SBM 96 Battery', sku: 'BPB-SBM96', qty: '+10 Units', location: 'Sydney Warehouse', by: 'John Smith', date: '12 May 2026', time: '10:30 AM' },
    { type: 'out' as const, name: 'Lithium Traction Pack 48V', sku: 'BPB-LIT48V', qty: '-2 Units', location: 'Job #WO-2026-0156', by: 'Michael Brown', date: '12 May 2026', time: '09:15 AM' },
    { type: 'in' as const, name: 'Electrolyte Solution (1L)', sku: 'BPB-EL1L', qty: '+24 Units', location: 'Sydney Warehouse', by: 'John Smith', date: '11 May 2026', time: '04:45 PM' },
  ];

  const quickActions = [
    { label: 'Create Quotation', icon: FileText, action: () => setCurrentTab('createQuotation') },
    { label: 'Add Battery Product', icon: Plus, action: () => onOpenQuickAdd('product') },
    { label: 'Register Service', icon: Zap, action: () => onOpenQuickAdd('service') },
    { label: 'View Client Inquiries', icon: Mail, action: () => setCurrentTab('inquiries') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Inter, sans-serif' }}>

      {/* Heading */}
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Dashboard</div>
        <div style={{ fontSize: 13, color: '#8a8a8a' }}>Black Panther Batteries — Industrial Traction & Deep Cycle Overview</div>
      </div>

      {/* Stat Cards — 5 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {statCards.map(({ label, value, sub, icon: Icon, iconBg, iconColor, action }) => (
          <div 
            key={label} 
            onClick={action}
            style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={labelStyle}>{label}</div>
                <div style={bigNum}>{value}</div>
              </div>
              <div style={iconBubble(iconBg, iconColor)}>
                <Icon size={20} strokeWidth={2.4} />
              </div>
            </div>
            <div style={subText}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Trend + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* Volume & Trend Graph */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Inquiry & Quotation Volume Trend</div>
              <div style={{ fontSize: 12, color: '#8a8a8a' }}>Last 30 days battery inquiries and quote requests</div>
            </div>
            <div style={{ fontSize: 12, color: '#1a1a1a', border: '1px solid #e2e2e2', borderRadius: 4, padding: '4px 8px', backgroundColor: '#fff' }}>
              Last 30 days
            </div>
          </div>
          
          {/* Smooth SVG Trend Chart */}
          <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fdfdfd', border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 130" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e84b10" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#e84b10" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 100 Q 80 80, 160 90 T 320 50 T 500 15 L 500 130 L 0 130 Z" fill="url(#chartGrad)" />
              <path d="M 0 100 Q 80 80, 160 90 T 320 50 T 500 15" fill="none" stroke="#e84b10" strokeWidth="3" />
              {[
                { x: 10, y: 100 }, { x: 160, y: 90 }, { x: 320, y: 50 }, { x: 490, y: 15 }
              ].map((pt, idx) => (
                <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#e84b10" strokeWidth="2.5" />
              ))}
            </svg>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid #e2e2e2', borderRadius: 8, background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e84b10'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e2e2'; }}
              >
                <Icon size={16} strokeWidth={2.5} color="#1a1a1a" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock + Stock Movements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Low Stock Alerts */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={sectionTitle}>Battery Stock Alerts</div>
            <button onClick={() => setCurrentTab('inventory')} style={{ fontSize: 12, color: '#e84b10', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < lowStockItems.length - 1 ? '1px solid #e2e2e2' : 'none' }}>
                  <TriangleAlert size={18} color="#f97316" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#8a8a8a' }}>Category: {item.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#1a1a1a' }}>Status: {item.stockStatus}</div>
                    <div style={{ fontSize: 12, color: '#8a8a8a' }}>Min: {item.minStock || 5} Units</div>
                  </div>
                </div>
              ))
            ) : (
              fallbackLowStock.map((item, i) => (
                <div key={item.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < fallbackLowStock.length - 1 ? '1px solid #e2e2e2' : 'none' }}>
                  <TriangleAlert size={18} color="#f97316" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#8a8a8a' }}>SKU: {item.sku}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#1a1a1a' }}>Current: {item.current} Units</div>
                    <div style={{ fontSize: 12, color: '#8a8a8a' }}>Min: {item.min} Units</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={sectionTitle}>Recent Stock & Inventory Activity</div>
            <button onClick={() => setCurrentTab('inventory')} style={{ fontSize: 12, color: '#e84b10', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {stockMovements.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < stockMovements.length - 1 ? '1px solid #e2e2e2' : 'none' }}>
                <div style={{ borderRadius: 6, padding: 8, backgroundColor: m.type === 'in' ? '#dcfce7' : '#fee2e2', color: m.type === 'in' ? '#22c55e' : '#ef4444', display: 'flex', flexShrink: 0 }}>
                  {m.type === 'in'
                    ? <ArrowDownToLine size={16} strokeWidth={2.5} />
                    : <ArrowUpFromLine size={16} strokeWidth={2.5} />}
                </div>
                <div style={{ width: 72, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: m.type === 'in' ? '#dcfce7' : '#fee2e2', color: m.type === 'in' ? '#22c55e' : '#ef4444' }}>
                    {m.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#8a8a8a' }}>{m.sku}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: m.type === 'in' ? '#22c55e' : '#ef4444', flexShrink: 0 }}>{m.qty}</div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
                  <div style={{ fontSize: 12, color: '#1a1a1a' }}>{m.location}</div>
                  <div style={{ fontSize: 12, color: '#8a8a8a' }}>{m.by}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                  <div style={{ fontSize: 12, color: '#1a1a1a' }}>{m.date}</div>
                  <div style={{ fontSize: 12, color: '#8a8a8a' }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
