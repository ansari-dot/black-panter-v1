import { useState, FormEvent, useRef } from 'react';
import { Star, MessageSquarePlus, Trash2, Search, Quote, CheckCircle2, Upload } from 'lucide-react';
import { TTestimonial } from '../types';
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Props {
  testimonials: TTestimonial[];
  onAddTestimonial: (formData: FormData) => Promise<void>;
  onUpdateStatus: (id: string, status: 'Approved' | 'Pending' | 'Rejected') => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
}

export default function TestimonialsManager({ testimonials, onAddTestimonial, onUpdateStatus, onDeleteTestimonial }: Props) {
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterRating, setFilterRating] = useState<number | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddForm, setShowAddForm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [toastMsg, setToastMsg]         = useState('');
  const [toastError, setToastError]     = useState('');

  const [name, setName]         = useState('');
  const [company, setCompany]   = useState('');
  const [rating, setRating]     = useState(5);
  const [message, setMessage]   = useState('');
  const [status, setStatus]     = useState<'Approved' | 'Pending' | 'Rejected'>('Pending');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, isError = false) => {
    if (isError) { setToastError(msg); setTimeout(() => setToastError(''), 4000); }
    else { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); }
  };

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
      setShowAddForm(false);
      showToast('Testimonial added successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to add testimonial', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`Remove testimonial from ${clientName}?`)) return;
    try {
      await onDeleteTestimonial(id);
      showToast('Testimonial deleted.');
    } catch {
      showToast('Failed to delete.', true);
    }
  };

  const handleStatusChange = async (id: string, s: 'Approved' | 'Pending' | 'Rejected') => {
    try {
      await onUpdateStatus(id, s);
    } catch {
      showToast('Failed to update status.', true);
    }
  };

  const filtered = testimonials.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q) || t.message.toLowerCase().includes(q);
    const matchRating = filterRating === 'All' || t.rating === filterRating;
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchRating && matchStatus;
  });

  return (
    <div className="flex flex-col gap-5 text-xs">

      {/* Filter bar */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search testimonials..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="p-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none cursor-pointer">
            <option value="All">All Ratings</option>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="p-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none cursor-pointer">
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={() => { setShowAddForm(!showAddForm); resetForm(); }}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer">
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Add Testimonial'}</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-lg font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />{toastMsg}
        </div>
      )}
      {toastError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold">{toastError}</div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Add Testimonial</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Client Name *</label>
                <input required type="text" placeholder="e.g. John Smith" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Company *</label>
                <input required type="text" placeholder="e.g. Durban Ports" value={company} onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none cursor-pointer">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none cursor-pointer">
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Message *</label>
              <textarea required rows={3} placeholder="Client feedback..." value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary leading-relaxed" />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Client Photo (jpg, jpeg, png, webp)</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary cursor-pointer">
                  <Upload className="w-4 h-4" /><span>Choose Image</span>
                </button>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-border" />}
                {imageFile && <span className="text-muted-foreground truncate max-w-[150px]">{imageFile.name}</span>}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border">
              <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }}
                className="px-4 py-2 hover:bg-muted text-muted-foreground font-semibold rounded-lg cursor-pointer">Cancel</button>
              <button type="submit" disabled={loading}
                className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-60">
                {loading ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((t) => (
          <div key={t._id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-all relative group">
            <button onClick={() => handleDelete(t._id, t.name)}
              className="absolute right-3 top-3 p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3">
              {t.image
                ? <img src={t.image} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                : <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-base font-bold text-muted-foreground">{t.name[0]}</div>
              }
              <div className="flex-1">
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-primary text-primary' : 'text-muted/60'}`} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Quote className="w-4 h-4 text-primary/30 shrink-0 mt-0.5" />
                  <p className="text-foreground text-xs italic leading-relaxed">"{t.message}"</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="block font-semibold text-foreground text-xs">{t.name}</span>
                <span className="block text-[11px] text-muted-foreground mt-0.5">{t.company} • {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently added'}</span>
              </div>
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/80">
                {(['Approved', 'Pending', 'Rejected'] as const).map((st) => (
                  <button key={st} onClick={() => handleStatusChange(t._id, st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                      t.status === st
                        ? st === 'Approved' ? 'bg-green-500 text-white' : st === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}>
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-card border border-dashed border-border rounded-xl flex flex-col items-center gap-2">
            <Quote className="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
            <p className="text-xs text-muted-foreground">No testimonials found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
