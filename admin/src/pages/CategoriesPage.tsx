import React, { useState } from 'react';
import {
  Tag, Plus, X, Pencil, Trash2, Search, CheckCircle, XCircle, AlertCircle, Check
} from 'lucide-react';
import { TCategory } from '../types';

interface CategoriesPageProps {
  categories: TCategory[];
  onAdd: (data: Omit<TCategory, '_id' | 'id' | 'createdAt'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<TCategory>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  displayOrder: 0,
  status: 'Active' as 'Active' | 'Inactive',
};

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────
interface FormModalProps {
  existing?: TCategory | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

function FormModal({ existing, onClose, onSave }: FormModalProps) {
  const [form, setForm] = useState(existing
    ? {
        name: existing.name,
        slug: existing.slug,
        description: existing.description || '',
        displayOrder: existing.displayOrder || 0,
        status: existing.status,
      }
    : { ...EMPTY_FORM }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const handleAutoSlug = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: f.slug ? f.slug : val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and Slug are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave(form);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, color: '#1a1a1a', boxSizing: 'border-box', outline: 'none' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: '#fff3ee', color: '#e84b10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={20} strokeWidth={2.3} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{existing ? 'Edit Category' : 'Add New Category'}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{existing ? `Editing: ${existing.name}` : 'Create a new inventory category'}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={18} strokeWidth={2.5} /></button>
        </div>

        {success ? (
          <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={26} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Category saved!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Category Name *</label>
              <input style={inputStyle} value={form.name} onChange={(e) => handleAutoSlug(e.target.value)} placeholder="e.g. Solar / Deep Cycle" required />
            </div>
            <div>
              <label style={labelStyle}>Slug *</label>
              <input style={{ ...inputStyle, textTransform: 'lowercase', fontFamily: 'monospace' }} value={form.slug} onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="solar-deep-cycle" required />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="e.g. Solar batteries and application backups" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input style={inputStyle} type="number" min={0} value={form.displayOrder} onChange={(e) => set('displayOrder', Number(e.target.value))} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value as any)}
                  style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#fee2e2', borderRadius: 8, color: '#dc2626', fontSize: 12 }}>
                <AlertCircle size={15} strokeWidth={2.3} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 18px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', color: '#555' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#e84b10', color: '#fff', border: 'none', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : (existing ? 'Update' : 'Create')}
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
  category: TCategory;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteModal({ category, onClose, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category.');
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
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Delete Category?</div>
          <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
            You are about to delete <strong style={{ color: '#1a1a1a' }}>{category.name}</strong>. This will succeed only if no active products are using this category.
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
export default function CategoriesPage({ categories, onAdd, onUpdate, onDelete }: CategoriesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<TCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TCategory | null>(null);
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  const activeCount = categories.filter((c) => c.status === 'Active').length;
  const inactiveCount = categories.filter((c) => c.status === 'Inactive').length;

  const cardStyle: React.CSSProperties = { backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20 };

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
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => onDelete(deleteTarget.id)}
        />
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, border: '1px solid #e8e8e8', borderRadius: 12, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={24} strokeWidth={2} color="#1a1a1a" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.25 }}>Inventory Categories</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Manage dynamic categories for inventory and catalog products</div>
          </div>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 8, cursor: 'pointer', border: 'none' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Category
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'TOTAL CATEGORIES', value: categories.length, icon: <Tag size={22} />, bg: '#f5f5f5', color: '#555' },
          { label: 'ACTIVE CATEGORIES', value: activeCount, icon: <CheckCircle size={22} />, bg: '#dcfce7', color: '#16a34a' },
          { label: 'INACTIVE CATEGORIES', value: inactiveCount, icon: <XCircle size={22} />, bg: '#fee2e2', color: '#dc2626' },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and List */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ALL CATEGORIES ({filtered.length})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 240, backgroundColor: '#fff' }}>
            <Search size={14} strokeWidth={2.5} color="#888" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or slug..."
              style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', backgroundColor: 'transparent', width: '100%' }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#888' }}>
            No categories found. Click "Add Category" to create one.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                <th style={{ fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'left', padding: '12px', letterSpacing: '0.05em' }}>NAME</th>
                <th style={{ fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'left', padding: '12px', letterSpacing: '0.05em' }}>SLUG</th>
                <th style={{ fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'left', padding: '12px', letterSpacing: '0.05em' }}>DESCRIPTION</th>
                <th style={{ fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'center', padding: '12px', letterSpacing: '0.05em' }}>ORDER</th>
                <th style={{ fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'left', padding: '12px', letterSpacing: '0.05em' }}>STATUS</th>
                <th style={{ fontSize: 11, fontWeight: 600, color: '#888', textAlign: 'center', padding: '12px', letterSpacing: '0.05em' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{cat.name}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#e84b10', fontFamily: 'monospace' }}>{cat.slug}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#666' }}>{cat.description || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#1a1a1a', textAlign: 'center' }}>{cat.displayOrder}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, backgroundColor: cat.status === 'Active' ? '#dcfce7' : '#fee2e2', color: cat.status === 'Active' ? '#16a34a' : '#dc2626' }}>
                      {cat.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <button
                        onClick={() => setEditTarget(cat)}
                        title="Edit"
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e8e8e8', backgroundColor: '#fff', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Pencil size={13} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        title="Delete"
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #fee2e2', backgroundColor: '#fff5f5', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
