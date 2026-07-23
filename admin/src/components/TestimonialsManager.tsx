import { useState, FormEvent, useRef } from 'react';
import { MessageSquarePlus, Trash2, Search, Upload, ChevronLeft, ChevronRight, X, Pencil } from 'lucide-react';
import { TTestimonial } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImg = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `${API}${url}`;
  return `${API}/${url.replace(/^\//, '')}`;
};

interface Props {
  testimonials: TTestimonial[];
  onAddTestimonial: (formData: FormData) => Promise<void>;
  onUpdateStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
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

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Approved: { bg: '#dcfce7', color: '#16a34a' },
  Pending:  { bg: '#fef3c7', color: '#d97706' },
  Rejected: { bg: '#fee2e2', color: '#dc2626' },
};

const STATUS_CYCLE: Record<string, 'Approved' | 'Pending' | 'Rejected'> = {
  Approved: 'Pending',
  Pending:  'Rejected',
  Rejected: 'Approved',
};

const COL_TEMPLATE = '2fr 100px 2fr 110px 150px';

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ opacity: i < rating ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

export default function TestimonialsManager({ testimonials, onAddTestimonial, onUpdateStatus, onDeleteTestimonial }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'Approved' | 'Pending' | 'Rejected'>('Pending');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName(''); setCompany(''); setMessage(''); setRating(5);
    setStatus('Pending'); setImageFile(null); setImagePreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('company', company.trim());
      fd.append('message', message.trim());
      fd.append('rating', String(rating));
      fd.append('status', status);
      if (imageFile) fd.append('image', imageFile);
      await onAddTestimonial(fd);
      resetForm();
      setShowModal(false);
    } catch {
      // errors handled by parent
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => { setShowModal(false); resetForm(); };

  const filtered = testimonials.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q) || t.message.toLowerCase().includes(q);
    const matchRating = filterRating === 'All' || t.rating === filterRating;
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchRating && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goTo = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#aaa' }} />
          <input
            type="text"
            placeholder="Search testimonials…"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            style={{ ...inp, paddingLeft: 30 }}
          />
        </div>

        {/* Rating filter */}
        <select
          value={filterRating}
          onChange={(e) => { setFilterRating(e.target.value === 'All' ? 'All' : Number(e.target.value)); setPage(1); }}
          style={{ ...inp, width: 'auto', cursor: 'pointer' }}
        >
          <option value="All">All Ratings</option>
          {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
        </select>

        {/* Status filter pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f5f5f5', borderRadius: 8, padding: '3px 4px', border: '1px solid #e8e8e8' }}>
          {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: 'none',
                cursor: 'pointer',
                background: filterStatus === s ? '#fff' : 'transparent',
                color: filterStatus === s ? '#1a1a1a' : '#888',
                boxShadow: filterStatus === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              background: '#e84b10', color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <MessageSquarePlus style={{ width: 14, height: 14 }} />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, background: '#fafafa', borderBottom: '1px solid #e8e8e8', padding: '0 16px' }}>
          {['Client', 'Rating', 'Message', 'Date', 'Status / Actions'].map((col) => (
            <div key={col} style={{ padding: '10px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
              {col}
            </div>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>No testimonials found.</div>
        ) : (
          paginated.map((t) => {
            const isHovered = hoveredRow === t._id;
            const imgSrc = t.image ? resolveImg(t.image) : '';
            const initial = t.name.charAt(0).toUpperCase();
            const sc = STATUS_COLORS[t.status] || STATUS_COLORS.Pending;
            const date = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

            return (
              <div
                key={t._id}
                onMouseEnter={() => setHoveredRow(t._id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: 'grid', gridTemplateColumns: COL_TEMPLATE,
                  padding: '0 16px', borderBottom: '1px solid #f0f0f0',
                  background: isHovered ? '#fafafa' : '#fff', alignItems: 'center',
                  transition: 'background 0.15s',
                }}
              >
                {/* Client */}
                <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {imgSrc ? (
                    <img src={imgSrc} alt={t.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e8e8e8', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff3ee', color: '#e84b10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, border: '1px solid #ffe0d3' }}>
                      {initial}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{t.company}</div>
                  </div>
                </div>

                {/* Rating */}
                <div style={{ padding: '12px 0' }}>
                  <StarRating rating={t.rating} />
                </div>

                {/* Message (truncated) */}
                <div style={{ padding: '12px 8px 12px 0', fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                  {t.message}
                </div>

                {/* Date */}
                <div style={{ padding: '12px 0', fontSize: 12, color: '#aaa' }}>{date}</div>

                {/* Status + Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0' }}>
                  <button
                    onClick={() => onUpdateStatus(t._id, STATUS_CYCLE[t.status])}
                    title="Click to cycle status"
                    style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                      background: sc.bg, color: sc.color,
                    }}
                  >
                    {t.status}
                  </button>
                  <button
                    title="Delete testimonial"
                    onClick={() => { if (confirm(`Remove testimonial from ${t.name}?`)) onDeleteTestimonial(t._id); }}
                    style={{
                      background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer',
                      padding: '5px 7px', display: 'flex', alignItems: 'center',
                      opacity: isHovered ? 1 : 0, transition: 'opacity 0.15s',
                    }}
                  >
                    <Trash2 style={{ width: 13, height: 13, color: '#dc2626' }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft style={{ width: 14, height: 14, color: '#888' }} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => goTo(p)}
              style={{ width: 30, height: 30, borderRadius: 6, fontSize: 12, fontWeight: 600, border: p === page ? 'none' : '1px solid #e8e8e8', background: p === page ? '#e84b10' : '#fff', color: p === page ? '#fff' : '#1a1a1a', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}
          >
            <ChevronRight style={{ width: 14, height: 14, color: '#888' }} />
          </button>
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e8e8e8' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Add Testimonial</span>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
                <X style={{ width: 18, height: 18, color: '#888' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Client Info</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Client Name</label>
                    <input required type="text" placeholder="e.g. John Smith" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Company</label>
                    <input required type="text" placeholder="e.g. Durban Ports" value={company} onChange={(e) => setCompany(e.target.value)} style={inp} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Rating</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ ...inp, cursor: 'pointer' }}>
                      {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as 'Approved' | 'Pending' | 'Rejected')} style={{ ...inp, cursor: 'pointer' }}>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>Testimonial</div>

                <div>
                  <label style={lbl}>Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Client feedback…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }}
                  />
                </div>

                <div>
                  <label style={lbl}>Client Photo (jpg, jpeg, png, webp)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', border: '1px dashed #e8e8e8', borderRadius: 6, background: '#fafafa', color: '#888', fontSize: 12, cursor: 'pointer' }}
                    >
                      <Upload style={{ width: 13, height: 13 }} />
                      Choose Image
                    </button>
                    <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleImageChange} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e8e8e8' }} />
                    )}
                    {imageFile && (
                      <span style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{imageFile.name}</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '14px 20px', borderTop: '1px solid #e8e8e8' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #e8e8e8', background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#e84b10', color: '#fff', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Saving…' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
