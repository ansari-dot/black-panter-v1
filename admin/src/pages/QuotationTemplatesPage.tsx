import React, { useState } from 'react';
import {
  FileText, Mail, Save, Printer
} from 'lucide-react';
import { TTab } from '../types';
import { QuotePDFPreview, QuoteDataState } from '../components/QuotePDFPreview';

interface QuotationTemplatesPageProps {
  setCurrentTab: (tab: TTab) => void;
}

const PRIMARY = '#f15a22';
const DARK = '#1a1a1a';

// ── Email Template Editor ──────────────────────────────────────────────────

interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

function EmailTemplateEditor() {
  const [activeTemplateId, setActiveTemplateId] = useState('quotation_send');
  const sectionCard: React.CSSProperties = { border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' };

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 'quotation_send',
      label: 'Quotation Send Email',
      subject: 'Quotation BPQ-2026-00124 – Battery Maintenance Service',
      body: `Dear {{customer_name}},

Please find attached our quotation {{quote_number}} for the battery maintenance service.

This quotation is valid for {{validity_days}} days from the date of issue ({{quote_date}}). The total amount is {{grand_total}} (inc. GST).

Please let us know if you have any questions or would like to proceed with the order.

Best regards,
Black Panther Batteries Team`
    },
    {
      id: 'quotation_followup',
      label: 'Follow-up Reminder',
      subject: 'Reminder: Quotation BPQ-2026-00124 – Pending Acceptance',
      body: `Dear {{customer_name}},

This is a friendly reminder regarding our quotation {{quote_number}} sent on {{quote_date}}.

The quotation will expire on {{expiry_date}}. Please let us know if you would like to proceed or have any questions.

Best regards,
Black Panther Batteries Team`
    },
    {
      id: 'quotation_accepted',
      label: 'Quotation Accepted',
      subject: 'Quotation BPQ-2026-00124 – Accepted & Confirmed',
      body: `Dear {{customer_name}},

Thank you for accepting quotation {{quote_number}}. We are pleased to confirm your order.

Our team will be in touch shortly to schedule the service. A detailed confirmation and work schedule will follow.

Best regards,
Black Panther Batteries Team`
    },
    {
      id: 'quotation_expired',
      label: 'Quotation Expired',
      subject: 'Quotation BPQ-2026-00124 – Expired Notice',
      body: `Dear {{customer_name}},

We would like to inform you that quotation {{quote_number}} has expired as of {{expiry_date}}.

If you are still interested, please contact us and we will be happy to prepare an updated quotation for you.

Best regards,
Black Panther Batteries Team`
    }
  ]);

  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];

  const handleSubjectChange = (val: string) => {
    setTemplates(prev => prev.map(t => t.id === activeTemplateId ? { ...t, subject: val } : t));
  };

  const handleBodyChange = (val: string) => {
    setTemplates(prev => prev.map(t => t.id === activeTemplateId ? { ...t, body: val } : t));
  };

  const handleSave = () => {
    alert(`Saved template "${activeTemplate.label}" successfully!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Template selector */}
      <div style={sectionCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Mail size={15} style={{ color: PRIMARY }} strokeWidth={2.4} />
          <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Email Templates
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTemplateId(t.id)}
              style={{
                padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                border: activeTemplateId === t.id ? `2px solid ${PRIMARY}` : '1px solid #e2e2e2',
                borderRadius: 6,
                backgroundColor: activeTemplateId === t.id ? '#fff5f0' : '#fff',
                color: activeTemplateId === t.id ? PRIMARY : '#1a1a1a',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Email fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>Subject Line</div>
            <input
              type="text"
              value={activeTemplate.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              style={{
                width: '100%', border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 14px',
                fontSize: 13, color: '#1a1a1a', outline: 'none', backgroundColor: '#fff',
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>Email Body</div>
            <textarea
              value={activeTemplate.body}
              onChange={(e) => handleBodyChange(e.target.value)}
              rows={8}
              style={{
                width: '100%', border: '1px solid #e2e2e2', borderRadius: 6, padding: '12px 16px',
                fontSize: 13, color: '#1a1a1a', lineHeight: 1.7, outline: 'none',
                backgroundColor: '#fff', resize: 'vertical', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Available variables */}
          <div style={{ padding: '12px 16px', backgroundColor: '#f8f8f8', borderRadius: 6, border: '1px solid #e2e2e2' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Available Variables</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['{{customer_name}}', '{{quote_number}}', '{{quote_date}}', '{{expiry_date}}', '{{grand_total}}', '{{validity_days}}', '{{company_name}}', '{{sales_rep}}'].map(v => (
                <span key={v} style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 4,
                  backgroundColor: '#fff', border: '1px solid #e2e2e2', color: PRIMARY, fontFamily: 'monospace',
                }}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSave}
              style={{
                border: 'none', borderRadius: 6, padding: '8px 20px',
                fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Save size={14} strokeWidth={2.4} /> Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function QuotationTemplatesPage({ setCurrentTab }: QuotationTemplatesPageProps) {
  const [activeView, setActiveView] = useState<'email' | 'pdf'>('pdf');

  // Unified quote state so that any edits are persistent across view switches
  const [quoteData, setQuoteData] = useState<QuoteDataState>({
    quoteNo: 'BPQ-2026-00124',
    quoteDate: '12 May 2026',
    expiryDate: '11 Jun 2026',
    preparedBy: 'Admin',
    salesRep: 'John Smith',
    projectName: 'N/A',
    customerRef: 'N/A',
    client: {
      companyName: 'ABC Engineering Pty Ltd',
      contactPerson: 'Michael Johnson',
      email: 'michael.johnson@abceng.com.au',
      phone: '0400 123 456',
      siteAddress: '45 Industrial Drive, Wetherill Park NSW 2164',
      billingAddress: 'Same as Site Address',
      abn: '12 345 678 901',
    },
    battery: {
      batteryType: 'Ni-Cd',
      manufacturer: 'SAFT',
      model: 'SBM 96',
      voltage: '120V DC',
      capacity: '200 Ah',
      cells: '96',
      banks: '2',
      installYear: '2018',
      location: 'Battery Room 1',
    },
    serviceCategory: 'Ni-Cd Battery Maintenance',
    scopeOfWork: [
      { name: 'Visual Inspection', checked: true },
      { name: 'Torque Check', checked: true },
      { name: 'Internal Resistance Test', checked: true },
      { name: 'Cell Voltage Measurement', checked: true },
      { name: 'Charger Inspection', checked: true },
      { name: 'Ventilation Inspection', checked: true },
      { name: 'Electrolyte Level Inspection', checked: true },
      { name: 'Battery Rack Inspection', checked: true },
      { name: 'Safety Inspection', checked: true },
      { name: 'Terminal Cleaning', checked: true },
      { name: 'Cell Temperature Measurement', checked: true },
      { name: 'Final Report & Recommendations', checked: true },
      { name: 'Corrosion Removal', checked: true },
      { name: 'Capacity Assessment', checked: true }
    ],
    materials: [
      { desc: 'Replacement Cell – SAFT SBM 96', partNo: 'SBM96', qty: 4, unit: 'PCS', price: 450 },
      { desc: 'Battery Connector', partNo: 'BC-120', qty: 4, unit: 'PCS', price: 35 },
      { desc: 'Electrolyte (Litre)', partNo: 'ELEC-01', qty: 10, unit: 'LTR', price: 8 },
      { desc: 'Terminal Protector', partNo: 'TP-01', qty: 4, unit: 'PCS', price: 12 }
    ],
    labour: [
      { desc: 'Senior Battery Technician', hours: 8, rate: 120 },
      { desc: 'Battery Technician', hours: 8, rate: 95 }
    ],
    equipment: [
      { name: 'Battery Analyzer', checked: true },
      { name: 'Hydrometer', checked: true },
      { name: 'Digital Multimeter', checked: true },
      { name: 'Insulation Tester', checked: true },
      { name: 'Torque Wrench', checked: true },
      { name: 'PPE Equipment', checked: true },
      { name: 'Load Bank', checked: true },
      { name: 'Forklift', checked: true },
      { name: 'Thermal Camera', checked: true }
    ],
    additionalCharges: [
      { desc: 'Travel', amount: 150 },
      { desc: 'Disposal Fee', amount: 100 },
      { desc: 'Weekend Loading', amount: 0 },
      { desc: 'Other', amount: 0 }
    ],
    terms: [
      'This quote is valid for 30 days from the quote date.',
      'All prices are in Australian Dollars and include GST unless stated otherwise.',
      'Payment terms are 30 days from date of invoice unless otherwise agreed.',
      'Customer must provide safe and clear access to the site.',
      'Any additional work outside the scope will be charged separately.',
      'Black Panther Batteries reserves the right to update this quote if site conditions change.',
      'All works will be carried out in accordance with applicable Australian Standards.'
    ],
    notes: [
      'Battery bank shows signs of ageing. Regular maintenance recommended.',
      'Cell replacement recommended in the next service cycle.',
      'Improve ventilation in battery room.'
    ],
    signature: {
      preparedByName: 'John Smith',
      preparedByPos: 'Sales Manager',
      preparedByDate: '12 May 2026'
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDFTemplate = () => {
    alert('Saved PDF Quote template changes successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} className="no-print">
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: DARK }}>Quotation Templates</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Manage email templates and PDF quotation layout.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeView === 'pdf' && (
            <button
              onClick={handleSavePDFTemplate}
              style={{
                border: 'none', borderRadius: 6, padding: '8px 16px',
                fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Save size={15} strokeWidth={2.4} /> Save Layout
            </button>
          )}
          <button
            onClick={handlePrint}
            style={{
              border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px',
              fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Printer size={15} strokeWidth={2.4} /> Print
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 0 }} className="no-print">
        <button
          onClick={() => setActiveView('pdf')}
          style={{
            padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: '1px solid #e2e2e2', borderRadius: '8px 0 0 8px',
            backgroundColor: activeView === 'pdf' ? DARK : '#fff',
            color: activeView === 'pdf' ? '#fff' : '#1a1a1a',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={15} strokeWidth={2.4} /> PDF Template
          </span>
        </button>
        <button
          onClick={() => setActiveView('email')}
          style={{
            padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: '1px solid #e2e2e2', borderLeft: 'none', borderRadius: '0 8px 8px 0',
            backgroundColor: activeView === 'email' ? DARK : '#fff',
            color: activeView === 'email' ? '#fff' : '#1a1a1a',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={15} strokeWidth={2.4} /> Email Templates
          </span>
        </button>
      </div>

      {/* Content */}
      {activeView === 'pdf' && (
        <div style={{ backgroundColor: '#e8e8e8', borderRadius: 12, padding: '32px 20px' }}>
          <QuotePDFPreview quoteData={quoteData} setQuoteData={setQuoteData} />
        </div>
      )}

      {activeView === 'email' && (
        <EmailTemplateEditor />
      )}
    </div>
  );
}
