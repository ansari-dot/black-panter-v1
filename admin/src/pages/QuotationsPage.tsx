import React, { useState } from 'react';
import { FileText, Plus, ArrowRight, Trash2, Calendar, ShieldCheck, HelpCircle, ChevronDown, Check, Eye } from 'lucide-react';
import { TInquiry, TQuotation, TTab } from '../types';

interface QuotationsPageProps {
  inquiries: TInquiry[];
  quotations: TQuotation[];
  onDeleteQuotation: (id: string) => void;
  setCurrentTab: (tab: TTab) => void;
  onSelectInquiryForQuote: (inquiry: TInquiry) => void;
  onSelectQuotationForEdit: (quotation: TQuotation) => void;
}

const PRIMARY = '#f15a22';

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  Draft: { background: '#f5f5f5', color: '#666' },
  Sent: { background: '#fff3ee', color: '#e84b10' },
  'Sent Email': { background: '#e0f2fe', color: '#0284c7' },
  Pending: { background: '#fffbeb', color: '#d97706' },
  Accepted: { background: '#dcfce7', color: '#16a34a' },
  Expired: { background: '#fef2f2', color: '#dc2626' },
};

export default function QuotationsPage({
  inquiries,
  quotations,
  onDeleteQuotation,
  setCurrentTab,
  onSelectInquiryForQuote,
  onSelectQuotationForEdit,
}: QuotationsPageProps) {
  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'sent'>('requests');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter quote requests (inquiries of type === 'quote')
  const clientRequests = inquiries.filter(inq => inq.type === 'quote');

  const filteredRequests = clientRequests.filter(inq => {
    const q = searchQuery.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      (inq.company && inq.company.toLowerCase().includes(q)) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.service && inq.service.toLowerCase().includes(q))
    );
  });

  const filteredQuotations = quotations.filter(q => {
    const s = searchQuery.toLowerCase();
    return (
      q.quoteNo.toLowerCase().includes(s) ||
      (q.client?.companyName && q.client.companyName.toLowerCase().includes(s)) ||
      (q.client?.contactPerson && q.client.contactPerson.toLowerCase().includes(s)) ||
      (q.projectName && q.projectName.toLowerCase().includes(s))
    );
  });

  const handleProcessRequest = (inq: TInquiry) => {
    onSelectInquiryForQuote(inq);
    setCurrentTab('createQuotation');
  };

  const handleEditQuotation = (quot: TQuotation) => {
    onSelectQuotationForEdit(quot);
    setCurrentTab('createQuotation');
  };

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e2e2',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header and Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Quotations Hub</h1>
          <p style={{ fontSize: 13, color: '#888888', marginTop: 4, marginBottom: 0 }}>
            Manage incoming client quote requests and formal admin-created quotations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => {
              onSelectQuotationForEdit({} as any); // Clear edit selection
              onSelectInquiryForQuote({} as any); // Clear prefill selection
              setCurrentTab('createQuotation');
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              backgroundColor: PRIMARY,
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            <Plus size={16} strokeWidth={2.4} /> Create Quotation from Scratch
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e2e2', gap: 24 }}>
        <button
          onClick={() => { setActiveSubTab('requests'); setSearchQuery(''); }}
          style={{
            padding: '12px 8px',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'requests' ? `3px solid ${PRIMARY}` : '3px solid transparent',
            color: activeSubTab === 'requests' ? '#1a1a1a' : '#888',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: -2,
            transition: 'all 0.2s',
          }}
        >
          Quotation Requests ({clientRequests.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('sent'); setSearchQuery(''); }}
          style={{
            padding: '12px 8px',
            background: 'none',
            border: 'none',
            borderBottom: activeSubTab === 'sent' ? `3px solid ${PRIMARY}` : '3px solid transparent',
            color: activeSubTab === 'sent' ? '#1a1a1a' : '#888',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: -2,
            transition: 'all 0.2s',
          }}
        >
          Created Quotations ({quotations.length})
        </button>
      </div>

      {/* Filter and search bar */}
      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder={activeSubTab === 'requests' ? 'Search client requests...' : 'Search created quotations...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: 13,
            borderRadius: 8,
            border: '1px solid #e2e2e2',
            outline: 'none',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
          }}
        />
      </div>

      {/* Sub-tab content */}
      {activeSubTab === 'requests' ? (
        <div style={cardStyle}>
          {filteredRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: 13 }}>
              No quotation requests found from clients.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px 140px', background: '#fafafa', borderBottom: '1px solid #e2e2e2', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <span>Client / Contact</span>
                <span>Requested Service</span>
                <span>Battery Details</span>
                <span>Site Location</span>
                <span>Urgency</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
              </div>
              {filteredRequests.map(inq => (
                <div key={inq.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 100px 140px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13, alignItems: 'center', color: '#1a1a1a' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{inq.company || inq.name}</span>
                    <span style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{inq.name} • {inq.email}</span>
                  </div>
                  <span>{inq.service || 'Ni-Cd Battery Service'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{inq.quoteDetails?.batteryType || 'Battery'}</span>
                    <span style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Qty: {inq.quoteDetails?.quantity || '—'}</span>
                  </div>
                  <span>{inq.quoteDetails?.location || '—'}</span>
                  <div>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: inq.quoteDetails?.urgency === 'Emergency' ? '#fef2f2' : inq.quoteDetails?.urgency === 'This week' ? '#fff3ee' : '#f5f5f5',
                      color: inq.quoteDetails?.urgency === 'Emergency' ? '#dc2626' : inq.quoteDetails?.urgency === 'This week' ? '#e84b10' : '#666'
                    }}>
                      {inq.quoteDetails?.urgency || 'Normal'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                      onClick={() => handleProcessRequest(inq)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        backgroundColor: '#fff',
                        border: `1px solid ${PRIMARY}`,
                        color: PRIMARY,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      Process <ArrowRight size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          {filteredQuotations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: 13 }}>
              No created quotations. Click "Create Quotation" to start.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 1fr 1fr 130px', background: '#fafafa', borderBottom: '1px solid #e2e2e2', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <span>Quote Number</span>
                <span>Client / Project</span>
                <span>Date</span>
                <span>Grand Total</span>
                <span>Status</span>
                <span style={{ textAlign: 'right' }}>Actions</span>
              </div>
              {filteredQuotations.map(quot => {
                const badge = STATUS_STYLE[quot.status] || STATUS_STYLE.Draft;
                return (
                  <div key={quot.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 1fr 1fr 130px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13, alignItems: 'center', color: '#1a1a1a' }}>
                    <span style={{ fontWeight: 700, color: PRIMARY }}>{quot.quoteNo}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{quot.client?.companyName || quot.client?.contactPerson}</span>
                      <span style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{quot.projectName || 'Battery Maintenance Service'}</span>
                    </div>
                    <span>{quot.quoteDate}</span>
                    <span style={{ fontWeight: 600 }}>${Number(quot.grandTotal).toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
                    <div>
                      <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, ...badge }}>
                        {quot.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        title="Edit Quotation"
                        onClick={() => handleEditQuotation(quot)}
                        style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e2e2', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <FileText size={13} style={{ color: '#555' }} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete quotation ${quot.quoteNo}?`)) {
                            onDeleteQuotation(quot.id!);
                          }
                        }}
                        style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e2e2', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={13} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
