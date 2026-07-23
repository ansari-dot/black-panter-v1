import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { Upload, Plus, Trash2, Pencil, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { TEquipmentItem } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImg = (v = '') => {
  if (!v) return '';
  if (v.startsWith('/uploads/')) return `${API}${v}`;
  if (v.startsWith('uploads/')) return `${API}/${v}`;
  return v;
};

interface Props {
  equipment: TEquipmentItem[];
  onAddEquipment: (item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onUpdateEquipment: (id: string, item: Omit<TEquipmentItem, 'id' | '_id'>) => Promise<void>;
  onDeleteEquipment: (id: string) => Promise<void>;
}

const PAGE_SIZE = 10;

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6,
  border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: '#888', marginBottom: 4,
};

export default function EquipmentManager({ equipment, onAddEquipment, onUpdateEquipment, onDeleteEquipment }: Props) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = equipment.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setEditingId(''); setTitle(''); setDescription('');
    setImageUrl(''); setImgPreview(''); setDisplayOrder(0);
  };

  const openAdd = () => { reset(); setShowModal(true); };
  const openEdit = (item: TEquipmentItem) => {
    setEditingId(item.id); setTitle(item.title); setDescription(item.description);
    setImageUrl(item.imageUrl || ''); setImgPreview(resolveImg(item.imageUrl || ''));
    setDisplayOrder(item.displayOrder || 0);
    setShowModal(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API}/api/upload`, { method: 'POST', credentials: 'include', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url as string;
  };

  const handleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setImgPreview(URL.createObjectURL(file));
    try {
      const url = await uploadFile(file);
      setImageUrl(url);
      setImgPreview(resolveImg(url));
    } catch { alert('Image upload failed'); setImgPreview(''); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title, description, imageUrl, displayOrder };
      if (editingId) await onUpdateEquipment(editingId, payload);
      else await onAddEquipment(payload);
      reset();
      setShowModal(false);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>

      {/* Section heading */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>Equipment & Capabilities</div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Manage equipment cards shown on the services page.</div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 260, backgroundColor: '#fff' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
          </svg>
          <input
            type="text" placeholder="Search equipment..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', background: 'transparent', width: '100%' }}
          />
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
          <Plus size={15} strokeWidth={2.5} /> Add Equipment
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 70px 100px', padding: '10px 16px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fafafa' }}>
          {['EQUIPMENT', 'DESCRIPTION', 'ORDER', 'ACTIONS'].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {pageItems.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>No equipment items found.</div>
        ) : (
          pageItems.map((item) => (
            <div key={item.id}
              style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 70px 100px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
              {/* Image + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#f5f5f5' }}>
                  {item.imageUrl ? (
                    <img src={resolveImg(item.imageUrl)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#e84b10', backgroundColor: '#fff3ee' }}>
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.title}</div>
              </div>

              {/* Description */}
              <div style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                {item.description}
              </div>

              {/* Order */}
              <div style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>{item.displayOrder ?? '—'}</div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => openEdit(item)} title="Edit"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
                  <Pencil size={14} strokeWidth={2.2} />
                </button>
                <button onClick={() => onDeleteEquipment(item.id)} title="Delete"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
                  <Trash2 size={14} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: '#888' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#888' }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                style={{ width: 28, height: 28, fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', backgroundColor: n === page ? '#e84b10' : 'transparent', color: n === page ? '#fff' : '#1a1a1a', fontWeight: n === page ? 600 : 400 }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#888' }}>
              <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#888' }}>{PAGE_SIZE} per page</div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 12, width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{editingId ? 'Edit Equipment' : 'Add Equipment'}</div>
              <button onClick={() => { setShowModal(false); reset(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Title *</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} style={inp} placeholder="e.g. Battery Testing Rig" />
              </div>
              <div>
                <label style={lbl}>Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inp, resize: 'vertical' }} placeholder="Brief description..." />
              </div>
              <div>
                <label style={lbl}>Display Order</label>
                <input type="number" min={0} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {imgPreview && (
                    <div style={{ width: 64, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0 }}>
                      <img src={imgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '2px dashed #e8e8e8', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer' }}>
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? 'Uploading...' : imgPreview ? 'Replace' : 'Upload Image'}
                  </button>
                  {imgPreview && (
                    <button type="button" onClick={() => { setImgPreview(''); setImageUrl(''); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 11 }}>Remove</button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                <button type="button" onClick={() => { setShowModal(false); reset(); }}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', color: '#888', fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Equipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
