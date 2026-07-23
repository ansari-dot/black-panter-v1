import { useRef, useState, FormEvent, ChangeEvent } from 'react';
import { Upload, Plus, Trash2, Pencil, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TPartnerItem } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImage = (image = '') => {
  if (!image) return '';
  if (image.startsWith('/uploads/')) return `${API}${image}`;
  if (image.startsWith('uploads/')) return `${API}/${image}`;
  if (image.startsWith('http')) return image;
  return image;
};

interface Props {
  partners: TPartnerItem[];
  onAddPartner: (item: Omit<TPartnerItem, 'id' | '_id'>) => Promise<void>;
  onUpdatePartner: (id: string, item: Omit<TPartnerItem, 'id' | '_id'>) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
}

const PAGE_SIZE = 15;

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: '#888', marginBottom: 4,
};
const inp: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6,
  border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a',
  boxSizing: 'border-box',
};

const COL = '2.5fr 2fr 80px 100px';

export default function PartnerManager({ partners, onAddPartner, onUpdatePartner, onDeletePartner }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API}/api/upload`, { method: 'POST', credentials: 'include', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data.url as string;
  };

  const resetForm = () => {
    setEditingId(''); setName(''); setLogoUrl(''); setWebsiteUrl('');
    setDisplayOrder(0); setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const closeModal = () => { setShowModal(false); resetForm(); };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
      setPreview(resolveImage(url));
    } catch { /* handled silently */ }
    finally { setUploading(false); }
  };

  const startEdit = (partner: TPartnerItem) => {
    setEditingId(partner.id);
    setName(partner.name);
    setLogoUrl(partner.logoUrl);
    setWebsiteUrl(partner.websiteUrl || '');
    setDisplayOrder(partner.displayOrder || 0);
    setPreview(resolveImage(partner.logoUrl));
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { name, logoUrl, websiteUrl, displayOrder };
    if (editingId) await onUpdatePartner(editingId, payload);
    else await onAddPartner(payload);
    closeModal();
  };

  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));
  const paginated = partners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', background: '#e84b10', color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          Add Partner
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COL, background: '#fafafa', borderBottom: '1px solid #e8e8e8', padding: '0 16px' }}>
          {['Partner', 'Website', 'Order', 'Actions'].map((col) => (
            <div key={col} style={{ padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>{col}</div>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>No partner logos yet.</div>
        ) : paginated.map((partner) => {
          const isHovered = hoveredRow === partner.id;
          return (
            <div
              key={partner.id}
              onMouseEnter={() => setHoveredRow(partner.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: 'grid', gridTemplateColumns: COL, padding: '0 16px',
                borderBottom: '1px solid #f0f0f0', alignItems: 'center',
                background: isHovered ? '#fafafa' : '#fff', transition: 'background 0.15s',
              }}
            >
              <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 36, border: '1px solid #e8e8e8', borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {partner.logoUrl
                    ? <img src={resolveImage(partner.logoUrl)} alt={partner.name} style={{ maxWidth: 44, maxHeight: 32, objectFit: 'contain' }} />
                    : <span style={{ fontSize: 10, color: '#ccc' }}>No Logo</span>
                  }
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{partner.name}</span>
              </div>

              <div style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                {partner.websiteUrl
                  ? <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#e84b10', textDecoration: 'none' }}>{partner.websiteUrl.replace(/^https?:\/\//, '')}</a>
                  : <span style={{ color: '#ccc' }}>—</span>
                }
              </div>

              <div style={{ fontSize: 12, color: '#888' }}>{partner.displayOrder ?? 0}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  title="Edit"
                  onClick={() => startEdit(partner)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  <Pencil style={{ width: 15, height: 15, color: '#e84b10' }} />
                </button>
                <button
                  title="Delete"
                  onClick={() => { if (confirm(`Remove partner "${partner.name}"?`)) onDeletePartner(partner.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 style={{ width: 15, height: 15, color: '#e84b10' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          <button onClick={() => goTo(page - 1)} disabled={page === 1}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
            <ChevronLeft style={{ width: 14, height: 14, color: '#888' }} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => goTo(p)}
              style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: 600, border: p === page ? 'none' : '1px solid #e8e8e8', background: p === page ? '#e84b10' : '#fff', color: p === page ? '#fff' : '#1a1a1a', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
          <button onClick={() => goTo(page + 1)} disabled={page === totalPages}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
            <ChevronRight style={{ width: 14, height: 14, color: '#888' }} />
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e8e8e8' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{editingId ? 'Edit Partner' : 'Add Partner'}</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
                <X style={{ width: 18, height: 18, color: '#888' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Partner Details</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Partner Name</label>
                    <input required type="text" placeholder="e.g. Acme Corp" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Display Order</label>
                    <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} style={inp} />
                  </div>
                </div>

                <div>
                  <label style={lbl}>Website URL</label>
                  <input type="url" placeholder="https://partner.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} style={inp} />
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Logo</div>

                <div>
                  <label style={lbl}>Upload Logo (jpg, png, webp, svg)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px dashed #e8e8e8', borderRadius: 6, background: '#fafafa', color: '#888', fontSize: 12, cursor: 'pointer' }}
                    >
                      <Upload style={{ width: 13, height: 13 }} />
                      {uploading ? 'Uploading…' : 'Upload Logo'}
                    </button>
                    <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.svg" style={{ display: 'none' }} onChange={handleFileChange} />
                    {preview && (
                      <div style={{ width: 64, height: 44, border: '1px solid #e8e8e8', borderRadius: 6, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={preview} alt="Preview" style={{ maxWidth: 60, maxHeight: 40, objectFit: 'contain' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid #e8e8e8' }}>
                <button type="button" onClick={closeModal}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={uploading}
                  style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#e84b10', color: '#fff', fontSize: 12, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
                  {editingId ? 'Update Partner' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
