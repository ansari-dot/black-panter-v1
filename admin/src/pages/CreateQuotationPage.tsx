import React, { useState, useEffect } from 'react';
import {
  FileText, Calendar, ChevronDown, User, BatteryCharging,
  Eye, ArrowRight, ArrowLeft, FileDown, X, Plus, Check,
  ListChecks, Pencil, Upload, GripVertical, Trash2,
  Package, Users, Wrench, PlusCircle, Send, Landmark, Shield, Printer
} from 'lucide-react';
import { TTab, TInquiry, TQuotation } from '../types';
import { QuotePDFPreview } from '../components/QuotePDFPreview';

interface CreateQuotationPageProps {
  setCurrentTab: (tab: TTab) => void;
  prefillData: TInquiry | null;
  onClearPrefill: () => void;
  editData: TQuotation | null;
  onClearEdit: () => void;
  onAddQuotation: (quotation: Omit<TQuotation, 'id'>) => Promise<TQuotation>;
  onUpdateQuotation: (id: string, quotation: Partial<TQuotation>) => Promise<TQuotation>;
  onReplyToInquiry: (id: string, replyText: string) => Promise<void>;
}

const PRIMARY = '#f15a22';

// ── Shared components ────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
    <Icon size={15} style={{ color: PRIMARY, flexShrink: 0 }} strokeWidth={2.4} />
    <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
      {label}
    </span>
  </div>
);

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <div style={{ fontSize: 11, fontWeight: 500, color: '#1a1a1a', marginBottom: 4 }}>
    {children}{required && <span style={{ color: PRIMARY, marginLeft: 2 }}>*</span>}
  </div>
);

const fieldBox: React.CSSProperties = {
  border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 12px',
  fontSize: 13, color: '#1a1a1a', backgroundColor: '#ffffff',
};

const inputStyle: React.CSSProperties = {
  ...fieldBox,
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

// ── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ['Quote Details', 'Scope & Items', 'Pricing', 'Terms & Notes', 'Review & Send'];

function Stepper({ current }: { current: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '16px 32px', borderBottom: '1px solid #e2e2e2', backgroundColor: '#ffffff',
    }}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                backgroundColor: done ? '#1a1a1a' : active ? PRIMARY : '#f0f0f0',
                color: done || active ? '#ffffff' : '#888888',
              }}>
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{
                fontSize: 13, whiteSpace: 'nowrap',
                fontWeight: active ? 600 : 400,
                color: done ? '#1a1a1a' : active ? PRIMARY : '#888888',
              }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 80, height: 1, margin: '0 24px', flexShrink: 0,
                backgroundColor: done ? '#1a1a1a' : '#e2e2e2',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Standard Templates ───────────────────────────────────────────────────────

const STANDARD_SCOPE_NICD = [
  'Visual inspection of battery bank and components',
  'Cell voltage measurement and recording',
  'Electrolyte level inspection and top-up if required',
  'Terminal cleaning and corrosion removal',
  'Torque check of all connections',
  'Charger inspection and performance check',
  'Battery rack and enclosure inspection',
  'Internal resistance test',
  'Detailed service report and recommendations',
];

const STANDARD_SCOPE_LEAD_ACID = [
  'Specific gravity measurements of all cells',
  'Load testing and discharge performance checks',
  'Equalize charge sequence configurations',
  'Rack structural integrity assessments',
  'Safety warning signage audit',
];

