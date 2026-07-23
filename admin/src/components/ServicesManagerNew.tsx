import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { Search, Plus, Trash2, Pencil, X, ChevronLeft, ChevronRight, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { TService } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImg = (v = '') => {
  if (!v) return '';
  if (v.startsWith('/uploads/')) return `${API}${v}`;
  if (v.startsWith('uploads/')) return `${API}/${v}`;
  return v;
};

interface Props {
  services: TService[];
  onAddService: (service: any) => Promise<void> | void;
  onUpdateService?: (id: string, serviceData: Partial<TService>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteService: (id: string) => Promise<void> | void;
  isCompact?: boolean;
}

const EMPTY = {
  name: '', slug: '', description: '', category: '', status: 'Active' as const,
  iconName: '', serviceTagline: '', heroDescription: '', imageUrl: '', detailImageUrl: '',
  ctaText: '', secondaryText: '', keyHighlights: '', displayOrder: 0,
};

const PAGE_SIZE = 15;

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6,
  border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: '#888', marginBottom: 4,
};

export default function ServicesManagerNew({ services, onAddService, onUpdateService, onUpdateStatus, onDeleteService }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    try {
      const url = await uploadFile(file);
      setForm(p => ({ ...p, iconName: url }));
    } catch { alert('SVG icon upload failed'); }
    finally { setUploadingIcon(false); e.target.value = ''; }
  };

  const filtered = services.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) ||
      (s.slug || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY });
    setImgPreview('');
    setShowModal(true);
  };

  const openEdit = (s: TService) => {
    setEditingId(s.id);
    setForm({
      name: s.name, slug: s.slug, description: s.description, category: s.category || '',
      status: s.status, iconName: s.iconName || '', serviceTagline: s.serviceTagline || '',
      heroDescription: s.heroDescription || '', imageUrl: s.imageUrl || '', detailImageUrl: s.detailImageUrl || '',
      ctaText: s.ctaText || '', secondaryText: s.secondaryText || '',
      keyHighlights: (s.keyHighlights || []).join('\n'), displayOrder: s.displayOrder || 0,
    });
    setImgPreview(resolveImg(s.imageUrl || ''));
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

  const handleImgUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    setImgPreview(URL.createObjectURL(file));
    try {
      const url = await uploadFile(file);
      setForm(p => ({ ...p, imageUrl: url }));
      setImgPreview(resolveImg(url));
    } catch { alert('Image upload failed'); setImgPreview(''); }
    finally { setUploadingImg(false); e.target.value = ''; }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        keyHighlights: form.keyHighlights.split('\n').map(s => s.trim()).filter(Boolean),
        technicalProcedures: [], gallery: [],
      };
      if (editingId && onUpdateService) await onUpdateService(editingId, payload);
      else await onAddService(payload);
      setShowModal(false);
    } catch (err: any) { alert(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 260, backgroundColor: '#fff' }}>
          <Search size={14} strokeWidth={2.5} color="#888" />
          <input
            type="text" placeholder="Search by name, slug, category..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', background: 'transparent', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['All', 'Active', 'Inactive'] as const).map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: statusFilter === s ? 'none' : '1px solid #e8e8e8', backgroundColor: statusFilter === s ? '#e84b10' : '#fff', color: statusFilter === s ? '#fff' : '#1a1a1a' }}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            <Plus size={15} strokeWidth={2.5} /> Add Service
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 70px 110px', padding: '10px 16px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fafafa' }}>
          {['SERVICE', 'CATEGORY', 'SLUG', 'ORDER', 'STATUS'].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {pageItems.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>No services found.</div>
        ) : (
          pageItems.map((svc) => (
            <div key={svc.id}
              style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 70px 110px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>

              {/* Name + image + description */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#fff3ee' }}>
                  {svc.imageUrl ? (
                    <img src={resolveImg(svc.imageUrl)} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#e84b10' }}>
                      {svc.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{svc.name}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 1, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {svc.description}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                {svc.category
                  ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: '#fff3ee', color: '#e84b10', fontWeight: 600 }}>{svc.category}</span>
                  : <span style={{ fontSize: 11, color: '#ccc' }}>—</span>}
              </div>

              {/* Slug */}
              <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {svc.slug}
              </div>

              {/* Order */}
              <div style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>{svc.displayOrder ?? '—'}</div>

              {/* Status + actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => onUpdateStatus(svc.id, svc.status === 'Active' ? 'Inactive' : 'Active')}
                  title="Click to toggle"
                  style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: svc.status === 'Active' ? '#dcfce7' : '#f5f5f5', color: svc.status === 'Active' ? '#16a34a' : '#888' }}>
                  {svc.status}
                </button>
                <button onClick={() => openEdit(svc)} title="Edit"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 3 }}>
                  <Pencil size={14} strokeWidth={2.2} />
                </button>
                <button onClick={() => onDeleteService(svc.id)} title="Delete"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 3 }}>
                  <Trash2 size={14} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: '#888' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} services
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: page === 1 ? 'default' : 'pointer', color: '#888' }}>
              <ChevronLeft size={14} strokeWidth={2.5} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3;
              if (n < 1 || n > totalPages) return null;
              return (
                <button key={n} onClick={() => setPage(n)}
                  style={{ width: 28, height: 28, fontSize: 13, border: 'none', borderRadius: 6, cursor: 'pointer', backgroundColor: n === page ? '#e84b10' : 'transparent', color: n === page ? '#fff' : '#1a1a1a', fontWeight: n === page ? 600 : 400 }}>
                  {n}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: page === totalPages ? 'default' : 'pointer', color: '#888' }}>
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#888' }}>{PAGE_SIZE} per page</div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 12, width: '100%', maxWidth: 660, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{editingId ? 'Edit Service' : 'Add Service'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Service Name *</label>
                  <input required value={form.name} onChange={(e) => {
                    const val = e.target.value;
                    setForm(p => ({ ...p, name: val, slug: p.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
                  }} style={inp} placeholder="e.g. Battery Repair & Maintenance" />
                </div>
                <div>
                  <label style={lbl}>Slug *</label>
                  <input required value={form.slug} onChange={f('slug')} style={inp} placeholder="battery-repair" />
                </div>
                <div>
                  <label style={lbl}>Category</label>
                  <input value={form.category} onChange={f('category')} style={inp} placeholder="Maintenance Services" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Description *</label>
                  <textarea required rows={3} value={form.description} onChange={f('description')} style={{ ...inp, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={lbl}>Service Tagline</label>
                  <input value={form.serviceTagline} onChange={f('serviceTagline')} style={inp} />
                </div>
                <div>
                  <label style={lbl}>CTA Text</label>
                  <input value={form.ctaText} onChange={f('ctaText')} style={inp} placeholder="Get a Quote" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Service Icon (Lucide Icon Name or Upload SVG File)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      value={form.iconName}
                      onChange={f('iconName')}
                      style={{ ...inp, flex: 1 }}
                      placeholder="e.g. wrench, zap, battery or upload custom SVG icon"
                    />
                    <button
                      type="button"
                      onClick={() => iconRef.current?.click()}
                      disabled={uploadingIcon}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                        borderRadius: 6, border: '1px border #e8e8e8', backgroundColor: '#fff3ee',
                        color: '#e84b10', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      {uploadingIcon ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      {uploadingIcon ? 'Uploading...' : 'Upload SVG'}
                    </button>
                    <input ref={iconRef} type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp,.svg" className="hidden" onChange={handleIconUpload} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select value={form.status} onChange={f('status')} style={inp}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Display Order</label>
                  <input type="number" min={0} value={form.displayOrder} onChange={(e) => setForm(p => ({ ...p, displayOrder: Number(e.target.value) }))} style={inp} />
                </div>

                {/* Image upload */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Service Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {imgPreview && (
                      <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0 }}>
                        <img src={imgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <button type="button" onClick={() => imgRef.current?.click()} disabled={uploadingImg}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '2px dashed #e8e8e8', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer' }}>
                      {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploadingImg ? 'Uploading...' : imgPreview ? 'Replace Image' : 'Upload Image'}
                    </button>
                    {imgPreview && (
                      <button type="button" onClick={() => { setImgPreview(''); setForm(p => ({ ...p, imageUrl: '' })); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 11 }}>
                        Remove
                      </button>
                    )}
                    <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Key Highlights (one per line)</label>
                  <textarea rows={3} value={form.keyHighlights} onChange={f('keyHighlights')} style={{ ...inp, resize: 'vertical' }} placeholder={"Reliable Power\nMaximum Performance"} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', color: '#888', fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
