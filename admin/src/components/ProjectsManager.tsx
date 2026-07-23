import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { Search, Plus, Trash2, Pencil, X, ChevronLeft, ChevronRight, Upload, Loader2 } from 'lucide-react';
import { TProject } from '../types';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const resolveImg = (v = '') => {
  if (!v) return '';
  if (v.startsWith('/uploads/')) return `${API}${v}`;
  if (v.startsWith('uploads/')) return `${API}/${v}`;
  return v;
};

interface Props {
  projects: TProject[];
  onAddProject: (project: Partial<TProject>) => Promise<void> | void;
  onUpdateProject?: (id: string, projectData: Partial<TProject>) => Promise<void> | void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => Promise<void> | void;
  onDeleteProject: (id: string) => Promise<void> | void;
  isCompact?: boolean;
}

const PAGE_SIZE = 15;
const inp: React.CSSProperties = { width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #e8e8e8', outline: 'none', background: '#fff', color: '#1a1a1a' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 4 };

const EMPTY = {
  title: '', slug: '', subtitle: '', description: '', category: '', status: 'Active' as const,
  imageUrl: '', heroTag: 'Project Detail', heroTitleLine1White: '', heroTitleLine1Orange: '',
  heroTitleLine2White: '', heroTitleLine2Orange: '', galleryText: '', highlightsText: '',
  metricsText: '', processText: '', clientName: '', location: '', sector: '',
  completedDate: '', timeline: '', unitsInstalled: '', uptime: '', displayOrder: 0,
};

export default function ProjectsManager({ projects, onAddProject, onUpdateProject, onUpdateStatus, onDeleteProject }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [imgPreview, setImgPreview] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const match = p.title.toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.clientName || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return match && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY });
    setImgPreview('');
    setShowModal(true);
  };

  const openEdit = (p: TProject) => {
    setEditingId(p.id);
    setForm({
      title: p.title, slug: p.slug, subtitle: p.subtitle || '', description: p.description,
      category: p.category || '', status: p.status, imageUrl: p.imageUrl || '',
      heroTag: p.heroTag || 'Project Detail',
      heroTitleLine1White: p.heroTitleLine1White || '', heroTitleLine1Orange: p.heroTitleLine1Orange || '',
      heroTitleLine2White: p.heroTitleLine2White || '', heroTitleLine2Orange: p.heroTitleLine2Orange || '',
      galleryText: (p.gallery || []).join('\n'),
      highlightsText: (p.highlights || []).join('\n'),
      metricsText: (p.metrics || []).map(m => `${m.label}|${m.value}`).join('\n'),
      processText: (p.process || []).join('\n'),
      clientName: p.clientName || '', location: p.location || '', sector: p.sector || '',
      completedDate: p.completedDate || '', timeline: p.timeline || '',
      unitsInstalled: p.unitsInstalled || '', uptime: p.uptime || '',
      displayOrder: p.displayOrder || 0,
    });
    setImgPreview(resolveImg(p.imageUrl || ''));
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

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setForm(p => ({ ...p, galleryText: p.galleryText ? p.galleryText + '\n' + urls.join('\n') : urls.join('\n') }));
    } catch { alert('Gallery upload failed'); }
    finally { setUploadingGallery(false); e.target.value = ''; }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<TProject> = {
        title: form.title, slug: form.slug, subtitle: form.subtitle, description: form.description,
        category: form.category, status: form.status, imageUrl: form.imageUrl,
        heroTag: form.heroTag, heroTitleLine1White: form.heroTitleLine1White,
        heroTitleLine1Orange: form.heroTitleLine1Orange, heroTitleLine2White: form.heroTitleLine2White,
        heroTitleLine2Orange: form.heroTitleLine2Orange,
        gallery: form.galleryText.split('\n').map(s => s.trim()).filter(Boolean),
        highlights: form.highlightsText.split('\n').map(s => s.trim()).filter(Boolean),
        metrics: form.metricsText.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
          const [label, value] = line.split('|');
          return { label: label?.trim() || '', value: value?.trim() || '' };
        }),
        process: form.processText.split('\n').map(s => s.trim()).filter(Boolean),
        clientName: form.clientName, location: form.location, sector: form.sector,
        completedDate: form.completedDate, timeline: form.timeline,
        unitsInstalled: form.unitsInstalled, uptime: form.uptime, displayOrder: form.displayOrder,
      };
      if (editingId && onUpdateProject) await onUpdateProject(editingId, payload);
      else await onAddProject(payload);
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
          <input type="text" placeholder="Search by title, slug, client..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', background: 'transparent', width: '100%' }} />
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
            <Plus size={15} strokeWidth={2.5} /> Add Project
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 80px 110px', padding: '10px 16px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fafafa' }}>
          {['PROJECT', 'CATEGORY', 'CLIENT', 'ORDER', 'STATUS'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {pageItems.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>No projects found.</div>
        ) : pageItems.map((proj) => (
          <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 80px 110px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
            {/* Image + title + description */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#fff3ee' }}>
                {proj.imageUrl
                  ? <img src={resolveImg(proj.imageUrl)} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#e84b10' }}>{proj.title.charAt(0).toUpperCase()}</div>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{proj.title}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 1, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.description}</div>
              </div>
            </div>
            {/* Category */}
            <div>
              {proj.category
                ? <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: '#fff3ee', color: '#e84b10', fontWeight: 600 }}>{proj.category}</span>
                : <span style={{ fontSize: 11, color: '#ccc' }}>—</span>}
            </div>
            {/* Client */}
            <div style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.clientName || '—'}</div>
            {/* Order */}
            <div style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>{proj.displayOrder ?? '—'}</div>
            {/* Status + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => onUpdateStatus(proj.id, proj.status === 'Active' ? 'Inactive' : 'Active')} title="Click to toggle"
                style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: proj.status === 'Active' ? '#dcfce7' : '#f5f5f5', color: proj.status === 'Active' ? '#16a34a' : '#888' }}>
                {proj.status}
              </button>
              <button onClick={() => openEdit(proj)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 3 }}>
                <Pencil size={14} strokeWidth={2.2} />
              </button>
              <button onClick={() => onDeleteProject(proj.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 3 }}>
                <Trash2 size={14} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: '#888' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} projects
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

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 12, width: '100%', maxWidth: 720, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{editingId ? 'Edit Project' : 'Add Project'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Section: Basic */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Basic Info</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Title *</label>
                  <input required value={form.title} onChange={(e) => { const v = e.target.value; setForm(p => ({ ...p, title: v, slug: p.slug || v.toLowerCase().replace(/[^a-z0-9]+/g, '-') })); }} style={inp} />
                </div>
                <div><label style={lbl}>Slug *</label><input required value={form.slug} onChange={f('slug')} style={inp} /></div>
                <div><label style={lbl}>Category</label><input value={form.category} onChange={f('category')} style={inp} placeholder="e.g. Solar Installation" /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Subtitle</label><input value={form.subtitle} onChange={f('subtitle')} style={inp} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Description *</label><textarea required rows={3} value={form.description} onChange={f('description')} style={{ ...inp, resize: 'vertical' }} /></div>
                <div><label style={lbl}>Status</label>
                  <select value={form.status} onChange={f('status')} style={inp}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div><label style={lbl}>Display Order</label><input type="number" min={0} value={form.displayOrder} onChange={(e) => setForm(p => ({ ...p, displayOrder: Number(e.target.value) }))} style={inp} /></div>
              </div>

              {/* Section: Image */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Main Image</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {imgPreview && <div style={{ width: 72, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0 }}><img src={imgPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                <button type="button" onClick={() => imgRef.current?.click()} disabled={uploadingImg}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '2px dashed #e8e8e8', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer' }}>
                  {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploadingImg ? 'Uploading...' : imgPreview ? 'Replace' : 'Upload Image'}
                </button>
                {imgPreview && <button type="button" onClick={() => { setImgPreview(''); setForm(p => ({ ...p, imageUrl: '' })); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 11 }}>Remove</button>}
                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
              </div>

              {/* Section: Gallery */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Gallery</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {form.galleryText.split('\n').filter(Boolean).map((url, i) => (
                  <div key={i} style={{ position: 'relative', width: 56, height: 48, borderRadius: 6, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
                    <img src={resolveImg(url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setForm(p => ({ ...p, galleryText: p.galleryText.split('\n').filter((_, idx) => idx !== i).join('\n') }))}
                      style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 10 }}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => galleryRef.current?.click()} disabled={uploadingGallery}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '2px dashed #e8e8e8', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer' }}>
                  {uploadingGallery ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploadingGallery ? 'Uploading...' : 'Add Gallery'}
                </button>
                <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              </div>

              {/* Section: Project Details */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Project Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={lbl}>Client Name</label><input value={form.clientName} onChange={f('clientName')} style={inp} /></div>
                <div><label style={lbl}>Location</label><input value={form.location} onChange={f('location')} style={inp} /></div>
                <div><label style={lbl}>Sector</label><input value={form.sector} onChange={f('sector')} style={inp} /></div>
                <div><label style={lbl}>Completed Date</label><input value={form.completedDate} onChange={f('completedDate')} style={inp} placeholder="e.g. March 2025" /></div>
                <div><label style={lbl}>Timeline</label><input value={form.timeline} onChange={f('timeline')} style={inp} /></div>
                <div><label style={lbl}>Units Installed</label><input value={form.unitsInstalled} onChange={f('unitsInstalled')} style={inp} /></div>
                <div><label style={lbl}>Uptime</label><input value={form.uptime} onChange={f('uptime')} style={inp} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Highlights (one per line)</label><textarea rows={3} value={form.highlightsText} onChange={f('highlightsText')} style={{ ...inp, resize: 'vertical' }} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Metrics (label|value, one per line)</label><textarea rows={3} value={form.metricsText} onChange={f('metricsText')} placeholder="Uptime|99.9%&#10;Units Installed|120" style={{ ...inp, resize: 'vertical' }} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={lbl}>Process Steps (one per line)</label><textarea rows={3} value={form.processText} onChange={f('processText')} style={{ ...inp, resize: 'vertical' }} /></div>
              </div>

              {/* Section: Hero */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Hero Section</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={lbl}>Hero Tag</label><input value={form.heroTag} onChange={f('heroTag')} style={inp} /></div>
                <div><label style={lbl}>Title Line 1 (White)</label><input value={form.heroTitleLine1White} onChange={f('heroTitleLine1White')} style={inp} /></div>
                <div><label style={lbl}>Title Line 1 (Orange)</label><input value={form.heroTitleLine1Orange} onChange={f('heroTitleLine1Orange')} style={inp} /></div>
                <div><label style={lbl}>Title Line 2 (White)</label><input value={form.heroTitleLine2White} onChange={f('heroTitleLine2White')} style={inp} /></div>
                <div><label style={lbl}>Title Line 2 (Orange)</label><input value={form.heroTitleLine2Orange} onChange={f('heroTitleLine2Orange')} style={inp} /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', color: '#888', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
