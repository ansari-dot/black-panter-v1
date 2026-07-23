import React from 'react';
import { Trash, PlusCircle, Check } from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

interface InlineInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const PRIMARY = '#F15A24';
const DARK = '#161616';

const InlineInput: React.FC<InlineInputProps> = ({ value, onChange, placeholder, style }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        border: '1px dashed transparent',
        background: 'transparent',
        padding: '1px 4px',
        borderRadius: 4,
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: 'inherit',
        width: '100%',
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'all 0.15s ease',
        ...style
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = PRIMARY; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
      onFocus={(e) => {
        e.currentTarget.style.borderStyle = 'solid';
        e.currentTarget.style.borderColor = PRIMARY;
        e.currentTarget.style.backgroundColor = '#fff';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderStyle = 'dashed';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    />
  );
};

const InlineTextarea: React.FC<InlineInputProps> = ({ value, onChange, placeholder, style }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      style={{
        border: '1px dashed transparent',
        background: 'transparent',
        padding: '1px 4px',
        borderRadius: 4,
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: 'inherit',
        width: '100%',
        fontFamily: 'inherit',
        outline: 'none',
        resize: 'none',
        lineHeight: 'inherit',
        transition: 'all 0.15s ease',
        overflow: 'hidden',
        ...style
      }}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = PRIMARY; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
      onFocus={(e) => {
        e.currentTarget.style.borderStyle = 'solid';
        e.currentTarget.style.borderColor = PRIMARY;
        e.currentTarget.style.backgroundColor = '#fff';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderStyle = 'dashed';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    />
  );
};

interface TableRow {
  desc: string;
  partNo: string;
  qty: number;
  unit: string;
  price: number;
}

interface LabourRow {
  desc: string;
  hours: number;
  rate: number;
}

interface ChecklistItem {
  name: string;
  checked: boolean;
}

export interface QuoteDataState {
  quoteNo: string;
  quoteDate: string;
  expiryDate: string;
  preparedBy: string;
  salesRep: string;
  projectName: string;
  customerRef: string;
  client: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    siteAddress: string;
    billingAddress: string;
    abn: string;
  };
  battery: {
    batteryType: string;
    manufacturer: string;
    model: string;
    voltage: string;
    capacity: string;
    cells: string;
    banks: string;
    installYear: string;
    location: string;
  };
  serviceCategory: string;
  scopeOfWork: ChecklistItem[];
  materials: TableRow[];
  labour: LabourRow[];
  equipment: ChecklistItem[];
  additionalCharges: { desc: string; amount: number }[];
  terms: string[];
  notes: string[];
  signature: {
    preparedByName: string;
    preparedByPos: string;
    preparedByDate: string;
  };
}

interface QuotePDFPreviewProps {
  quoteData: QuoteDataState;
  setQuoteData?: React.Dispatch<React.SetStateAction<QuoteDataState>> | ((prev: any) => void);
  equipmentSubtotalOverride?: number;
  className?: string;
}

export const QuotePDFPreview: React.FC<QuotePDFPreviewProps> = ({
  quoteData,
  setQuoteData,
  equipmentSubtotalOverride,
  className = "page"
}) => {
  const isReadOnly = !setQuoteData;

  const updateQuoteField = (field: keyof QuoteDataState, val: any) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({ ...prev, [field]: val }));
    }
  };

  const updateClientField = (field: keyof QuoteDataState['client'], val: string) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({ ...prev, client: { ...prev.client, [field]: val } }));
    }
  };

  const updateBatteryField = (field: keyof QuoteDataState['battery'], val: string) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({ ...prev, battery: { ...prev.battery, [field]: val } }));
    }
  };

  // Scope handlers
  const handleScopeCheck = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const scopeOfWork = [...prev.scopeOfWork];
        scopeOfWork[index].checked = !scopeOfWork[index].checked;
        return { ...prev, scopeOfWork };
      });
    }
  };

  const handleScopeTextChange = (index: number, val: string) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const scopeOfWork = [...prev.scopeOfWork];
        scopeOfWork[index].name = val;
        return { ...prev, scopeOfWork };
      });
    }
  };

  const addScopeItem = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        scopeOfWork: [...prev.scopeOfWork, { name: 'New Scope Item', checked: true }]
      }));
    }
  };

  const removeScopeItem = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        scopeOfWork: prev.scopeOfWork.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Materials handlers
  const handleMaterialChange = (index: number, field: keyof TableRow, val: any) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const materials = [...prev.materials];
        materials[index] = { ...materials[index], [field]: val };
        return { ...prev, materials };
      });
    }
  };

  const addMaterialRow = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        materials: [...prev.materials, { desc: 'New Product Item', partNo: 'PART-001', qty: 1, unit: 'PCS', price: 0 }]
      }));
    }
  };

  const removeMaterialRow = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        materials: prev.materials.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Labour handlers
  const handleLabourChange = (index: number, field: keyof LabourRow, val: any) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const labour = [...prev.labour];
        labour[index] = { ...labour[index], [field]: val };
        return { ...prev, labour };
      });
    }
  };

  const addLabourRow = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        labour: [...prev.labour, { desc: 'Technician Role', hours: 8, rate: 100 }]
      }));
    }
  };

  const removeLabourRow = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        labour: prev.labour.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Equipment handlers
  const handleEquipmentCheck = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const equipment = [...prev.equipment];
        equipment[index].checked = !equipment[index].checked;
        return { ...prev, equipment };
      });
    }
  };

  const handleEquipmentTextChange = (index: number, val: string) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const equipment = [...prev.equipment];
        equipment[index].name = val;
        return { ...prev, equipment };
      });
    }
  };

  const addEquipmentItem = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        equipment: [...prev.equipment, { name: 'New Equipment', checked: true }]
      }));
    }
  };

  const removeEquipmentItem = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        equipment: prev.equipment.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Additional Charges handlers
  const handleChargeChange = (index: number, field: 'desc' | 'amount', val: any) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const additionalCharges = [...prev.additionalCharges];
        additionalCharges[index] = { ...additionalCharges[index], [field]: val };
        return { ...prev, additionalCharges };
      });
    }
  };

  const addChargeRow = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        additionalCharges: [...prev.additionalCharges, { desc: 'Other Charge', amount: 0 }]
      }));
    }
  };

  const removeChargeRow = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        additionalCharges: prev.additionalCharges.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Terms handlers
  const handleTermChange = (index: number, val: string) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const terms = [...prev.terms];
        terms[index] = val;
        return { ...prev, terms };
      });
    }
  };

  const addTerm = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        terms: [...prev.terms, 'New term/condition description.']
      }));
    }
  };

  const removeTerm = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        terms: prev.terms.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Notes handlers
  const handleNoteChange = (index: number, val: string) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => {
        const notes = [...prev.notes];
        notes[index] = val;
        return { ...prev, notes };
      });
    }
  };

  const addNote = () => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        notes: [...prev.notes, 'New note/recommendation details.']
      }));
    }
  };

  const removeNote = (index: number) => {
    if (setQuoteData) {
      setQuoteData((prev: any) => ({
        ...prev,
        notes: prev.notes.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  // Calculations
  const materialsSubtotal = (quoteData.materials || []).reduce((sum, row) => sum + (row.qty * row.price), 0);
  const labourSubtotal = (quoteData.labour || []).reduce((sum, row) => sum + (row.hours * row.rate), 0);
  const equipmentSubtotal = typeof equipmentSubtotalOverride === 'number' ? equipmentSubtotalOverride : 250;
  const additionalChargesSubtotal = (quoteData.additionalCharges || []).reduce((sum, row) => sum + row.amount, 0);

  const subtotal = materialsSubtotal + labourSubtotal + equipmentSubtotal + additionalChargesSubtotal;
  const gst = subtotal * 0.10;
  const grandTotal = subtotal + gst;

  // Read only render wrappers
  const renderInput = (value: string, onChangeHandler: (v: string) => void, style?: React.CSSProperties) => {
    if (isReadOnly) {
      return <span style={{ fontWeight: style?.fontWeight || 'inherit', color: style?.color || 'inherit' }}>{value}</span>;
    }
    return <InlineInput value={value} onChange={onChangeHandler} style={style} />;
  };

  const renderTextarea = (value: string, onChangeHandler: (v: string) => void) => {
    if (isReadOnly) {
      return <span>{value}</span>;
    }
    return <InlineTextarea value={value} onChange={onChangeHandler} />;
  };

  return (
    <div id="quote-printable-area" className={className}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        #quote-printable-area {
          --orange: #F15A24;
          --black: #161616;
          --border: #e2e2e2;
          --text: #1a1a1a;
          --muted: #555;
          --light-grey: #f2f2f2;
          --body-bg: #f4f4f4;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          background: #fff;
          font-family: 'Montserrat', 'Inter', Arial, sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          box-shadow: 0 4px 30px rgba(0,0,0,0.06);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        #quote-printable-area * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        #quote-printable-area .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        #quote-printable-area .icon svg {
          width: 100%;
          height: 100%;
        }

        #quote-printable-area .header {
          position: relative;
          display: flex;
          width: 100%;
          min-height: 140px;
        }

        #quote-printable-area .header-left {
          width: 42%;
          background: #fff;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 30px;
        }

        #quote-printable-area .logo-img {
          width: 80px;
          max-width: 110px;
          min-width: 60px;
          height: auto;
          object-fit: contain;
          flex: none;
        }

        #quote-printable-area .brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: var(--black);
          line-height: 1.15;
        }

        #quote-printable-area .brand-tagline {
          color: var(--orange);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
          margin-top: 6px;
        }

        #quote-printable-area .header-right {
          width: 58%;
          background: var(--black);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px 20px 30px;
          clip-path: polygon(6% 0, 100% 0, 100% 100%, 0% 100%);
        }

        #quote-printable-area .quote-title {
          color: #fff;
        }

        #quote-printable-area .quote-title h1 {
          font-size: 32px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        #quote-printable-area .quote-title .qnum {
          color: var(--orange);
          font-size: 12px;
          font-weight: 700;
          margin-top: 4px;
          letter-spacing: 1px;
        }

        #quote-printable-area .header-contact-wrapper {
          border-left: 2px solid var(--orange);
          padding-left: 20px;
          margin-left: 15px;
        }

        #quote-printable-area .header-contact {
          color: #fff;
          font-size: 11px;
          line-height: 1.6;
        }

        #quote-printable-area .header-contact div {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 6px;
        }

        #quote-printable-area .header-contact div:last-child {
          margin-bottom: 0;
        }

        #quote-printable-area .header-contact .icon {
          color: var(--orange);
          width: 14px;
          height: 14px;
          margin-top: 2px;
        }

        #quote-printable-area .infobar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: #fff;
        }

        #quote-printable-area .infobar .item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          justify-content: center;
          padding: 0 10px;
        }

        #quote-printable-area .infobar .item:not(:last-child) {
          border-right: 1px solid var(--border);
        }

        #quote-printable-area .infobar .icon {
          width: 20px;
          height: 20px;
          color: var(--orange);
          flex: none;
        }

        #quote-printable-area .infobar .label {
          color: var(--muted);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        #quote-printable-area .infobar .value {
          font-weight: 700;
          font-size: 12px;
          color: var(--black);
        }

        #quote-printable-area .section {
          padding: 20px 30px;
        }

        #quote-printable-area .two-col {
          display: flex;
          gap: 24px;
        }

        #quote-printable-area .box {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: #fff;
        }

        #quote-printable-area .box-header {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          padding: 18px 20px 8px 20px;
        }

        #quote-printable-area .box-header .circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        #quote-printable-area .box-header .circle .icon {
          width: 14px;
          height: 14px;
          color: #fff;
        }

        #quote-printable-area .box-header h3 {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--orange);
          letter-spacing: 0.5px;
        }

        #quote-printable-area .box-body {
          padding: 10px 20px 20px 20px;
        }

        #quote-printable-area .kv {
          display: flex;
          font-size: 12.5px;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        #quote-printable-area .kv:last-child {
          margin-bottom: 0;
        }

        #quote-printable-area .kv .k {
          width: 155px;
          color: var(--text);
          font-weight: 700;
          flex: none;
        }

        #quote-printable-area .kv .c {
          width: 15px;
          flex: none;
          color: var(--muted);
        }

        #quote-printable-area .kv .v {
          color: #000;
          font-weight: 500;
          width: 100%;
        }

        #quote-printable-area .service-row {
          display: flex;
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
        }

        #quote-printable-area .service-left {
          width: 25%;
          padding: 20px;
          border-right: 1px solid var(--border);
        }

        #quote-printable-area .service-left .circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        #quote-printable-area .service-left .circle .icon {
          width: 14px;
          height: 14px;
          color: #fff;
        }

        #quote-printable-area .service-left h3 {
          color: var(--orange);
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        #quote-printable-area .service-left p {
          font-size: 13px;
          font-weight: 700;
          color: var(--black);
        }

        #quote-printable-area .service-right {
          flex: 1;
          padding: 20px;
        }

        #quote-printable-area .service-right h4 {
          color: var(--orange);
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 14px;
          letter-spacing: 0.5px;
        }

        #quote-printable-area .scope-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px 20px;
        }

        #quote-printable-area .scope-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
        }

        #quote-printable-area .scope-item .chk {
          width: 16px;
          height: 16px;
          background: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          flex: none;
        }

        #quote-printable-area .scope-item .chk .icon {
          width: 10px;
          height: 10px;
          color: #fff;
        }

        #quote-printable-area .table-title {
          color: var(--orange);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        #quote-printable-area table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }

        #quote-printable-area thead tr {
          background: var(--black);
          color: #fff;
        }

        #quote-printable-area th {
          text-align: center;
          padding: 10px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border: 1px solid #333;
        }

        #quote-printable-area th:nth-child(2) {
          text-align: left;
        }

        #quote-printable-area td {
          padding: 9px 12px;
          border: 1px solid var(--border);
          color: var(--text);
          font-weight: 500;
        }

        #quote-printable-area td.num {
          text-align: right;
          font-weight: 500;
        }

        #quote-printable-area td.center {
          text-align: center;
        }

        #quote-printable-area .subtotal-row td {
          font-weight: 800;
          border: 1px solid var(--border);
        }

        #quote-printable-area .subtotal-row td:first-child {
          border: none;
          background: transparent;
        }

        #quote-printable-area .subtotal-row .stlabel {
          color: #000;
          text-align: right;
        }

        #quote-printable-area .subtotal-row .stval {
          color: var(--orange);
          text-align: right;
        }

        #quote-printable-area .labour-summary {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        #quote-printable-area .labour-col {
          flex: 1.4;
        }

        #quote-printable-area .summary-col {
          flex: 1;
        }

        #quote-printable-area .price-summary-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid var(--border);
          background: #fff;
        }

        #quote-printable-area .price-summary-table th {
          background: var(--black);
          color: #fff;
          padding: 11px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-align: center;
          border: 1px solid var(--black);
        }

        #quote-printable-area .price-summary-table td {
          padding: 9px 15px;
          border: 1px solid var(--border);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text);
        }

        #quote-printable-area .price-summary-table td.num {
          text-align: right;
          font-weight: 500;
        }

        #quote-printable-area .price-summary-table tr.bold td {
          font-weight: 800;
          color: #000;
        }

        #quote-printable-area .price-summary-table tr.grand-total td {
          background: var(--orange);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          border: 1px solid var(--orange);
        }

        #quote-printable-area .price-summary-table tr.grand-total td.num {
          text-align: right;
        }

        #quote-printable-area .equip-charges {
          display: flex;
          gap: 24px;
        }

        #quote-printable-area .equip-box, #quote-printable-area .charges-box {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 18px;
          background: #fff;
        }

        #quote-printable-area .equip-box h4, #quote-printable-area .charges-box h4 {
          color: var(--orange);
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        #quote-printable-area .equip-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 12px;
        }

        #quote-printable-area .equip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
        }

        #quote-printable-area .equip-item .box-chk {
          width: 15px;
          height: 15px;
          border: 1.5px solid #333;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }

        #quote-printable-area .equip-item .box-chk .icon {
          width: 10px;
          height: 10px;
          color: #161616;
        }

        #quote-printable-area .charges-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid var(--border);
        }

        #quote-printable-area .charges-table td {
          padding: 8px 12px;
          border: 1px solid var(--border);
          font-size: 12px;
          color: var(--text);
        }

        #quote-printable-area .charges-table td:first-child {
          font-weight: 600;
        }

        #quote-printable-area .charges-table td.num {
          text-align: right;
          width: 35%;
          font-weight: 500;
        }

        #quote-printable-area .terms-notes {
          display: flex;
          gap: 24px;
        }

        #quote-printable-area .terms-box, #quote-printable-area .notes-box {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 18px;
          background: #fff;
        }

        #quote-printable-area .terms-box h4, #quote-printable-area .notes-box h4 {
          color: var(--orange);
          font-size: 13.5px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        #quote-printable-area .terms-box ul, #quote-printable-area .notes-box ul {
          padding-left: 18px;
          font-size: 11.5px;
          line-height: 1.7;
          color: #333;
        }

        #quote-printable-area .terms-box li, #quote-printable-area .notes-box li {
          margin-bottom: 6px;
        }

        #quote-printable-area .sign-row {
          display: flex;
          gap: 24px;
        }

        #quote-printable-area .sign-box {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 18px;
          background: #fff;
        }

        #quote-printable-area .sign-box h4 {
          font-size: 12.5px;
          font-weight: 800;
          margin-bottom: 15px;
          letter-spacing: 0.5px;
          color: var(--black);
        }

        #quote-printable-area .sign-line {
          display: flex;
          align-items: flex-end;
          margin-bottom: 12px;
          font-size: 12px;
        }

        #quote-printable-area .sign-line:last-child {
          margin-bottom: 0;
        }

        #quote-printable-area .sign-line .sk {
          width: 75px;
          color: var(--muted);
          font-weight: 700;
          flex: none;
        }

        #quote-printable-area .sign-line .sc {
          width: 12px;
          color: var(--muted);
          flex: none;
        }

        #quote-printable-area .sign-line .sv {
          flex: 1;
          border-bottom: 1px solid #ccc;
          min-height: 18px;
          padding-bottom: 2px;
          color: #000;
          font-weight: 600;
        }

        #quote-printable-area .footer {
          display: flex;
          background: #fff;
          width: 100%;
          overflow: hidden;
          align-items: stretch;
          gap: 0;
        }

        #quote-printable-area .footer-left {
          background: var(--black);
          color: #fff;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 60px 20px 30px;
          clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
          flex: 1.2;
          min-width: 0;
        }

        #quote-printable-area .logo-img-footer {
          width: 56px;
          height: 56px;
          object-fit: contain;
          flex: none;
          display: block;
        }

        #quote-printable-area .footer-left .ft-title {
          color: var(--orange);
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        #quote-printable-area .footer-left .ft-sub {
          color: #bbb;
          font-size: 11px;
          font-weight: 500;
        }

        #quote-printable-area .footer-right {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex: 1;
          background: var(--light-grey);
          padding: 20px 30px 20px 60px;
          clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%);
          margin-left: -20px;
        }

        #quote-printable-area .footer-right span {
          font-size: 11px;
          font-weight: 800;
          color: var(--black);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        #quote-printable-area .footer-right span:not(:last-child) {
          border-right: 1px solid #ccc;
          padding-right: 20px;
        }

        #quote-printable-area .footer-right .icon {
          width: 15px;
          height: 15px;
          color: var(--black);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        @media screen and (max-width: 900px) {
          #quote-printable-area .header {
            flex-direction: column;
            min-height: auto;
          }
          #quote-printable-area .header-left, #quote-printable-area .header-right {
            width: 100%;
            clip-path: none;
          }
          #quote-printable-area .header-right {
            padding: 20px;
          }
          #quote-printable-area .header-left {
            padding: 20px;
          }
          #quote-printable-area .header-contact-wrapper {
            margin-left: 0;
            margin-top: 15px;
            border-left: none;
            padding-left: 0;
          }
          #quote-printable-area .infobar {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          #quote-printable-area .infobar .item {
            border-right: none !important;
            width: 100%;
            justify-content: flex-start;
            padding: 0;
          }
          #quote-printable-area .two-col, #quote-printable-area .service-row, #quote-printable-area .equip-charges, #quote-printable-area .terms-notes, #quote-printable-area .sign-row, #quote-printable-area .labour-summary {
            flex-direction: column;
          }
          #quote-printable-area .service-left {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          #quote-printable-area .scope-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          #quote-printable-area .footer {
            flex-direction: column;
          }
          #quote-printable-area .footer-left {
            width: 100%;
            clip-path: none;
            padding: 20px;
          }
          #quote-printable-area .footer-right {
            width: 100%;
            padding: 20px;
            clip-path: none;
            margin-left: 0;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
          }
          #quote-printable-area .footer-right span {
            border-right: none !important;
            padding-right: 0 !important;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #quote-printable-area, #quote-printable-area * {
            visibility: visible;
          }
          #quote-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }

        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}} />

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <img className="logo-img" src={logoImg} alt="Black Panther Batteries Logo" />
          <div>
            <div className="brand-name">BLACK PANTHER<br />BATTERIES</div>
            <div className="brand-tagline">POWER UNLEASHED</div>
          </div>
        </div>
        <div className="header-right">
          <div className="quote-title">
            <h1>QUOTE</h1>
            <div className="qnum" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              # {renderInput(quoteData.quoteNo, (val) => updateQuoteField('quoteNo', val), { color: 'var(--orange)', fontWeight: 700, width: '150px' })}
            </div>
          </div>
          <div className="header-contact-wrapper">
            <div className="header-contact">
              <div>
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span>Unit 7, 12-14 Nova Place<br />Penrith NSW 2750, Australia</span>
              </div>
              <div>
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <span>1300 000 000</span>
              </div>
              <div>
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <span>info@blackpanther-batteries.com</span>
              </div>
              <div>
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                <span>www.blackpanther-batteries.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="infobar">
        <div className="item">
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
          <div>
            <div className="label">QUOTE DATE</div>
            <div className="value">
              {renderInput(quoteData.quoteDate, (val) => updateQuoteField('quoteDate', val), { fontWeight: 700 })}
            </div>
          </div>
        </div>
        <div className="item">
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </span>
          <div>
            <div className="label">EXPIRY DATE</div>
            <div className="value">
              {renderInput(quoteData.expiryDate, (val) => updateQuoteField('expiryDate', val), { fontWeight: 700 })}
            </div>
          </div>
        </div>
        <div className="item">
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <div>
            <div className="label">PREPARED BY</div>
            <div className="value">
              {renderInput(quoteData.preparedBy, (val) => updateQuoteField('preparedBy', val), { fontWeight: 700 })}
            </div>
          </div>
        </div>
        <div className="item">
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <div>
            <div className="label">SALES REPRESENTATIVE</div>
            <div className="value">
              {renderInput(quoteData.salesRep, (val) => updateQuoteField('salesRep', val), { fontWeight: 700 })}
            </div>
          </div>
        </div>
        <div className="item">
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </span>
          <div>
            <div className="label">PROJECT NAME</div>
            <div className="value">
              {renderInput(quoteData.projectName, (val) => updateQuoteField('projectName', val), { fontWeight: 700 })}
            </div>
          </div>
        </div>
        <div className="item">
          <span className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
          </span>
          <div>
            <div className="label">CUSTOMER REF.</div>
            <div className="value">
              {renderInput(quoteData.customerRef, (val) => updateQuoteField('customerRef', val), { fontWeight: 700 })}
            </div>
          </div>
        </div>
      </div>

      {/* CLIENT + BATTERY INFO */}
      <div className="section">
        <div className="two-col">
          <div className="box">
            <div className="box-header">
              <div className="circle">
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
              </div>
              <h3>CLIENT DETAILS</h3>
            </div>
            <div className="box-body">
              <div className="kv">
                <div className="k">Company Name</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.companyName, (val) => updateClientField('companyName', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Contact Person</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.contactPerson, (val) => updateClientField('contactPerson', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Email</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.email, (val) => updateClientField('email', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Phone</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.phone, (val) => updateClientField('phone', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Site Address</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.siteAddress, (val) => updateClientField('siteAddress', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Billing Address</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.billingAddress, (val) => updateClientField('billingAddress', val))}</div>
              </div>
              <div className="kv">
                <div className="k">ABN</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.client.abn, (val) => updateClientField('abn', val))}</div>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="box-header">
              <div className="circle">
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="11" x2="23" y2="13"/></svg>
                </span>
              </div>
              <h3>BATTERY INFORMATION</h3>
            </div>
            <div className="box-body">
              <div className="kv">
                <div className="k">Battery Type</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.batteryType, (val) => updateBatteryField('batteryType', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Manufacturer</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.manufacturer, (val) => updateBatteryField('manufacturer', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Model</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.model, (val) => updateBatteryField('model', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Voltage</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.voltage, (val) => updateBatteryField('voltage', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Capacity (Ah)</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.capacity, (val) => updateBatteryField('capacity', val))}</div>
              </div>
              <div className="kv">
                <div className="k">No. of Cells</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.cells, (val) => updateBatteryField('cells', val))}</div>
              </div>
              <div className="kv">
                <div className="k">No. of Battery Banks</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.banks, (val) => updateBatteryField('banks', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Installation Year</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.installYear, (val) => updateBatteryField('installYear', val))}</div>
              </div>
              <div className="kv">
                <div className="k">Location</div>
                <div className="c">:</div>
                <div className="v">{renderInput(quoteData.battery.location, (val) => updateBatteryField('location', val))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE CATEGORY / SCOPE OF WORK */}
      <div className="section">
        <div className="service-row">
          <div className="service-left">
            <div className="circle">
              <span className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
            </div>
            <h3>SERVICE CATEGORY</h3>
            <p>{renderInput(quoteData.serviceCategory, (val) => updateQuoteField('serviceCategory', val), { fontWeight: 700 })}</p>
          </div>
          <div className="service-right">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h4>SCOPE OF WORK</h4>
              {!isReadOnly && (
                <button
                  onClick={addScopeItem}
                  className="no-print"
                  style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
                >
                  <PlusCircle size={13} /> Add Item
                </button>
              )}
            </div>
            <div className="scope-grid">
              {(quoteData.scopeOfWork || []).map((item, index) => (
                <div key={index} className="scope-item group" style={{ position: 'relative' }}>
                  <div
                    onClick={() => handleScopeCheck(index)}
                    className="chk"
                    style={{
                      cursor: !isReadOnly ? 'pointer' : 'default',
                      backgroundColor: item.checked ? 'var(--orange)' : 'transparent',
                      border: item.checked ? 'none' : '1px solid #ccc'
                    }}
                  >
                    {item.checked && (
                      <span className="icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {renderInput(
                    item.name,
                    (val) => handleScopeTextChange(index, val),
                    {
                      color: item.checked ? 'var(--text)' : '#aaa',
                      textDecoration: item.checked ? 'none' : 'line-through'
                    }
                  )}
                  {!isReadOnly && (
                    <button
                      onClick={() => removeScopeItem(index)}
                      className="no-print"
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#ff4d4d',
                        cursor: 'pointer',
                        position: 'absolute',
                        right: -4,
                        top: 2,
                        display: 'none',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.display = 'block'; }}
                      ref={(el) => {
                        if (el && el.parentElement) {
                          el.parentElement.onmouseenter = () => { el.style.display = 'block'; };
                          el.parentElement.onmouseleave = () => { el.style.display = 'none'; };
                        }
                      }}
                    >
                      <Trash size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MATERIALS & PRODUCTS */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="table-title">MATERIALS &amp; PRODUCTS</div>
          {!isReadOnly && (
            <button
              onClick={addMaterialRow}
              className="no-print"
              style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
            >
              <PlusCircle size={13} /> Add Row
            </button>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th>DESCRIPTION</th>
              <th style={{ width: '15%' }}>PART NUMBER</th>
              <th style={{ width: '8%' }}>QTY</th>
              <th style={{ width: '8%' }}>UNIT</th>
              <th style={{ width: '15%', textAlign: 'right' }}>UNIT PRICE (AUD)</th>
              <th style={{ width: '15%', textAlign: 'right' }}>TOTAL (AUD)</th>
              {!isReadOnly && <th style={{ width: '3%' }} className="no-print"></th>}
            </tr>
          </thead>
          <tbody>
            {(quoteData.materials || []).map((row, index) => (
              <tr key={index}>
                <td className="center">{index + 1}</td>
                <td>
                  {renderInput(row.desc, (val) => handleMaterialChange(index, 'desc', val))}
                </td>
                <td className="center">
                  {renderInput(row.partNo, (val) => handleMaterialChange(index, 'partNo', val), { textAlign: 'center' })}
                </td>
                <td className="center">
                  {isReadOnly ? (
                    <span>{row.qty}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.qty}
                      onChange={(e) => handleMaterialChange(index, 'qty', parseInt(e.target.value) || 0)}
                      style={{ width: '100%', textAlign: 'center', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit' }}
                    />
                  )}
                </td>
                <td className="center">
                  {renderInput(row.unit, (val) => handleMaterialChange(index, 'unit', val), { textAlign: 'center' })}
                </td>
                <td className="num">
                  {isReadOnly ? (
                    <span>${row.price.toFixed(2)}</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <span>$</span>
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) => handleMaterialChange(index, 'price', parseFloat(e.target.value) || 0)}
                        style={{ width: '80px', textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit' }}
                      />
                    </div>
                  )}
                </td>
                <td className="num">${(row.qty * row.price).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                {!isReadOnly && (
                  <td className="no-print" style={{ textAlign: 'center' }}>
                    <button onClick={() => removeMaterialRow(index)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                      <Trash size={12} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            <tr className="subtotal-row">
              <td colSpan={5}></td>
              <td className="stlabel">Subtotal Materials</td>
              <td className="stval">${materialsSubtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              {!isReadOnly && <td className="no-print"></td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* LABOUR + PRICE SUMMARY */}
      <div className="section">
        <div className="labour-summary">
          <div className="labour-col">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="table-title">LABOUR</div>
              {!isReadOnly && (
                <button
                  onClick={addLabourRow}
                  className="no-print"
                  style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
                >
                  <PlusCircle size={13} /> Add Row
                </button>
              )}
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>#</th>
                  <th style={{ textAlign: 'left' }}>DESCRIPTION</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>HOURS</th>
                  <th style={{ width: '25%', textAlign: 'right' }}>RATE (AUD)</th>
                  {!isReadOnly && <th style={{ width: '3%' }} className="no-print"></th>}
                </tr>
              </thead>
              <tbody>
                {(quoteData.labour || []).map((row, index) => (
                  <tr key={index}>
                    <td className="center">{index + 1}</td>
                    <td>
                      {renderInput(row.desc, (val) => handleLabourChange(index, 'desc', val))}
                    </td>
                    <td className="num">
                      {isReadOnly ? (
                        <span>{row.hours}</span>
                      ) : (
                        <input
                          type="number"
                          value={row.hours}
                          onChange={(e) => handleLabourChange(index, 'hours', parseFloat(e.target.value) || 0)}
                          style={{ width: '100%', textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit' }}
                        />
                      )}
                    </td>
                    <td className="num">
                      {isReadOnly ? (
                        <span>${row.rate.toFixed(2)}</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <span>$</span>
                          <input
                            type="number"
                            value={row.rate}
                            onChange={(e) => handleLabourChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            style={{ width: '70px', textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit' }}
                          />
                        </div>
                      )}
                    </td>
                    {!isReadOnly && (
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button onClick={() => removeLabourRow(index)} style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                          <Trash size={12} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                <tr className="subtotal-row">
                  <td colSpan={2}></td>
                  <td className="stlabel">Subtotal Labour</td>
                  <td className="stval">${labourSubtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  {!isReadOnly && <td className="no-print"></td>}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="summary-col">
            <table className="price-summary-table">
              <thead>
                <tr><th colSpan={2}>PRICE SUMMARY</th></tr>
              </thead>
              <tbody>
                <tr><td>Subtotal Materials</td><td className="num">${materialsSubtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                <tr><td>Subtotal Labour</td><td className="num">${labourSubtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                <tr><td>Equipment &amp; Other</td><td className="num">${equipmentSubtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                <tr><td>Additional Charges</td><td className="num">${additionalChargesSubtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                <tr className="bold"><td>Subtotal</td><td className="num">${subtotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                <tr><td>GST (10%)</td><td className="num">${gst.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
                <tr className="grand-total"><td>GRAND TOTAL (AUD)</td><td className="num">${grandTotal.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EQUIPMENT / ADDITIONAL CHARGES */}
      <div className="section">
        <div className="equip-charges">
          <div className="equip-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4>EQUIPMENT USED</h4>
              {!isReadOnly && (
                <button
                  onClick={addEquipmentItem}
                  className="no-print"
                  style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
                >
                  <PlusCircle size={13} /> Add Item
                </button>
              )}
            </div>
            <div className="equip-grid">
              {(quoteData.equipment || []).map((item, index) => (
                <div key={index} className="equip-item group" style={{ position: 'relative' }}>
                  <div
                    onClick={() => handleEquipmentCheck(index)}
                    className="box-chk"
                    style={{
                      cursor: !isReadOnly ? 'pointer' : 'default',
                      backgroundColor: item.checked ? 'var(--orange)' : 'transparent',
                      border: item.checked ? 'none' : '1.5px solid #333'
                    }}
                  >
                    {item.checked && (
                      <span className="icon" style={{ width: '10px', height: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {renderInput(item.name, (val) => handleEquipmentTextChange(index, val), { color: item.checked ? 'var(--text)' : '#aaa' })}
                  {!isReadOnly && (
                    <button
                      onClick={() => removeEquipmentItem(index)}
                      className="no-print"
                      style={{
                        border: 'none',
                        background: 'none',
                        color: '#ff4d4d',
                        cursor: 'pointer',
                        position: 'absolute',
                        right: -4,
                        top: 1,
                        display: 'none',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.display = 'block'; }}
                      ref={(el) => {
                        if (el && el.parentElement) {
                          el.parentElement.onmouseenter = () => { el.style.display = 'block'; };
                          el.parentElement.onmouseleave = () => { el.style.display = 'none'; };
                        }
                      }}
                    >
                      <Trash size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="charges-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4>ADDITIONAL CHARGES</h4>
              {!isReadOnly && (
                <button
                  onClick={addChargeRow}
                  className="no-print"
                  style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
                >
                  <PlusCircle size={13} /> Add Row
                </button>
              )}
            </div>
            <table className="charges-table">
              <tbody>
                {(quoteData.additionalCharges || []).map((row, index) => (
                  <tr key={index}>
                    <td>
                      {renderInput(row.desc, (val) => handleChargeChange(index, 'desc', val))}
                    </td>
                    <td className="num">
                      {isReadOnly ? (
                        <span>${row.amount.toFixed(2)}</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <span>$</span>
                          <input
                            type="number"
                            value={row.amount}
                            onChange={(e) => handleChargeChange(index, 'amount', parseFloat(e.target.value) || 0)}
                            style={{ width: '70px', textAlign: 'right', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 'inherit' }}
                          />
                          <button onClick={() => removeChargeRow(index)} className="no-print" style={{ border: 'none', background: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0 4px' }}>
                            <Trash size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TERMS / NOTES */}
      <div className="section">
        <div className="terms-notes">
          <div className="terms-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h4>TERMS &amp; CONDITIONS</h4>
              {!isReadOnly && (
                <button
                  onClick={addTerm}
                  className="no-print"
                  style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
                >
                  <PlusCircle size={13} /> Add
                </button>
              )}
            </div>
            <ul>
              {(quoteData.terms || []).map((term, index) => (
                <li key={index} style={{ position: 'relative' }} className="group">
                  <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    {renderTextarea(term, (val) => handleTermChange(index, val))}
                    {!isReadOnly && (
                      <button
                        onClick={() => removeTerm(index)}
                        className="no-print"
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#ff4d4d',
                          cursor: 'pointer',
                          display: 'none',
                          marginLeft: 4,
                          alignSelf: 'center',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.display = 'block'; }}
                        ref={(el) => {
                          if (el && el.parentElement) {
                            el.parentElement.onmouseenter = () => { el.style.display = 'block'; };
                            el.parentElement.onmouseleave = () => { el.style.display = 'none'; };
                          }
                        }}
                      >
                        <Trash size={10} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="notes-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h4>NOTES / RECOMMENDATIONS</h4>
              {!isReadOnly && (
                <button
                  onClick={addNote}
                  className="no-print"
                  style={{ border: 'none', background: 'none', color: 'var(--orange)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}
                >
                  <PlusCircle size={13} /> Add
                </button>
              )}
            </div>
            <ul>
              {(quoteData.notes || []).map((note, index) => (
                <li key={index} style={{ position: 'relative' }} className="group">
                  <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                    {renderTextarea(note, (val) => handleNoteChange(index, val))}
                    {!isReadOnly && (
                      <button
                        onClick={() => removeNote(index)}
                        className="no-print"
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#ff4d4d',
                          cursor: 'pointer',
                          display: 'none',
                          marginLeft: 4,
                          alignSelf: 'center',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.display = 'block'; }}
                        ref={(el) => {
                          if (el && el.parentElement) {
                            el.parentElement.onmouseenter = () => { el.style.display = 'block'; };
                            el.parentElement.onmouseleave = () => { el.style.display = 'none'; };
                          }
                        }}
                      >
                        <Trash size={10} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SIGNATURES */}
      <div className="section">
        <div className="sign-row">
          <div className="sign-box">
            <h4>PREPARED BY</h4>
            <div className="sign-line">
              <div className="sk">Name</div>
              <div className="sc">:</div>
              <div className="sv">
                {renderInput(quoteData.signature.preparedByName, (val) => {
                  if (setQuoteData) {
                    setQuoteData((prev: any) => ({ ...prev, signature: { ...prev.signature, preparedByName: val } }));
                  }
                })}
              </div>
            </div>
            <div className="sign-line">
              <div className="sk">Position</div>
              <div className="sc">:</div>
              <div className="sv">
                {renderInput(quoteData.signature.preparedByPos, (val) => {
                  if (setQuoteData) {
                    setQuoteData((prev: any) => ({ ...prev, signature: { ...prev.signature, preparedByPos: val } }));
                  }
                })}
              </div>
            </div>
            <div className="sign-line">
              <div className="sk">Signature</div>
              <div className="sc">:</div>
              <div className="sv" style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive", fontSize: '18px', lineHeight: 1, color: 'var(--black)' }}>
                {quoteData.signature.preparedByName || 'John S.'}
              </div>
            </div>
            <div className="sign-line">
              <div className="sk">Date</div>
              <div className="sc">:</div>
              <div className="sv">
                {renderInput(quoteData.signature.preparedByDate, (val) => {
                  if (setQuoteData) {
                    setQuoteData((prev: any) => ({ ...prev, signature: { ...prev.signature, preparedByDate: val } }));
                  }
                })}
              </div>
            </div>
          </div>
          <div className="sign-box">
            <h4>APPROVED BY</h4>
            <div className="sign-line"><div className="sk">Name</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
            <div className="sign-line"><div className="sk">Position</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
            <div className="sign-line"><div className="sk">Signature</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
            <div className="sign-line"><div className="sk">Date</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
          </div>
          <div className="sign-box">
            <h4>CLIENT ACCEPTANCE</h4>
            <div className="sign-line"><div className="sk">Name</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
            <div className="sign-line"><div className="sk">Signature</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
            <div className="sign-line"><div className="sk">Date</div><div className="sc">:</div><div className="sv">&nbsp;</div></div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-left">
          <img className="logo-img-footer" src={logoImg} alt="Logo" style={{ borderRadius: 6 }} />
          <div>
            <div className="ft-title">THANK YOU FOR YOUR BUSINESS!</div>
            <div className="ft-sub">We look forward to working with you.</div>
          </div>
        </div>
        <div className="footer-right">
          <span>
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 11 2 2 4-4"/></svg>
            </span>
            RELIABLE
          </span>
          <span>
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </span>
            POWERFUL
          </span>
          <span>
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            PROFESSIONAL
          </span>
          <span>
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15c4.5-1 7.5-3.5 9-6 1-1.7 2-3 4.5-3.5A3 3 0 0 1 20 8c0 .5-.2 1-.5 1.5l-2.5 3c-.7.8-1.5 2-1 3.5.5 1.5 2.5 3 4 4.5.5.5.5 1.2.2 1.7a2 2 0 0 1-2.2.3c-2-.8-4.5-2.5-6-4.5-1.5-2-3-2.5-5-2-1.5.4-3.5.7-5 .5a2 2 0 0 1-1.5-2.5Z"/></svg>
            </span>
            AUSTRALIAN
          </span>
        </div>
      </div>
    </div>
  );
};
