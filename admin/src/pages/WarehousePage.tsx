import React, { useState } from 'react';
import {
  Warehouse, Plus, X, Pencil, Trash2, MapPin, Phone, Mail,
  User, Search, Building2, CheckCircle, XCircle, AlertCircle, Check,
} from 'lucide-react';
import { TWarehouse, TStockMovement } from '../types';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface WarehousePageProps {
  warehouses: TWarehouse[];
  movements: TStockMovement[];
  onAdd: (data: Omit<TWarehouse, '_id' | 'id' | 'createdAt'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<TWarehouse>) => Promise<void>;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// ─── Empty form shape ──────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', code: '', address: '', city: '',
  state: '', country: 'Australia',
  contactPerson: '', phone: '', email: '', notes: '', status: 'Active' as 'Active' | 'Inactive',
};

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────
interface FormModalProps {
  existing?: TWarehouse | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

function FormModal({ existing, onClose, onSave }: FormModalProps) {
  const [form, setForm] = useState(existing
    ? { name: existing.name, code: existing.code, address: existing.address, city: existing.city, state: existing.state, country: existing.country, contactPerson: existing.contactPerson, phone: existing.phone, email: existing.email, notes: existing.notes, status: existing.status }
    : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.city.trim()) {
      setError('Name, Code, and City are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave(form);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save warehouse.');
    } finally {
      setLoading(false);
    }
  };