export default function CreateQuotationPage({
  setCurrentTab,
  prefillData,
  onClearPrefill,
  editData,
  onClearEdit,
  onAddQuotation,
  onUpdateQuotation,
  onReplyToInquiry
}: CreateQuotationPageProps) {
  const [step, setStep] = useState(0);

  // Form State Values
  const [quoteNo, setQuoteNo] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [salesRep, setSalesRep] = useState('');
  const [projectName, setProjectName] = useState('');
  const [customerRef, setCustomerRef] = useState('');
  const [poReference, setPoReference] = useState('');

  // Client Details
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [abn, setAbn] = useState('');

  // Battery Details
  const [batteryType, setBatteryType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [voltage, setVoltage] = useState('');
  const [capacity, setCapacity] = useState('');
  const [cells, setCells] = useState('');
  const [banks, setBanks] = useState('');
  const [installYear, setInstallYear] = useState('');
  const [batteryLocation, setBatteryLocation] = useState('');
  const [description, setDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');


  // Scope of Work
  const [scopeOfWork, setScopeOfWork] = useState<{ name: string; checked: boolean }[]>([]);
  const [customScopeTemplate, setCustomScopeTemplate] = useState('Ni-Cd Battery Maintenance - Standard');

  // Custom checklist items
  const [customItems, setCustomItems] = useState<{ id: number; description: string; details: string; qty: number; unit: string }[]>([]);

  // Pricing Items lists
  const [materials, setMaterials] = useState<{ desc: string; partNo: string; qty: number; unit: string; price: number }[]>([]);
  const [labour, setLabour] = useState<{ desc: string; hours: number; rate: number }[]>([]);
  const [equipment, setEquipment] = useState<{ desc: string; qtyHrs: number; rate: number }[]>([]);
  const [additionalCharges, setAdditionalCharges] = useState<{ desc: string; amount: number }[]>([]);

  // Discount & Tax
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxRate, setTaxRate] = useState(10); // 10% GST
  const [currency, setCurrency] = useState('AUD – Australian Dollar (A$)');

  // Terms & Notes
  const [terms, setTerms] = useState<string[]>([]);
  const [internalNotes, setInternalNotes] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [requireSignature, setRequireSignature] = useState(false);

  // Bank details
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bsb, setBsb] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Send Email State
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendCopyToMe, setSendCopyToMe] = useState(false);

  // Prefill hook trigger
  useEffect(() => {
    // If Editing
    if (editData && editData.quoteNo) {
      setQuoteNo(editData.quoteNo);
      setQuoteDate(editData.quoteDate || '');
      setExpiryDate(editData.expiryDate || '');
      setPreparedBy(editData.preparedBy || 'Admin Team');
      setSalesRep(editData.salesRep || 'John Smith');
      setProjectName(editData.projectName || 'Battery Maintenance');
      setCustomerRef(editData.customerRef || '');
      setPoReference(editData.poReference || '');

      setCompanyName(editData.client?.companyName || '');
      setContactPerson(editData.client?.contactPerson || '');
      setEmail(editData.client?.email || '');
      setPhone(editData.client?.phone || '');
      setSiteAddress(editData.client?.siteAddress || '');
      setBillingAddress(editData.client?.billingAddress || 'Same as Site Address');
      setAbn(editData.client?.abn || '');

      setBatteryType(editData.battery?.batteryType || 'Ni-Cd');
      setManufacturer(editData.battery?.manufacturer || 'SAFT');
      setModel(editData.battery?.model || 'SBM 96');
      setVoltage(editData.battery?.voltage || '120V DC');
      setCapacity(editData.battery?.capacity || '200 Ah');
      setCells(editData.battery?.cells || '96');
      setBanks(editData.battery?.banks || '2');
      setInstallYear(editData.battery?.installYear || '2018');
      setBatteryLocation(editData.battery?.location || 'Battery Room 1');
      setDescription(editData.description || '');

      setScopeOfWork(editData.scopeOfWork || []);
      setMaterials(editData.materials || []);
      setLabour(editData.labour || []);
      setEquipment(editData.equipment || []);
      setAdditionalCharges(editData.additionalCharges || []);

      setDiscountValue(editData.discountValue || 0);
      setTerms(editData.terms || []);
      setInternalNotes(editData.internalNotes || '');
      setCustomerNotes(editData.customerNotes || '');
      setValidityDays(editData.validityDays || 30);
      setRequireSignature(editData.requireSignature || false);

      setShowBankDetails(editData.showBankDetails || false);
      setBankName(editData.bankName || 'Commonwealth Bank');
      setAccountName(editData.accountName || 'Black Panther Batteries Pty Ltd');
      setBsb(editData.bsb || '062-000');
      setAccountNumber(editData.accountNumber || '1234 5678');

      setRecipientEmail(editData.client?.email || '');
    }
    // If Prefilling from client inquiry
    else if (prefillData && prefillData.name) {
      setQuoteNo(`BPQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setQuoteDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      setExpiryDate(expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
      setProjectName(prefillData.service ? `${prefillData.service} Service` : 'Battery Maintenance Service');

      const isLead = (prefillData.quoteDetails?.batteryType || '').toLowerCase().includes('lead');
      setBatteryType(prefillData.quoteDetails?.batteryType || '');
      setBatteryLocation(prefillData.quoteDetails?.location || '');
      setDescription(prefillData.message || '');

      const activeTmpl = isLead ? 'Lead-Acid Battery Maintenance - Standard' : 'Ni-Cd Battery Maintenance - Standard';
      setCustomScopeTemplate(activeTmpl);
      handleLoadTemplate(activeTmpl);

      setCompanyName(prefillData.company || '');
      setContactPerson(prefillData.name || '');
      setEmail(prefillData.email || '');
      setPhone(prefillData.phone || '');
      setSiteAddress(prefillData.quoteDetails?.address || prefillData.quoteDetails?.location || '');
      setBillingAddress(prefillData.quoteDetails?.billingAddress || 'Same as Site Address');
      setAbn(prefillData.quoteDetails?.abn || '');


      setInternalNotes(prefillData.message ? `Client Note: ${prefillData.message}` : '');
      setRecipientEmail(prefillData.email || '');
    }
    // Else from scratch
    else {
      setQuoteNo(`BPQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setQuoteDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      setExpiryDate(expDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));

      setScopeOfWork(STANDARD_SCOPE_NICD.map(item => ({ name: item, checked: true })));
      setMaterials([
        { desc: 'Replacement Cell – SAFT SBM 96', partNo: 'PART-001', qty: 4, unit: 'PCS', price: 450 },
      ]);
      setLabour([
        { desc: 'Senior Battery Technician', hours: 8, rate: 120 }
      ]);
      setEquipment([
        { desc: 'Load Bank (2 Hour Test)', qtyHrs: 2, rate: 75 }
      ]);
      setAdditionalCharges([
        { desc: 'Travel', amount: 150 }
      ]);
      setTerms([
        'This quotation is valid for 30 days from the date of issue.',
        'All prices are in Australian Dollars (AUD) and include GST.',
        'Payment terms are 30 days from the date of invoice.'
      ]);
    }
  }, [prefillData, editData]);

  // Handle email message pre-generation on review tab
  useEffect(() => {
    if (step === 4) {
      setSubjectLine(`Quotation ${quoteNo} – ${projectName}`);
      setMessageBody(`Dear ${contactPerson || 'Customer'},\n\nPlease find attached our quotation ${quoteNo} for the battery service. This quotation is valid for ${validityDays} days.\n\nTotal Amount: $${grandTotal.toFixed(2)} (AUD).\n\nBest regards,\nBlack Panther Batteries Team`);
      if (!recipientEmail && email) {
        setRecipientEmail(email);
      }
    }
  }, [step, email]);

  // Pricing calculations
  const materialsSubtotal = materials.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const labourSubtotal = labour.reduce((sum, item) => sum + (item.hours * item.rate), 0);
  const equipmentSubtotal = equipment.reduce((sum, item) => sum + (item.qtyHrs * item.rate), 0);
  const additionalSubtotal = additionalCharges.reduce((sum, item) => sum + item.amount, 0);

  const subtotal = materialsSubtotal + labourSubtotal + equipmentSubtotal + additionalSubtotal;
  const discountAmount = discountType === 'percentage' ? (subtotal * discountValue / 100) : discountValue;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (taxRate / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Template loader
  const handleLoadTemplate = (templateName: string = customScopeTemplate) => {
    if (templateName.includes('Ni-Cd')) {
      setScopeOfWork(STANDARD_SCOPE_NICD.map(item => ({ name: item, checked: true })));
      setMaterials([
        { desc: 'Replacement Cell – SAFT SBM 96', partNo: 'PART-001', qty: 4, unit: 'PCS', price: 450 },
        { desc: 'Battery Connector', partNo: 'CONN-022', qty: 4, unit: 'PCS', price: 35 },
      ]);
      setLabour([
        { desc: 'Senior Battery Technician', hours: 8, rate: 120 },
        { desc: 'Battery Technician', hours: 8, rate: 95 }
      ]);
      setEquipment([
        { desc: 'Load Bank (2 Hour Test)', qtyHrs: 2, rate: 75 },
        { desc: 'Battery Analyzer', qtyHrs: 1, rate: 50 }
      ]);
      setAdditionalCharges([
        { desc: 'Travel & Mobilization', amount: 150 }
      ]);
      setTerms([
        'This quotation is valid for 30 days from the date of issue.',
        'All prices are in Australian Dollars (AUD) and include GST.',
        'Payment terms are 30 days from the date of invoice.'
      ]);
    } else {
      setScopeOfWork(STANDARD_SCOPE_LEAD_ACID.map(item => ({ name: item, checked: true })));
      setMaterials([
        { desc: 'Replacement Lead-Acid Battery Cell', partNo: 'PART-LA01', qty: 6, unit: 'PCS', price: 280 },
        { desc: 'Inter-cell Connector', partNo: 'CONN-LA2', qty: 6, unit: 'PCS', price: 20 },
      ]);
      setLabour([
        { desc: 'Senior Battery Technician', hours: 6, rate: 120 },
        { desc: 'Battery Technician', hours: 6, rate: 95 }
      ]);
      setEquipment([
        { desc: 'Hydrometer & Acid Testing kit', qtyHrs: 1, rate: 40 },
        { desc: 'Insulation Tester', qtyHrs: 1, rate: 45 }
      ]);
      setAdditionalCharges([
        { desc: 'Travel & Mobilization', amount: 150 }
      ]);
      setTerms([
        'This quotation is valid for 30 days from the date of issue.',
        'All prices are in Australian Dollars (AUD) and include GST.',
        'Payment terms are 30 days from the date of invoice.'
      ]);
    }
  };

  // Submit Handler
  const handleSave = async (status: 'Draft' | 'Sent') => {
    const payload: Omit<TQuotation, 'id'> = {
      quoteNo,
      quoteDate,
      expiryDate,
      preparedBy,
      salesRep,
      projectName,
      customerRef,
      poReference,
      client: { companyName, contactPerson, email, phone, siteAddress, billingAddress, abn },
      battery: { batteryType, manufacturer, model, voltage, capacity, cells, banks, installYear, location: batteryLocation },
      description,
      serviceCategory,
      scopeOfWork,
      materials,
      labour,
      equipment,
      additionalCharges,
      terms,
      notes: [customerNotes],
      internalNotes,
      customerNotes,
      validityDays,
      requireSignature,
      showBankDetails,
      bankName,
      accountName,
      bsb,
      accountNumber,
      status,
      grandTotal,
      inquiryId: prefillData ? prefillData.id : editData ? editData.inquiryId : null
    };

    const extendedPayload = {
      ...payload,
      sendEmail: status === 'Sent Email',
      emailDetails: {
        to: recipientEmail,
        subject: subjectLine,
        body: messageBody,
        sendCopy: sendCopyToMe
      }
    };

    try {
      if (editData && editData.id) {
        await onUpdateQuotation(editData.id, extendedPayload);
      } else {
        await onAddQuotation(extendedPayload);
        if (prefillData && prefillData.id) {
          // Update inquiry status to Replied
          await onReplyToInquiry(prefillData.id, `Formal quotation ${quoteNo} created and saved as ${status}. Grand Total: $${grandTotal.toFixed(2)}.`);
        }
      }

      // Cleanup prefill / edit selections
      onClearPrefill();
      onClearEdit();
      setCurrentTab('quotations');
    } catch (err: any) {
      alert(`Error saving quotation: ${err.message}`);
    }
  };

  const printableQuoteData = {
    quoteNo,
    quoteDate,
    expiryDate,
    preparedBy,
    salesRep,
    projectName,
    customerRef,
    client: {
      companyName,
      contactPerson,
      email,
      phone,
      siteAddress,
      billingAddress,
      abn
    },
    battery: {
      batteryType,
      manufacturer,
      model,
      voltage,
      capacity,
      cells,
      banks,
      installYear,
      location: batteryLocation
    },
    serviceCategory,
    scopeOfWork,
    materials,
    labour,
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
    additionalCharges,
    terms,
    notes: customerNotes ? [customerNotes] : [],
    signature: {
      preparedByName: salesRep || preparedBy || 'John Smith',
      preparedByPos: 'Sales Representative',
      preparedByDate: quoteDate
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#f5f5f5' }}>
      
      {/* Top action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid #e2e2e2', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} strokeWidth={2} style={{ color: '#1a1a1a' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
            {editData?.id ? `Edit Quotation ${quoteNo}` : 'Create New Quotation'}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => handleSave('Draft')}
            style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer' }}
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave('Sent')}
            style={{ border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY, cursor: 'pointer' }}
          >
            Save &amp; Finalize
          </button>
        </div>
      </div>

      <Stepper current={step} />

      <div style={{ display: 'flex', gap: 24, padding: '24px 32px', flex: 1, alignItems: 'flex-start' }}>
        
        {/* Step Forms */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* STEP 1: Quote Details */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Quote Information */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={FileText} label="Quote Information" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel>Quote Number</FieldLabel>
                    <input type="text" style={inputStyle} value={quoteNo} onChange={e => setQuoteNo(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Quote Date</FieldLabel>
                    <input type="text" style={inputStyle} value={quoteDate} onChange={e => setQuoteDate(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Expiry Date</FieldLabel>
                    <input type="text" style={inputStyle} value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Sales Representative</FieldLabel>
                    <input type="text" style={inputStyle} value={salesRep} onChange={e => setSalesRep(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                  <div>
                    <FieldLabel>Project Name</FieldLabel>
                    <input type="text" style={inputStyle} value={projectName} onChange={e => setProjectName(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>PO Reference (Optional)</FieldLabel>
                    <input type="text" style={inputStyle} value={poReference} onChange={e => setPoReference(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Customer Reference (Optional)</FieldLabel>
                    <input type="text" style={inputStyle} value={customerRef} onChange={e => setCustomerRef(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={User} label="Client Details" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel required>Customer Company</FieldLabel>
                    <input type="text" required style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel required>Contact Person</FieldLabel>
                    <input type="text" required style={inputStyle} value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <FieldLabel required>Email</FieldLabel>
                    <input type="email" required style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel required>Phone</FieldLabel>
                    <input type="text" required style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel required>Site Address</FieldLabel>
                    <input type="text" required style={inputStyle} value={siteAddress} onChange={e => setSiteAddress(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
                  <div>
                    <FieldLabel>Billing Address</FieldLabel>
                    <input type="text" style={inputStyle} value={billingAddress} onChange={e => setBillingAddress(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>ABN</FieldLabel>
                    <input type="text" style={inputStyle} value={abn} onChange={e => setAbn(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Battery Information */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={BatteryCharging} label="Battery Information" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel>Battery Type</FieldLabel>
                    <input type="text" style={inputStyle} value={batteryType} onChange={e => setBatteryType(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Manufacturer</FieldLabel>
                    <input type="text" style={inputStyle} value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Model</FieldLabel>
                    <input type="text" style={inputStyle} value={model} onChange={e => setModel(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel>Voltage</FieldLabel>
                    <input type="text" style={inputStyle} value={voltage} onChange={e => setVoltage(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Capacity (Ah)</FieldLabel>
                    <input type="text" style={inputStyle} value={capacity} onChange={e => setCapacity(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>No. of Cells</FieldLabel>
                    <input type="text" style={inputStyle} value={cells} onChange={e => setCells(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                  <div>
                    <FieldLabel>No. of Battery Banks</FieldLabel>
                    <input type="text" style={inputStyle} value={banks} onChange={e => setBanks(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Installation Year</FieldLabel>
                    <input type="text" style={inputStyle} value={installYear} onChange={e => setInstallYear(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Location</FieldLabel>
                    <input type="text" style={inputStyle} value={batteryLocation} onChange={e => setBatteryLocation(e.target.value)} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Description / Additional Info (Optional)</FieldLabel>
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} />
                </div>
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 16 }}>
                <button onClick={() => setStep(1)} style={{ borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Continue to Scope &amp; Items <ArrowRight size={15} strokeWidth={2.4} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Scope & Items */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={ListChecks} label="Scope of Work" />

                {/* Template loader */}
                <div style={{ marginBottom: 20 }}>
                  <FieldLabel>Select Scope Template</FieldLabel>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={customScopeTemplate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomScopeTemplate(val);
                        if (val.includes('Ni-Cd')) {
                          setScopeOfWork(STANDARD_SCOPE_NICD.map(item => ({ name: item, checked: true })));
                        } else {
                          setScopeOfWork(STANDARD_SCOPE_LEAD_ACID.map(item => ({ name: item, checked: true })));
                        }
                      }}
                      style={{ ...inputStyle, flex: 1 }}
                    >
                      <option value="Ni-Cd Battery Maintenance - Standard">Ni-Cd Battery Maintenance - Standard</option>
                      <option value="Lead-Acid Battery Maintenance - Standard">Lead-Acid Battery Maintenance - Standard</option>
                    </select>
                    <button
                      onClick={handleLoadTemplate}
                      style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Upload size={14} strokeWidth={2.5} /> Load Template
                    </button>
                  </div>
                </div>

                {/* Scope items checklist */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Scope Items Checklist</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {scopeOfWork.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 6 }}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => {
                            const copy = [...scopeOfWork];
                            copy[idx].checked = e.target.checked;
                            setScopeOfWork(copy);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const copy = [...scopeOfWork];
                            copy[idx].name = e.target.value;
                            setScopeOfWork(copy);
                          }}
                          style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#1a1a1a' }}
                        />
                        <button
                          onClick={() => setScopeOfWork(scopeOfWork.filter((_, i) => i !== idx))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setScopeOfWork([...scopeOfWork, { name: 'New Custom Task Item', checked: true }])}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add Custom Item
                  </button>
                  <button
                    onClick={() => setScopeOfWork([])}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: PRIMARY, backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Trash2 size={14} strokeWidth={2.5} /> Clear All
                  </button>
                </div>
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
                <button onClick={() => setStep(0)} style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ArrowLeft size={15} strokeWidth={2.4} /> Back to Quote Details
                </button>
                <button onClick={() => setStep(2)} style={{ borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Continue to Pricing <ArrowRight size={15} strokeWidth={2.4} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Pricing */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Materials & Products */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={Package} label="Materials & Products" />
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 16 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e2e2' }}>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>Description</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 90 }}>Qty</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 140 }}>Unit Price</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 120 }}>Total</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 0' }}>
                          <input type="text" style={inputStyle} value={item.desc} onChange={(e) => {
                            const copy = [...materials]; copy[idx].desc = e.target.value; setMaterials(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.qty} onChange={(e) => {
                            const copy = [...materials]; copy[idx].qty = Number(e.target.value); setMaterials(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.price} onChange={(e) => {
                            const copy = [...materials]; copy[idx].price = Number(e.target.value); setMaterials(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => setMaterials(materials.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setMaterials([...materials, { desc: 'New Battery Module', partNo: 'PART-002', qty: 1, unit: 'PCS', price: 100 }])}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={14} /> Add Material
                  </button>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: '#888' }}>Subtotal Materials:</span>
                    <span style={{ fontWeight: 600, color: PRIMARY, marginLeft: 8 }}>${materialsSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Labour */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={Users} label="Labour" />
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 16 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e2e2' }}>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>Technician Role / Task</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 90 }}>Hours</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 140 }}>Rate / Hr</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 120 }}>Total</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {labour.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 0' }}>
                          <input type="text" style={inputStyle} value={item.desc} onChange={(e) => {
                            const copy = [...labour]; copy[idx].desc = e.target.value; setLabour(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.hours} onChange={(e) => {
                            const copy = [...labour]; copy[idx].hours = Number(e.target.value); setLabour(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.rate} onChange={(e) => {
                            const copy = [...labour]; copy[idx].rate = Number(e.target.value); setLabour(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                          ${(item.hours * item.rate).toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => setLabour(labour.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setLabour([...labour, { desc: 'Technician Labor', hours: 4, rate: 90 }])}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={14} /> Add Labour
                  </button>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: '#888' }}>Subtotal Labour:</span>
                    <span style={{ fontWeight: 600, color: PRIMARY, marginLeft: 8 }}>${labourSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Equipment */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={Wrench} label="Equipment & Other" />
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 16 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e2e2' }}>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>Equipment Description</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 90 }}>Qty/Hrs</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 140 }}>Rate</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 120 }}>Total</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 0' }}>
                          <input type="text" style={inputStyle} value={item.desc} onChange={(e) => {
                            const copy = [...equipment]; copy[idx].desc = e.target.value; setEquipment(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.qtyHrs} onChange={(e) => {
                            const copy = [...equipment]; copy[idx].qtyHrs = Number(e.target.value); setEquipment(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.rate} onChange={(e) => {
                            const copy = [...equipment]; copy[idx].rate = Number(e.target.value); setEquipment(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                          ${(item.qtyHrs * item.rate).toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => setEquipment(equipment.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setEquipment([...equipment, { desc: 'Consumables', qtyHrs: 1, rate: 50 }])}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={14} /> Add Equipment
                  </button>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: '#888' }}>Subtotal Equipment:</span>
                    <span style={{ fontWeight: 600, color: PRIMARY, marginLeft: 8 }}>${equipmentSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Charges */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={PlusCircle} label="Additional Charges" />
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 16 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e2e2' }}>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>Charge Description</th>
                      <th style={{ padding: '8px', fontWeight: 600, color: '#1a1a1a', textAlign: 'right', width: 140 }}>Amount</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalCharges.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 0' }}>
                          <input type="text" style={inputStyle} value={item.desc} onChange={(e) => {
                            const copy = [...additionalCharges]; copy[idx].desc = e.target.value; setAdditionalCharges(copy);
                          }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input type="number" style={{ ...inputStyle, textAlign: 'right' }} value={item.amount} onChange={(e) => {
                            const copy = [...additionalCharges]; copy[idx].amount = Number(e.target.value); setAdditionalCharges(copy);
                          }} />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => setAdditionalCharges(additionalCharges.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setAdditionalCharges([...additionalCharges, { desc: 'Other Charge', amount: 50 }])}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={14} /> Add Charge
                  </button>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: '#888' }}>Subtotal Additional:</span>
                    <span style={{ fontWeight: 600, color: PRIMARY, marginLeft: 8 }}>${additionalSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Discount & Tax */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Discount Type</FieldLabel>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)} style={inputStyle}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat Rate ($)</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Discount Value</FieldLabel>
                  <input type="number" style={inputStyle} value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Tax Rate (%)</FieldLabel>
                  <input type="number" style={inputStyle} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} />
                </div>
                <div>
                  <FieldLabel>Currency</FieldLabel>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
                    <option value="AUD – Australian Dollar (A$)">AUD – Australian Dollar (A$)</option>
                    <option value="USD – United States Dollar ($)">USD – United States Dollar ($)</option>
                  </select>
                </div>
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
                <button onClick={() => setStep(1)} style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ArrowLeft size={15} strokeWidth={2.4} /> Back to Scope &amp; Items
                </button>
                <button onClick={() => setStep(3)} style={{ borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Continue to Terms &amp; Notes <ArrowRight size={15} strokeWidth={2.4} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: Terms & Notes */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Terms & Conditions */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={Shield} label="Terms & Conditions" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {terms.map((term, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{idx + 1}.</span>
                      <input type="text" style={inputStyle} value={term} onChange={(e) => {
                        const copy = [...terms]; copy[idx] = e.target.value; setTerms(copy);
                      }} />
                      <button onClick={() => setTerms(terms.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setTerms([...terms, 'New payment or delivery condition.'])}
                  style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Plus size={14} /> Add Condition
                </button>
              </div>

              {/* Notes & Recommendations */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={FileText} label="Notes & Recommendations" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <FieldLabel>Internal Notes (Not visible to customer)</FieldLabel>
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={internalNotes} onChange={e => setInternalNotes(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Customer Notes (Printed on Quotation)</FieldLabel>
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Validity & Bank toggles */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Quote Validity (Days)</FieldLabel>
                  <input type="number" style={inputStyle} value={validityDays} onChange={e => setValidityDays(Number(e.target.value))} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', marginTop: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={requireSignature} onChange={e => setRequireSignature(e.target.checked)} />
                    Require customer signature for acceptance
                  </label>
                </div>
              </div>

              {/* Bank Details */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <SectionHeader icon={Landmark} label="Bank Details" />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showBankDetails} onChange={e => setShowBankDetails(e.target.checked)} />
                    Show bank details on quote
                  </label>
                </div>
                {showBankDetails && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <FieldLabel>Bank Name</FieldLabel>
                        <input type="text" style={inputStyle} value={bankName} onChange={e => setBankName(e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Account Name</FieldLabel>
                        <input type="text" style={inputStyle} value={accountName} onChange={e => setAccountName(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <FieldLabel>BSB</FieldLabel>
                        <input type="text" style={inputStyle} value={bsb} onChange={e => setBsb(e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Account Number</FieldLabel>
                        <input type="text" style={inputStyle} value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
                <button onClick={() => setStep(2)} style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ArrowLeft size={15} strokeWidth={2.4} /> Back to Pricing
                </button>
                <button onClick={() => setStep(4)} style={{ borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Continue to Review &amp; Send <ArrowRight size={15} strokeWidth={2.4} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 5: Review & Send */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Send Settings */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={Send} label="Send Quotation" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <FieldLabel required>Recipient Email</FieldLabel>
                    <input type="email" style={inputStyle} value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Subject Line</FieldLabel>
                    <input type="text" style={inputStyle} value={subjectLine} onChange={e => setSubjectLine(e.target.value)} />
                  </div>
                  <div>
                    <FieldLabel>Message Body</FieldLabel>
                    <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={messageBody} onChange={e => setMessageBody(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                      <input type="checkbox" checked={sendCopyToMe} onChange={e => setSendCopyToMe(e.target.checked)} />
                      Send a copy of this quote to my email ({email})
                    </label>
                  </div>
                </div>
              </div>

              {/* Scope Summary Review */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={ListChecks} label="Scope Summary Review" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {scopeOfWork.filter(item => item.checked).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <Check size={14} style={{ color: '#22c55e' }} strokeWidth={3} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Subtotal review */}
              <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 20, backgroundColor: '#fff' }}>
                <SectionHeader icon={FileText} label="Grand Total Summary" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>GST (10%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, borderTop: '1px solid #e2e2e2', paddingTop: 8 }}>
                    <span>Grand Total:</span>
                    <span style={{ color: PRIMARY }}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
                <button onClick={() => setStep(3)} style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ArrowLeft size={15} strokeWidth={2.4} /> Back to Terms &amp; Notes
                </button>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Printer size={15} strokeWidth={2.4} /> Generate PDF
                  </button>
                  <button onClick={() => handleSave('Draft')} style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 500, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer' }}>
                    Save as Draft
                  </button>
                  <button onClick={() => handleSave('Sent Email')} style={{ borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#fff', backgroundColor: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Send size={15} strokeWidth={2.4} /> Send Quotation
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Dynamic Sidebar Summary */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 16, backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <FileText size={14} style={{ color: PRIMARY }} strokeWidth={2.5} />
              <span style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                Quote Summary
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Materials:</span>
                <span style={{ fontWeight: 500 }}>${materialsSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Labour:</span>
                <span style={{ fontWeight: 500 }}>${labourSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Equipment:</span>
                <span style={{ fontWeight: 500 }}>${equipmentSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Additional:</span>
                <span style={{ fontWeight: 500 }}>${additionalSubtotal.toFixed(2)}</span>
              </div>
              
              <div style={{ height: 1, backgroundColor: '#e2e2e2', margin: '4px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountValue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4d' }}>
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>GST ({taxRate}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: 12, borderRadius: 8, backgroundColor: '#1a1a1a', textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em', color: '#fff', marginBottom: 2 }}>
                Grand Total (AUD)
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: PRIMARY }}>
                ${grandTotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Internal notes sidebar review */}
          <div style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 16, backgroundColor: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 8 }}>
              Notes (Internal)
            </div>
            <div style={{ border: '1px solid #e2e2e2', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#666', minHeight: 64, backgroundColor: '#f9f9f9', whiteSpace: 'pre-line' }}>
              {internalNotes || 'No internal notes added.'}
            </div>
          </div>
        </div>

      </div>

      {/* Printable PDF Template (Invisible on screen, only visible on print media) */}
      <QuotePDFPreview quoteData={printableQuoteData} equipmentSubtotalOverride={equipmentSubtotal} className="print-only" />

    </div>
  );
}