  const label: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 };
  const input: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, color: '#1a1a1a', boxSizing: 'border-box', outline: 'none' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#fff3ee', color: '#e84b10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} strokeWidth={2.3} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{existing ? 'Edit Warehouse' : 'Add New Warehouse'}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{existing ? `Editing: ${existing.name}` : 'Register a new warehouse location'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={18} strokeWidth={2.5} /></button>
        </div>

        {success ? (
          <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={26} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Warehouse saved!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Row 1: Name + Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12 }}>
              <div>
                <label style={label}>Warehouse Name *</label>
                <input style={input} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sydney Main Warehouse" required />
              </div>
              <div>
                <label style={label}>Code *</label>
                <input style={{ ...input, textTransform: 'uppercase', fontFamily: 'monospace' }} value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="SYD-01" required maxLength={10} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label style={label}>Street Address</label>
              <input style={input} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. 12 Industrial Ave" />
            </div>

            {/* City + State + Country */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: 12 }}>
              <div>
                <label style={label}>City *</label>
                <input style={input} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Sydney" required />
              </div>
              <div>
                <label style={label}>State</label>
                <input style={input} value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="NSW" />
              </div>
              <div>
                <label style={label}>Country</label>
                <input style={input} value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Australia" />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label style={label}>Contact Person</label>
              <input style={input} value={form.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} placeholder="e.g. John Smith" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={label}>Phone</label>
                <input style={input} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+61 2 1234 5678" />
              </div>
              <div>
                <label style={label}>Email</label>
                <input style={input} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="warehouse@example.com" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={label}>Status</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['Active', 'Inactive'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${form.status === s ? (s === 'Active' ? '#16a34a' : '#dc2626') : '#e8e8e8'}`, backgroundColor: form.status === s ? (s === 'Active' ? '#f0fdf4' : '#fff5f5') : '#fff', color: form.status === s ? (s === 'Active' ? '#16a34a' : '#dc2626') : '#888' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={label}>Notes</label>
              <textarea rows={2} style={{ ...input, resize: 'none' }} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional notes about this warehouse..." />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#fee2e2', borderRadius: 8, color: '#dc2626', fontSize: 12 }}>
                <AlertCircle size={15} strokeWidth={2.3} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 18px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', color: '#555' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#e84b10', color: '#fff', border: 'none', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : (existing ? 'Update Warehouse' : 'Add Warehouse')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ──────────────────────────────────────────────────────
interface DeleteModalProps {
  warehouse: TWarehouse;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteModal({ warehouse, onClose, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete.');
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
      <div style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', padding: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={24} strokeWidth={2.3} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Delete Warehouse?</div>
          <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
            You are about to delete <strong style={{ color: '#1a1a1a' }}>{warehouse.name}</strong> ({warehouse.code}). This action cannot be undone.
          </div>
          {error && <div style={{ fontSize: 12, color: '#dc2626', backgroundColor: '#fee2e2', padding: '8px 14px', borderRadius: 8, width: '100%' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px 0', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', color: '#555' }}>Cancel</button>
            <button onClick={handleDelete} disabled={loading} style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#dc2626', color: '#fff', border: 'none', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function WarehousePage({ warehouses, movements, onAdd, onUpdate, onUpdateStatus, onDelete }: WarehousePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<TWarehouse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TWarehouse | null>(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = warehouses.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q) || w.city.toLowerCase().includes(q);
  });

  const activeCount   = warehouses.filter((w) => w.status === 'Active').length;
  const inactiveCount = warehouses.filter((w) => w.status === 'Inactive').length;

  const card: React.CSSProperties = { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20 };

  const getWarehouseMovements = (warehouseId: string) =>
    movements.filter((m) => m.warehouse?._id === warehouseId || (m.warehouse as any) === warehouseId);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Modals */}
      {(showForm || editTarget) && (
        <FormModal
          existing={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSave={editTarget ? (data) => onUpdate(editTarget.id, data) : onAdd}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          warehouse={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => onDelete(deleteTarget.id)}
        />
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, border: '1px solid #e8e8e8', borderRadius: 12, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Warehouse size={24} strokeWidth={2} color="#1a1a1a" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.25 }}>Warehouses</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Manage your warehouse locations and contacts</div>
          </div>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 8, cursor: 'pointer', border: 'none' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Warehouse
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'TOTAL WAREHOUSES',  value: warehouses.length, icon: <Building2 size={22} />, bg: '#f5f5f5',  color: '#555' },
          { label: 'ACTIVE LOCATIONS',  value: activeCount,       icon: <CheckCircle size={22} />, bg: '#dcfce7', color: '#16a34a' },
          { label: 'INACTIVE LOCATIONS',value: inactiveCount,     icon: <XCircle size={22} />,    bg: '#fee2e2', color: '#dc2626' },
        ].map((s) => (
          <div key={s.label} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ALL WAREHOUSES ({filtered.length})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 240, backgroundColor: '#fff' }}>
            <Search size={14} strokeWidth={2.5} color="#888" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, city..."
              style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', backgroundColor: 'transparent', width: '100%' }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <Building2 size={48} color="#e8e8e8" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>
              {warehouses.length === 0 ? 'No warehouses yet' : 'No results found'}
            </div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
              {warehouses.length === 0 ? 'Add your first warehouse to get started.' : 'Try a different search term.'}
            </div>
            {warehouses.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 8, cursor: 'pointer', border: 'none' }}
              >
                <Plus size={15} /> Add First Warehouse
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((w) => (
              <div
                key={w.id}
                style={{ border: '1px solid #e8e8e8', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#e84b10')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e8e8e8')}
              >
                {/* Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: w.status === 'Active' ? '#fff3ee' : '#f5f5f5', color: w.status === 'Active' ? '#e84b10' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={22} strokeWidth={2} />
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{w.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 5, backgroundColor: '#f5f5f5', color: '#555' }}>{w.code}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, backgroundColor: w.status === 'Active' ? '#dcfce7' : '#fee2e2', color: w.status === 'Active' ? '#16a34a' : '#dc2626' }}>
                      {w.status}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px' }}>
                    {(w.address || w.city) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
                        <MapPin size={13} strokeWidth={2} color="#888" />
                        {[w.address, w.city, w.state, w.country].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {w.contactPerson && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
                        <User size={13} strokeWidth={2} color="#888" />
                        {w.contactPerson}
                      </div>
                    )}
                    {w.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
                        <Phone size={13} strokeWidth={2} color="#888" />
                        {w.phone}
                      </div>
                    )}
                    {w.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
                        <Mail size={13} strokeWidth={2} color="#888" />
                        {w.email}
                      </div>
                    )}
                  </div>

                  {w.notes && (
                    <div style={{ marginTop: 6, fontSize: 12, color: '#888', fontStyle: 'italic' }}>{w.notes}</div>
                  )}

                  {/* Movements summary */}
                  {(() => {
                    const wMovements = getWarehouseMovements(w._id || w.id);
                    const inCount  = wMovements.filter((m) => m.type === 'in').length;
                    const outCount = wMovements.filter((m) => m.type === 'out').length;
                    const isExpanded = expandedId === w.id;
                    return wMovements.length > 0 ? (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: '#888' }}>Movements:</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: '#dcfce7', color: '#16a34a' }}>+{inCount} IN</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: '#fee2e2', color: '#dc2626' }}>−{outCount} OUT</span>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : w.id)}
                            style={{ fontSize: 11, color: '#e84b10', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                          >
                            {isExpanded ? 'Hide' : 'View history'} →
                          </button>
                        </div>
                        {isExpanded && (
                          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                            {wMovements.slice(0, 5).map((m) => (
                              <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                                <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: m.type === 'in' ? '#dcfce7' : '#fee2e2', color: m.type === 'in' ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {m.type === 'in' ? <ArrowDownToLine size={13} strokeWidth={2.3} /> : <ArrowUpFromLine size={13} strokeWidth={2.3} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {m.product?.name || 'Unknown'}
                                  </div>
                                  <div style={{ fontSize: 11, color: '#888' }}>{m.note || m.by}</div>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: m.type === 'in' ? '#16a34a' : '#dc2626', flexShrink: 0 }}>
                                  {m.type === 'in' ? '+' : '−'}{m.quantity}
                                </div>
                                <div style={{ fontSize: 11, color: '#888', flexShrink: 0 }}>{formatDate(m.createdAt)}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: 8, fontSize: 11, color: '#ccc', fontStyle: 'italic' }}>No movements recorded yet for this warehouse.</div>
                    );
                  })()}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {/* Toggle status */}
                  <button
                    onClick={() => onUpdateStatus(w.id, w.status === 'Active' ? 'Inactive' : 'Active')}
                    title={w.status === 'Active' ? 'Deactivate' : 'Activate'}
                    style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${w.status === 'Active' ? '#e8e8e8' : '#dcfce7'}`, backgroundColor: w.status === 'Active' ? '#fff' : '#f0fdf4', color: w.status === 'Active' ? '#888' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    {w.status === 'Active' ? <XCircle size={15} strokeWidth={2.3} /> : <CheckCircle size={15} strokeWidth={2.3} />}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => setEditTarget(w)}
                    title="Edit"
                    style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid #e8e8e8', backgroundColor: '#fff', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Pencil size={15} strokeWidth={2.3} />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(w)}
                    title="Delete"
                    style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid #fee2e2', backgroundColor: '#fff5f5', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} strokeWidth={2.3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
